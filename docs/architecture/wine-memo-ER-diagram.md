# Wine Memo - Entity Relationship Diagram

## Database Schema Overview

This ER diagram represents the data model for the Wine Memo application, which uses Firebase Firestore as the primary database and Firebase Storage for image files.

```mermaid
erDiagram
    %% Main Wine Entity
    WINES {
        string id PK "Document ID"
        string name "Wine name (1-100 chars)"
        object characteristics "Wine characteristics object"
        string notes "Optional notes (max 1000 chars)"
        number rating "Optional rating (1-5)"
        string vintage "Optional vintage (max 10 chars)"
        string region "Optional region (max 100 chars)"
        string grapeVariety "Optional grape variety (max 100 chars)"
        string imageUrl "Optional image URL from Storage"
        string createdAt "ISO timestamp"
        string updatedAt "ISO timestamp"
    }

    %% Wine Characteristics Embedded Object
    WINE_CHARACTERISTICS {
        number sweetness "0-100 scale"
        number body "0-100 scale"
        number acidity "0-100 scale"
        number tannin "0-100 scale"
        number bitterness "0-100 scale"
    }

    %% Firebase Authentication Users (External)
    USERS {
        string uid PK "Firebase Auth UID"
        string email "User email"
        string displayName "User display name"
        string creationTime "Account creation time"
        string lastSignInTime "Last sign-in time"
    }

    %% Wine Label Images in Storage
    WINE_LABELS {
        string filename PK "Storage path"
        string wineId FK "Reference to wine"
        string originalName "Original file name"
        string contentType "MIME type"
        number size "File size in bytes"
        string uploadedAt "Upload timestamp"
        string imageUrl "Public access URL"
    }

    %% OCR Processing Results
    OCR_RESULTS {
        string id PK "Processing ID"
        string wineId FK "Reference to wine"
        string imageUrl "Source image URL"
        string extractedText "Raw OCR text"
        object parsedData "Structured wine data"
        string processedAt "Processing timestamp"
        string status "Processing status"
    }

    %% Parsed Wine Data from OCR
    PARSED_WINE_DATA {
        string wineName "Extracted wine name"
        string grapeVariety "Extracted grape variety"
        string region "Extracted region"
        string vintage "Extracted vintage"
        string producer "Extracted producer"
        number confidence "OCR confidence score"
    }

    %% Relationships
    WINES ||--|| WINE_CHARACTERISTICS : "contains"
    WINES ||--o{ WINE_LABELS : "has"
    WINES ||--o{ OCR_RESULTS : "processed_by"
    WINE_LABELS ||--|| OCR_RESULTS : "generates"
    OCR_RESULTS ||--|| PARSED_WINE_DATA : "contains"
    USERS ||--o{ WINES : "creates"
    USERS ||--o{ WINE_LABELS : "uploads"

    %% Notes about relationships
    %% Users are managed by Firebase Auth, not stored in Firestore
    %% Wine characteristics are embedded objects, not separate collections
    %% OCR results are temporary processing data
    %% Parsed wine data is embedded in OCR results
```

## Collection Structure in Firestore

### Main Collections

1. **`wines`** - Primary collection for wine records
   - Document ID: Auto-generated or timestamp-based
   - Fields: All wine properties including embedded characteristics

2. **No separate collections for:**
   - Users (managed by Firebase Auth)
   - Wine characteristics (embedded in wine documents)
   - OCR results (temporary processing data)

### Storage Structure

1. **`wine-labels/`** - Firebase Storage bucket
   - Path: `wine-labels/{wineId}/{timestamp}-{filename}`
   - Public access for image display

### Indexes (Auto-generated from Zod schemas)

```mermaid
graph TD
    A[Zod Schemas] --> B[Index Generator]
    B --> C[Terraform Config]
    C --> D[Firestore Indexes]
    
    D --> E[wines_created_at_desc]
    D --> F[wines_characteristics]
    D --> G[wines_region_grape]
    D --> H[wines_rating]
    D --> I[wines_vintage]
    D --> J[wines_name_search]
```

## Key Features

### Schema-Driven Architecture
- **Zod schemas** define validation rules
- **Auto-generated indexes** from schema patterns
- **Type-safe operations** with TypeScript

### Security Rules
- Authenticated users can read all wines
- Authenticated users can create/update/delete wines
- Image uploads require authentication
- OCR processing via Firebase Functions

### Data Flow
1. User creates wine record → Firestore
2. User uploads image → Firebase Storage
3. Image triggers OCR → Firebase Functions
4. OCR results update wine record → Firestore

## Validation Rules

### Wine Creation Schema
- Name: Required, 1-100 characters
- Characteristics: Required object with 5 numeric fields (0-100)
- Optional fields: notes, rating, vintage, region, grapeVariety
- Timestamps: Auto-generated on creation/update

### Wine Update Schema
- ID: Required for identification
- All other fields: Optional for partial updates
- UpdatedAt: Auto-updated on modification

### Search Schema
- Characteristics: Partial matching with tolerance
- Region, grapeVariety: Exact string matching
- Rating: Range-based filtering
- Pagination: Limit and offset support 