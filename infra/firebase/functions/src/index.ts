import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { processWineLabelImage } from './ocr';

// Initialize Firebase Admin
admin.initializeApp();

// Export the OCR function
export const extractWineLabelText = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .storage
  .object()
  .onFinalize(async (object) => {
    try {
      // Only process wine label images
      if (!object.name?.includes('wine-labels/')) {
        return;
      }

      console.log(`Processing wine label image: ${object.name}`);
      
      const result = await processWineLabelImage(object);
      
      if (result) {
        console.log('OCR processing completed successfully');
      }
    } catch (error) {
      console.error('Error processing wine label image:', error);
    }
  });

// HTTP function for manual OCR processing
export const processWineLabelHttp = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .https
  .onRequest(async (req, res) => {
    try {
      // Enable CORS
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
      }

      if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
      }

      const { imageUrl, wineId } = req.body;

      if (!imageUrl || !wineId) {
        res.status(400).json({ error: 'imageUrl and wineId are required' });
        return;
      }

      // Create a mock object for the OCR function
      const mockObject = {
        name: imageUrl,
        bucket: functions.config().firebase.storage_bucket,
        metadata: { wineId }
      };

      const result = await processWineLabelImage(mockObject);
      
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error in HTTP OCR function:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }); 