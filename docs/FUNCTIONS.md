# 🔧 Wine Memo Functions Reference

This document provides a comprehensive list of all functions, API endpoints, and components in the Wine Memo application.

## 📡 API Endpoints

### Wine Management API

#### `POST /api/wine/create`
Creates a new wine record in Firestore.

**Request Body:**
```typescript
{
  name: string;                    // Wine name (required)
  characteristics: {               // Wine characteristics (required)
    sweetness: number;             // 1-5 scale
    body: number;                  // 1-5 scale
    acidity: number;               // 1-5 scale
    tannin: number;                // 1-5 scale
    bitterness: number;            // 1-5 scale
  };
  notes?: string;                  // Optional notes
  rating?: number;                 // 1-5 star rating
  region?: string;                 // Wine region
  vintage?: string;                // Vintage year
  grapeVariety?: string;           // Grape variety
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  wine: WineRecord;
}
```

#### `GET /api/wine/list`
Retrieves all wine records from Firestore, ordered by creation date (newest first).

**Response:**
```typescript
{
  success: boolean;
  wines: WineRecord[];
  count: number;
}
```

#### `PUT /api/wine/update/[id]`
Updates an existing wine record by ID.

**Request Body:**
```typescript
{
  name?: string;
  characteristics?: WineCharacteristics;
  notes?: string;
  rating?: number;
  region?: string;
  vintage?: string;
  grapeVariety?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  wine: WineRecord;
}
```

#### `DELETE /api/wine/delete/[id]`
Deletes a wine record by ID.

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

### Image Upload & OCR API

#### `POST /api/wine/upload-image`
Uploads a wine label image to Firebase Storage.

**Request:**
- `FormData` with:
  - `image`: File (required, max 10MB, image files only)
  - `wineId`: string (optional)

**Response:**
```typescript
{
  success: boolean;
  message: string;
  imageUrl: string;
}
```

#### `POST /api/wine/process-ocr`
Triggers OCR processing for a wine label image.

**Request Body:**
```typescript
{
  imageUrl: string;    // URL of the uploaded image
  wineId: string;      // Wine record ID
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: OCRResult;
}
```

## 🔥 Firebase Functions

### Cloud Functions

#### `extractWineLabelText`
**Trigger:** Firebase Storage object finalization
**Purpose:** Automatic OCR processing when wine label images are uploaded

**Configuration:**
- Timeout: 540 seconds
- Memory: 2GB
- Trigger: Storage object finalization in `wine-labels/` path

**Process:**
1. Downloads image from Cloud Storage
2. Preprocesses image using Sharp (resize, sharpen, normalize)
3. Runs Tesseract OCR with English and Japanese language support
4. Parses extracted text for wine information
5. Updates Firestore wine record with OCR data

#### `processWineLabelHttp`
**Trigger:** HTTP POST request
**Purpose:** Manual OCR processing via HTTP endpoint

**Endpoint:** `https://[region]-[project-id].cloudfunctions.net/processWineLabelHttp`

**Request Body:**
```typescript
{
  imageUrl: string;    // URL of the image to process
  wineId: string;      // Wine record ID to update
}
```

**Response:**
```typescript
{
  success: boolean;
  data: OCRResult;
}
```

### OCR Processing Functions

#### `processWineLabelImage(object: StorageObjectMetadata)`
Core OCR processing function used by both Cloud Functions.

**Features:**
- Image preprocessing with Sharp
- Tesseract OCR with English + Japanese support
- Wine information extraction:
  - Wine name
  - Grape variety
  - Region
  - Vintage
  - Producer
- Automatic Firestore updates

#### `parseWineLabelText(text: string)`
Parses OCR-extracted text to identify wine information.

**Extraction Logic:**
- **Wine Name:** First prominent line (3-50 characters, no leading digits)
- **Grape Variety:** Matches against 20+ common grape varieties
- **Region:** Matches against 20+ wine regions
- **Vintage:** 4-digit year pattern (19xx or 20xx)
- **Producer:** Lines containing keywords (Winery, Vineyards, Estate, etc.)

#### `updateWineWithOCRData(wineId: string, ocrData: OCRResult)`
Updates Firestore wine record with extracted OCR data.

**Updates:**
- Wine name, grape variety, region, vintage, producer
- OCR metadata (extracted text, processing timestamp)
- Record update timestamp

## ⚛️ React Components

### Chart Components

