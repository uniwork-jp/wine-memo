# Schema-Driven Infrastructure: Zod ↔ Terraform

This document explains how we maintain consistency between our Zod validation schemas and Terraform Firebase infrastructure.

## Overview

Our infrastructure is **schema-driven**, meaning:
- **Zod schemas** define data validation rules
- **Terraform configurations** are automatically generated from these schemas
- **Firestore indexes** are created to match the query patterns defined in our schemas

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Zod Schemas   │───▶│  Index Generator │───▶│ Terraform Config│
│  (Validation)   │    │   (TypeScript)   │    │   (Infrastructure)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Files Structure

```
lib/
├── zodSchemas.ts              # Zod validation schemas
└── firestoreIndexes.ts        # Index definitions & generators

scripts/
└── generate-terraform-indexes.ts  # Script to generate Terraform config

infra/firebase/
├── main.tf                    # Core infrastructure
├── generated-indexes.tf       # Auto-generated indexes
└── ...
```

## How It Works

### 1. Zod Schema Definition (`lib/zodSchemas.ts`)

```typescript
export const WineCreateSchema = z.object({
  name: z.string().min(1).max(100),
  characteristics: WineCharacteristicsSchema,
  rating: z.number().min(1).max(5).optional(),
  region: z.string().max(100).optional(),
  // ...
});
```

### 2. Index Definition (`lib/firestoreIndexes.ts`)

```typescript
export const generateWineIndexes = (): FirestoreIndex[] => [
  {
    name: 'wines_rating',
    collection: 'wines',
    fields: [
      { field_path: 'rating', order: 'DESCENDING' },
      { field_path: 'createdAt', order: 'DESCENDING' }
    ],
    description: 'Index for rating-based queries',
    query_patterns: [
      'collection("wines").where("rating", ">=", 4)',
      'collection("wines").orderBy("rating", "desc")'
    ]
  }
];
```

### 3. Terraform Generation

Run the generator:
```bash
pnpm run generate-indexes
```

This creates `infra/firebase/generated-indexes.tf`:
```hcl
# Index for rating-based queries
resource "google_firestore_index" "wines_rating" {
  collection = "wines"
  depends_on = [google_firestore_database.database]
  
  fields {
    field_path = "rating"
    order      = "DESCENDING"
  }
  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
}
```

## Benefits

### ✅ **Consistency**
- Indexes always match schema fields
- No orphaned indexes for non-existent fields
- Validation ensures data integrity

### ✅ **Maintainability**
- Single source of truth (Zod schemas)
- Automatic index generation
- Easy to add new fields and indexes

### ✅ **Performance**
- Optimized indexes for actual query patterns
- No unnecessary indexes
- Query performance validation

### ✅ **Documentation**
- Self-documenting infrastructure
- Clear relationship between schemas and indexes
- Query pattern examples included

## Workflow

### Adding a New Field

1. **Update Zod schema** in `lib/zodSchemas.ts`
2. **Add index definition** in `lib/firestoreIndexes.ts`
3. **Generate Terraform config**: `pnpm run generate-indexes`
4. **Apply changes**: `terraform apply`

### Example: Adding a "price" field

```typescript
// 1. Update Zod schema
export const WineCreateSchema = z.object({
  // ... existing fields
  price: z.number().min(0).max(10000).optional(),
});

// 2. Add index definition
{
  name: 'wines_price',
  collection: 'wines',
  fields: [
    { field_path: 'price', order: 'ASCENDING' },
    { field_path: 'createdAt', order: 'DESCENDING' }
  ],
  description: 'Index for price-based queries',
  query_patterns: [
    'collection("wines").where("price", "<=", 50)',
    'collection("wines").orderBy("price", "asc")'
  ]
}

// 3. Generate and apply
pnpm run generate-indexes
terraform apply
```

## Validation

The system includes automatic validation:

- **Field validation**: Ensures all index fields exist in Zod schemas
- **Type validation**: Validates field types match schema types
- **Query pattern validation**: Ensures indexes support actual queries

## Best Practices

1. **Always update schemas first** before adding indexes
2. **Use descriptive names** for indexes that match their purpose
3. **Include query patterns** in index definitions for documentation
4. **Run validation** before applying changes
5. **Test queries** after index creation

## Troubleshooting

### Common Issues

1. **Field not found in schema**
   - Ensure the field exists in Zod schema
   - Check field path spelling

2. **Index creation fails**
   - Verify field types match
   - Check for duplicate index names

3. **Query performance issues**
   - Review query patterns
   - Ensure indexes match actual queries

### Commands

```bash
# Generate indexes from schemas
pnpm run generate-indexes

# Validate schemas and indexes
pnpm run validate-schemas

# Apply infrastructure changes
cd infra/firebase && terraform apply
```

## Future Enhancements

- [ ] Automatic query pattern detection
- [ ] Performance monitoring integration
- [ ] Schema migration tools
- [ ] Index usage analytics 

## ✅ **Schema-Driven Infrastructure Created**

### **1. Core Components:**
- **`lib/firestoreIndexes.ts`** - Defines indexes based on Zod schemas
- **`scripts/generate-terraform-indexes.ts`** - Generates Terraform config
- **`infra/firebase/generated-indexes.tf`** - Auto-generated Terraform indexes
- **`docs/schema-driven-infrastructure.md`** - Complete documentation

### **2. Key Features:**
- ✅ **Automatic validation** - Ensures indexes match Zod schema fields
- ✅ **Query pattern documentation** - Each index includes example queries
- ✅ **Type safety** - Full TypeScript support
- ✅ **Single source of truth** - Zod schemas drive infrastructure

### **3. Workflow:**
```bash
# Generate Terraform indexes from Zod schemas
pnpm run generate-indexes

# Apply infrastructure changes
cd infra/firebase && terraform apply
```

### **4. Benefits:**
- **Consistency**: Indexes always match your data schemas
- **Maintainability**: Update schemas → regenerate indexes automatically
- **Performance**: Optimized indexes for actual query patterns
- **Documentation**: Self-documenting with query examples

### **5. Example Relationship:**
```typescript
// Zod Schema
WineCreateSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  region: z.string().max(100).optional(),
})

// Generated Terraform Index
resource "google_firestore_index" "wines_rating" {
  fields {
    field_path = "rating"      // ← Matches Zod schema
    order      = "DESCENDING"
  }
}
```

The system is now **schema-driven** - your Zod validation schemas are the single source of truth for both data validation and infrastructure configuration! 🚀 