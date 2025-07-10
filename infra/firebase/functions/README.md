# Wine Memo Firebase Functions

This directory contains Firebase Functions for the Wine Memo application, including OCR (Optical Character Recognition) functionality for wine label images.

## Features

- **Image Upload Processing**: Automatically processes uploaded wine label images
- **OCR Text Extraction**: Uses Tesseract OCR to extract text from wine labels
- **Wine Data Parsing**: Automatically extracts wine name, grape variety, region, vintage, and producer
- **Firestore Integration**: Updates wine records with extracted data

## Prerequisites

1. **Tesseract OCR**: Must be installed on the deployment environment
2. **Firebase CLI**: For deployment
3. **Node.js 18**: Runtime environment

## Setup

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Tesseract OCR locally:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install tesseract-ocr tesseract-ocr-eng tesseract-ocr-jpn
   
   # macOS
   brew install tesseract tesseract-lang
   
   # Windows
   # Download from https://github.com/UB-Mannheim/tesseract/wiki
   ```

3. Set up Firebase emulator:
   ```bash
   firebase emulators:start --only functions
   ```

### Deployment

1. Build the functions:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy --only functions
   ```

## Functions

### `extractWineLabelText`

Triggered when a wine label image is uploaded to Firebase Storage.

**Trigger**: Storage object finalize
**Path**: `wine-labels/{wineId}/{filename}`

**Features**:
- Downloads the image from Cloud Storage
- Preprocesses the image for better OCR results
- Extracts text using Tesseract OCR
- Parses wine-related information
- Updates the corresponding wine record in Firestore

### `processWineLabelHttp`

HTTP endpoint for manual OCR processing.

**Endpoint**: `POST /processWineLabelHttp`

**Request Body**:
```json
{
  "imageUrl": "https://storage.googleapis.com/bucket/image.jpg",
  "wineId": "wine-document-id"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "wineName": "Château Margaux",
    "grapeVariety": "Cabernet Sauvignon",
    "region": "Bordeaux",
    "vintage": "2015",
    "producer": "Château Margaux",
    "fullText": "Extracted text from image..."
  }
}
```

## OCR Configuration

The OCR function uses the following Tesseract configuration:

- **Language**: English + Japanese (`eng+jpn`)
- **OCR Engine**: LSTM only (`oem: 1`)
- **Page Segmentation**: Fully automatic (`psm: 3`)
- **DPI**: 300
- **Preprocessing**: Contrast enhancement

## Image Processing

Images are preprocessed using Sharp before OCR:

1. **Resize**: Maximum 1200x1200 pixels (maintains aspect ratio)
2. **Sharpen**: Enhances text clarity
3. **Normalize**: Improves contrast

## Supported Wine Information

The OCR parser can extract:

- **Wine Name**: Usually the first prominent text line
- **Grape Variety**: Common varieties like Cabernet Sauvignon, Merlot, etc.
- **Region**: Major wine regions like Bordeaux, Burgundy, Napa Valley, etc.
- **Vintage**: 4-digit year (1900-2099)
- **Producer**: Contains keywords like "Winery", "Vineyards", "Estate"

## Error Handling

- Invalid image formats are rejected
- OCR failures are logged with detailed error messages
- Partial results are saved when possible
- Network timeouts are handled gracefully

## Monitoring

Functions include comprehensive logging:

- Image processing steps
- OCR extraction results
- Firestore update confirmations
- Error details for debugging

## Environment Variables

Required environment variables:

- `FIREBASE_STORAGE_BUCKET`: Storage bucket name
- `GOOGLE_CLOUD_PROJECT`: Google Cloud project ID

## Troubleshooting

### Common Issues

1. **Tesseract not found**: Ensure Tesseract is installed and in PATH
2. **Memory limits**: Functions are configured with 2GB memory
3. **Timeout issues**: Functions have 9-minute timeout (540 seconds)
4. **Language support**: Ensure Japanese language pack is installed for Japanese text

### Debugging

1. Check Firebase Functions logs:
   ```bash
   firebase functions:log
   ```

2. Test OCR locally:
   ```bash
   npm run serve
   ```

3. Verify Tesseract installation:
   ```bash
   tesseract --version
   tesseract --list-langs
   ``` 