#### `RaderChart`
Radar chart component for displaying wine characteristics.

**Props:**
```typescript
{
  data: {
    sweetness: number;
    body: number;
    acidity: number;
    tannin: number;
    bitterness: number;
  };
  size?: number;           // Chart size in pixels
  color?: string;          // Chart color
  showLabels?: boolean;    // Show axis labels
}
```

**Features:**
- Interactive radar chart
- Customizable size and colors
- Japanese localization
- Responsive design

#### `WineChart`
Bar chart component for wine characteristics comparison.

**Props:**
```typescript
{
  characteristics: WineCharacteristics;
  wineName?: string;
  showTitle?: boolean;
}
```

#### `WineLadderChart`
Ladder-style chart for wine rating visualization.

**Props:**
```typescript
{
  rating: number;          // 1-5 rating
  wineName?: string;
  showLabels?: boolean;
}
```

### PWA Components

#### `PWAInstallPrompt`
Progressive Web App installation prompt component.

**Features:**
- Detects PWA installability
- Shows custom install prompt
- Handles installation events
- Japanese localization

#### `PWAStatus`
Displays PWA installation and update status.

**Features:**
- Shows current PWA status
- Update notifications
- Installation state tracking

### Utility Components

#### `ImageUpload`
Wine label image upload component with OCR integration.

**Props:**
```typescript
{
  wineId?: string;                    // Wine record ID
  onImageUploaded?: (url: string) => void;
  onOCRCompleted?: (data: any) => void;
  maxSize?: number;                   // Max file size in bytes
  acceptedTypes?: string[];           // Accepted file types
}
```

**Features:**
- Drag & drop file upload
- Image preview
- Automatic OCR processing
- Progress indicators
- Error handling
- File validation

## 📊 Data Types

### WineCharacteristics
```typescript
{
  sweetness: number;    // 1-5 scale
  body: number;         // 1-5 scale
  acidity: number;      // 1-5 scale
  tannin: number;       // 1-5 scale
  bitterness: number;   // 1-5 scale
}
```

### WineRecord
```typescript
{
  id: string;
  name: string;
  characteristics: WineCharacteristics;
  notes?: string;
  rating?: number;
  region?: string;
  vintage?: string;
  grapeVariety?: string;
  imageUrl?: string;
  producer?: string;
  createdAt: string;
  updatedAt: string;
  ocrData?: {
    extractedText: string;
    processedAt: Timestamp;
  };
}
```

### OCRResult
```typescript
{
  wineName?: string;
  grapeVariety?: string;
  region?: string;
  vintage?: string;
  producer?: string;
  fullText: string;
}
```

## 🔧 Utility Functions

### Firebase Utilities
- `adminDb`: Firebase Admin SDK instance
- `clientDb`: Firebase Client SDK instance
- Storage bucket management
- Firestore operations

### Schema Validation
- `WineCreateSchema`: Zod schema for wine creation
- `WineUpdateSchema`: Zod schema for wine updates
- `WineResponseSchema`: Zod schema for wine responses

### Image Processing
- Sharp image preprocessing
- Tesseract OCR configuration
- File upload validation
- Storage URL generation

## 🚀 Usage Examples

### Creating a Wine Record
```typescript
const response = await fetch('/api/wine/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Château Margaux 2015',
    characteristics: {
      sweetness: 2,
      body: 5,
      acidity: 3,
      tannin: 5,
      bitterness: 4
    },
    region: 'Bordeaux',
    vintage: '2015',
    grapeVariety: 'Cabernet Sauvignon'
  })
});
```

### Uploading and Processing Wine Label
```typescript
// Upload image
const formData = new FormData();
formData.append('image', file);
formData.append('wineId', wineId);

const uploadResponse = await fetch('/api/wine/upload-image', {
  method: 'POST',
  body: formData
});

// Process OCR
const ocrResponse = await fetch('/api/wine/process-ocr', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageUrl: uploadResponse.imageUrl,
    wineId: wineId
  })
});
```

### Using Chart Components
```typescript
import { RaderChart, WineChart } from '@/components';

function WineDisplay({ wine }) {
  return (
    <div>
      <RaderChart data={wine.characteristics} />
      <WineChart characteristics={wine.characteristics} wineName={wine.name} />
    </div>
  );
}
```

---

For setup instructions, see [Setup Guides](./setup/README.md).
For architecture details, see [Architecture Documentation](./architecture/README.md). 