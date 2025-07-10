import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as tesseract from 'node-tesseract-ocr';
import * as sharp from 'sharp';
import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucket = storage.bucket(functions.config().firebase.storage_bucket || process.env.FIREBASE_STORAGE_BUCKET);

interface OCRResult {
  wineName?: string;
  grapeVariety?: string;
  region?: string;
  vintage?: string;
  producer?: string;
  fullText: string;
}

export async function processWineLabelImage(object: functions.storage.ObjectMetadata): Promise<OCRResult | null> {
  try {
    console.log(`Starting OCR processing for: ${object.name}`);

    // Download the image from Cloud Storage
    const file = bucket.file(object.name!);
    const [imageBuffer] = await file.download();

    // Preprocess the image for better OCR results
    const processedImageBuffer = await sharp(imageBuffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .sharpen()
      .normalize()
      .toBuffer();

    // Configure Tesseract options
    const config = {
      lang: 'eng+jpn', // English and Japanese
      oem: 1, // OCR Engine Mode: LSTM only
      psm: 3, // Page Segmentation Mode: Fully automatic page segmentation
      dpi: 300,
      preprocess: 'contrast', // Apply contrast preprocessing
    };

    // Perform OCR
    console.log('Running Tesseract OCR...');
    const text = await tesseract.recognize(processedImageBuffer, config);
    console.log('OCR completed. Extracted text:', text);

    // Parse the extracted text
    const parsedData = parseWineLabelText(text);

    // Update Firestore with OCR results if wineId is provided
    if (object.metadata?.wineId) {
      await updateWineWithOCRData(object.metadata.wineId, parsedData);
    }

    return parsedData;
  } catch (error) {
    console.error('Error in OCR processing:', error);
    throw error;
  }
}

function parseWineLabelText(text: string): OCRResult {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const result: OCRResult = { fullText: text };

  // Common wine-related keywords
  const grapeVarieties = [
    'Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Chardonnay', 'Sauvignon Blanc',
    'Syrah', 'Shiraz', 'Malbec', 'Nebbiolo', 'Sangiovese', 'Tempranillo',
    'Riesling', 'Pinot Grigio', 'Gewürztraminer', 'Viognier', 'Grenache',
    'Cabernet Franc', 'Petit Verdot', 'Carménère', 'Barbera', 'Dolcetto'
  ];

  const regions = [
    'Bordeaux', 'Burgundy', 'Champagne', 'Rhône', 'Loire', 'Alsace',
    'Tuscany', 'Piedmont', 'Veneto', 'Sicily', 'Rioja', 'Ribera del Duero',
    'Napa Valley', 'Sonoma', 'Willamette Valley', 'Marlborough', 'Barossa Valley',
    'Hunter Valley', 'Mosel', 'Rheingau', 'Douro', 'Alentejo'
  ];

  // Extract wine name (usually the first prominent line)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line.length > 3 && line.length < 50 && !line.match(/^\d/)) {
      result.wineName = line;
      break;
    }
  }

  // Extract grape variety
  for (const line of lines) {
    for (const grape of grapeVarieties) {
      if (line.toLowerCase().includes(grape.toLowerCase())) {
        result.grapeVariety = grape;
        break;
      }
    }
    if (result.grapeVariety) break;
  }

  // Extract region
  for (const line of lines) {
    for (const region of regions) {
      if (line.toLowerCase().includes(region.toLowerCase())) {
        result.region = region;
        break;
      }
    }
    if (result.region) break;
  }

  // Extract vintage (4-digit year)
  const vintageMatch = text.match(/\b(19|20)\d{2}\b/);
  if (vintageMatch) {
    result.vintage = vintageMatch[0];
  }

  // Extract producer (usually contains words like "Winery", "Vineyards", "Estate")
  const producerKeywords = ['Winery', 'Vineyards', 'Estate', 'Château', 'Domaine', 'Bodega'];
  for (const line of lines) {
    for (const keyword of producerKeywords) {
      if (line.includes(keyword)) {
        result.producer = line.trim();
        break;
      }
    }
    if (result.producer) break;
  }

  return result;
}

async function updateWineWithOCRData(wineId: string, ocrData: OCRResult): Promise<void> {
  try {
    const db = admin.firestore();
    const wineRef = db.collection('wines').doc(wineId);

    const updateData: any = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Only update fields that were successfully extracted and are not already set
    if (ocrData.wineName) {
      updateData.name = ocrData.wineName;
    }
    if (ocrData.grapeVariety) {
      updateData.grapeVariety = ocrData.grapeVariety;
    }
    if (ocrData.region) {
      updateData.region = ocrData.region;
    }
    if (ocrData.vintage) {
      updateData.vintage = ocrData.vintage;
    }
    if (ocrData.producer) {
      updateData.producer = ocrData.producer;
    }

    // Add OCR metadata
    updateData.ocrData = {
      extractedText: ocrData.fullText,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await wineRef.update(updateData);
    console.log(`Updated wine ${wineId} with OCR data`);
  } catch (error) {
    console.error('Error updating wine with OCR data:', error);
    throw error;
  }
} 