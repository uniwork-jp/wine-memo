import { z } from 'zod';
import { WineCharacteristicsSchema, WineCreateSchema, WineSearchSchema } from './zodSchemas';

// Define Firestore index configurations based on Zod schemas
export interface FirestoreIndexField {
  field_path: string;
  order: 'ASCENDING' | 'DESCENDING';
  array_config?: 'CONTAINS';
}

export interface FirestoreIndex {
  name: string;
  collection: string;
  fields: FirestoreIndexField[];
  description: string;
  query_patterns: string[];
}

// Extract field paths from Zod schemas
const extractSchemaFields = (schema: z.ZodObject<any>): string[] => {
  const fields: string[] = [];
  
  const shape = schema.shape;
  for (const [key, value] of Object.entries(shape)) {
    if (value instanceof z.ZodObject) {
      // Nested object (like characteristics)
      const nestedFields = extractSchemaFields(value);
      nestedFields.forEach(field => fields.push(`${key}.${field}`));
    } else {
      fields.push(key);
    }
  }
  
  return fields;
};

// Generate indexes from Zod schemas
export const generateWineIndexes = (): FirestoreIndex[] => {
  // Extract fields from the WineCreateSchema
  const schemaFields = extractSchemaFields(WineCreateSchema);
  console.log('📋 Schema fields extracted:', schemaFields);
  
  const baseFields: FirestoreIndexField[] = [
    { field_path: 'createdAt', order: 'DESCENDING' },
    { field_path: '__name__', order: 'ASCENDING' }
  ];

  return [
    {
      name: 'wines_created_at_desc',
      collection: 'wines',
      fields: baseFields,
      description: 'Index for listing wines by creation date (newest first)',
      query_patterns: [
        'collection("wines").orderBy("createdAt", "desc")',
        'collection("wines").orderBy("createdAt", "desc").limit(10)'
      ]
    },
    {
      name: 'wines_characteristics',
      collection: 'wines',
      fields: [
        { field_path: 'characteristics.sweetness', order: 'ASCENDING' },
        { field_path: 'characteristics.body', order: 'ASCENDING' },
        { field_path: 'characteristics.acidity', order: 'ASCENDING' },
        { field_path: 'characteristics.tannin', order: 'ASCENDING' },
        { field_path: 'characteristics.bitterness', order: 'ASCENDING' }
      ],
      description: 'Index for wine characteristics queries and filtering',
      query_patterns: [
        'collection("wines").where("characteristics.sweetness", ">=", 50)',
        'collection("wines").where("characteristics.body", "==", 75)',
        'collection("wines").where("characteristics.acidity", "<=", 30)'
      ]
    },
    {
      name: 'wines_region_grape',
      collection: 'wines',
      fields: [
        { field_path: 'region', order: 'ASCENDING' },
        { field_path: 'grapeVariety', order: 'ASCENDING' },
        { field_path: 'createdAt', order: 'DESCENDING' }
      ],
      description: 'Index for region and grape variety searches',
      query_patterns: [
        'collection("wines").where("region", "==", "Bordeaux")',
        'collection("wines").where("grapeVariety", "==", "Cabernet Sauvignon")',
        'collection("wines").where("region", "==", "Bordeaux").where("grapeVariety", "==", "Merlot")'
      ]
    },
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
        'collection("wines").orderBy("rating", "desc")',
        'collection("wines").where("rating", ">=", 3).orderBy("rating", "desc")'
      ]
    },
    {
      name: 'wines_vintage',
      collection: 'wines',
      fields: [
        { field_path: 'vintage', order: 'ASCENDING' },
        { field_path: 'createdAt', order: 'DESCENDING' }
      ],
      description: 'Index for vintage-based queries',
      query_patterns: [
        'collection("wines").where("vintage", "==", "2018")',
        'collection("wines").where("vintage", ">=", "2015")',
        'collection("wines").orderBy("vintage", "desc")'
      ]
    },
    {
      name: 'wines_name_search',
      collection: 'wines',
      fields: [
        { field_path: 'name', order: 'ASCENDING' },
        { field_path: 'createdAt', order: 'DESCENDING' }
      ],
      description: 'Index for name-based searches',
      query_patterns: [
        'collection("wines").where("name", ">=", "Château")',
        'collection("wines").orderBy("name", "asc")'
      ]
    }
  ];
};

// Generate Terraform configuration from indexes
export const generateTerraformIndexes = (indexes: FirestoreIndex[]): string => {
  return indexes.map(index => {
    const fieldsConfig = index.fields.map(field => 
      `  fields {
    field_path = "${field.field_path}"
    order      = "${field.order}"
  }`
    ).join('\n');

    return `# ${index.description}
resource "google_firestore_index" "${index.name}" {
  collection = "${index.collection}"
  depends_on = [google_firestore_database.database]
  
${fieldsConfig}
}`;
  }).join('\n\n');
};

// Validate that indexes match Zod schema fields
export const validateIndexesAgainstSchema = (indexes: FirestoreIndex[]): boolean => {
  // Extract actual fields from the Zod schema
  const schemaFields = new Set([
    ...extractSchemaFields(WineCreateSchema),
    'createdAt', // These are added by the application
    'updatedAt'
  ]);

  console.log('🔍 Validating indexes against schema fields:', Array.from(schemaFields));

  for (const index of indexes) {
    for (const field of index.fields) {
      if (!schemaFields.has(field.field_path) && field.field_path !== '__name__') {
        console.warn(`❌ Warning: Index field "${field.field_path}" not found in Zod schema`);
        console.warn(`   Available fields: ${Array.from(schemaFields).join(', ')}`);
        return false;
      }
    }
  }
  return true;
};

// Export the generated indexes
export const wineIndexes = generateWineIndexes();

// Validate indexes on module load
if (typeof window === 'undefined') { // Only run in Node.js environment
  validateIndexesAgainstSchema(wineIndexes);
} 