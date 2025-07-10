# Wine Memo - Image Upload & OCR Setup Guide

This guide explains how to set up and use the image upload and OCR (Optical Character Recognition) functionality for wine label processing in the Wine Memo application.

## Overview

The image upload and OCR feature allows users to:
1. Upload wine label images
2. Automatically extract text from the images using Tesseract OCR
3. Parse wine information (name, grape variety, region, vintage, producer)
4. Auto-fill wine record fields with extracted data

## Architecture

```
User Upload → Next.js API → Firebase Storage → Firebase Functions → Tesseract OCR → Firestore Update
```

### Components

1. **Frontend**: React component for image upload and OCR display
2. **API Endpoints**: 
   - `/api/wine/upload-image` - Image upload to Firebase Storage
   - `/api/wine/process-ocr` - Trigger OCR processing
3. **Firebase Functions**: 
   - `extractWineLabelText` - Automatic OCR on image upload
   - `processWineLabelHttp` - Manual OCR processing
4. **Infrastructure**: Terraform configuration for Firebase Storage and Functions

## Prerequisites

### 1. Firebase Project Setup

Ensure your Firebase project has the following services enabled:
- Firestore Database
- Cloud Storage
- Cloud Functions
- Cloud Build

### 2. Tesseract OCR Installation

#### Local Development (macOS)
```bash
brew install tesseract tesseract-lang
```

#### Local Development (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr tesseract-ocr-eng tesseract-ocr-jpn
```

#### Local Development (Windows)
Download from: https://github.com/UB-Mannheim/tesseract/wiki

#### Production (Firebase Functions)
Tesseract is automatically installed via the Dockerfile in the functions directory.

### 3. Environment Variables

Add the following to your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project-wine-labels
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Functions URL (after deployment)
FIREBASE_FUNCTIONS_URL=https://your-region-your_project.cloudfunctions.net
```

## Setup Instructions

### Step 1: Deploy Infrastructure

1. Navigate to the infrastructure directory:
   ```bash
   cd infra
   ```

2. Deploy Firebase infrastructure and functions:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

This will:
- Create Firebase Storage bucket for wine labels
- Enable required Google Cloud APIs
- Deploy Firebase Functions with OCR capabilities

### Step 2: Install Dependencies

1. Install frontend dependencies:
   ```bash
   cd apps/user-ui
   npm install
   ```

2. Install Firebase Functions dependencies:
   ```bash
   cd infra/firebase/functions
   npm install
   ```

### Step 3: Test the Setup

1. Start the development server:
   ```bash
   cd apps/user-ui
   npm run dev
   ```

2. Navigate to the wine record page and test image upload

## Usage

### For Users

1. **Upload Image**: Click "ワインラベル画像を選択" to select a wine label image
2. **Automatic OCR**: If a wine ID is provided, OCR processing starts automatically
3. **Manual OCR**: Click "OCR処理を実行" to manually trigger OCR processing
4. **Review Results**: View extracted wine information in the OCR results section
5. **Save Record**: The extracted data is automatically saved to the wine record

### For Developers

#### Adding Image Upload to a Form

```tsx
import { ImageUpload } from '@/components';

function WineForm({ wineId }: { wineId?: string }) {
  const handleImageUploaded = (imageUrl: string) => {
    // Handle image upload completion
    console.log('Image uploaded:', imageUrl);
  };

  const handleOCRCompleted = (ocrData: any) => {
    // Handle OCR completion
    console.log('OCR completed:', ocrData);
    // Auto-fill form fields with extracted data
  };

  return (
    <form>
      {/* Other form fields */}
      
      <ImageUpload
        wineId={wineId}
        onImageUploaded={handleImageUploaded}
        onOCRCompleted={handleOCRCompleted}
      />
      
      {/* Other form fields */}
    </form>
  );
}
```

#### API Integration

```typescript
// Upload image
const uploadImage = async (file: File, wineId?: string) => {
  const formData = new FormData();
  formData.append('image', file);
  if (wineId) formData.append('wineId', wineId);

  const response = await fetch('/api/wine/upload-image', {
    method: 'POST',
    body: formData,
  });

  return response.json();
};

// Process OCR
const processOCR = async (imageUrl: string, wineId: string) => {
  const response = await fetch('/api/wine/process-ocr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl, wineId }),
  });

  return response.json();
};
```

## OCR Capabilities

### Supported Languages
- English (primary)
- Japanese (secondary)

### Extracted Information
- **Wine Name**: First prominent text line
- **Grape Variety**: Common varieties (Cabernet Sauvignon, Merlot, etc.)
- **Region**: Major wine regions (Bordeaux, Burgundy, Napa Valley, etc.)
- **Vintage**: 4-digit year (1900-2099)
- **Producer**: Contains keywords (Winery, Vineyards, Estate, etc.)

### Image Requirements
- **Format**: JPG, PNG, GIF
- **Size**: Maximum 10MB
- **Quality**: Higher resolution images produce better OCR results
- **Orientation**: Automatic text orientation detection

## Troubleshooting

### Common Issues

1. **"Tesseract not found" Error**
   - Ensure Tesseract is installed and in PATH
   - For local development, install language packs: `tesseract-ocr-eng tesseract-ocr-jpn`

2. **Image Upload Fails**
   - Check file size (max 10MB)
   - Verify file format (JPG, PNG, GIF)
   - Ensure Firebase Storage bucket exists

3. **OCR Processing Fails**
   - Check Firebase Functions logs: `firebase functions:log`
   - Verify image quality and text clarity
   - Ensure proper image orientation

4. **Functions Deployment Fails**
   - Check Node.js version (requires 18)
   - Verify Firebase CLI is installed and authenticated
   - Ensure sufficient memory allocation (2GB configured)

### Debugging

1. **Check Function Logs**:
   ```bash
   firebase functions:log --only extractWineLabelText
   ```

2. **Test OCR Locally**:
   ```bash
   cd infra/firebase/functions
   npm run serve
   ```

3. **Verify Tesseract Installation**:
   ```bash
   tesseract --version
   tesseract --list-langs
   ```

4. **Test Image Processing**:
   ```bash
   # Test with a sample image
   tesseract sample-wine-label.jpg stdout -l eng+jpn
   ```

## Performance Considerations

### Optimization Tips

1. **Image Preprocessing**: Images are automatically resized and enhanced
2. **Caching**: OCR results are cached in Firestore
3. **Batch Processing**: Multiple images can be processed simultaneously
4. **Memory Management**: Functions configured with 2GB memory

### Monitoring

- Monitor function execution time and memory usage
- Track OCR accuracy and success rates
- Monitor storage costs for image uploads
- Review error logs for common issues

## Security

### Access Control
- Images are stored in Firebase Storage with public read access
- Functions require proper authentication
- API endpoints validate file types and sizes

### Data Privacy
- OCR data is stored in Firestore with wine records
- No external OCR services used (Tesseract runs locally)
- Image metadata includes upload timestamp and user context

## Cost Optimization

### Storage Costs
- Images are stored in Firebase Storage
- Consider implementing image compression
- Set up lifecycle policies for old images

### Function Costs
- Functions have 9-minute timeout
- 2GB memory allocation per function
- Monitor execution frequency and optimize triggers

## Future Enhancements

### Potential Improvements
1. **Multi-language Support**: Add more wine-producing regions
2. **Machine Learning**: Improve OCR accuracy with custom models
3. **Batch Processing**: Process multiple images simultaneously
4. **Image Enhancement**: Advanced preprocessing for better OCR
5. **Wine Database Integration**: Cross-reference with wine databases

### API Extensions
1. **Bulk Upload**: Upload multiple images at once
2. **OCR History**: Track OCR processing history
3. **Manual Correction**: Allow users to correct OCR results
4. **Export Features**: Export OCR data in various formats 