import { z } from 'zod';

// Wine characteristics schema
export const WineCharacteristicsSchema = z.object({
  sweetness: z.number().min(0).max(100),
  body: z.number().min(0).max(100),
  acidity: z.number().min(0).max(100),
  tannin: z.number().min(0).max(100),
  bitterness: z.number().min(0).max(100),
});

// OCR data schema
export const OCRDataSchema = z.object({
  extractedText: z.string(),
  processedAt: z.string(),
  wineName: z.string().optional(),
  grapeVariety: z.string().optional(),
  region: z.string().optional(),
  vintage: z.string().optional(),
  producer: z.string().optional(),
});

// Wine creation schema
export const WineCreateSchema = z.object({
  name: z.string().min(1, 'Wine name is required').max(100, 'Wine name must be less than 100 characters'),
  characteristics: WineCharacteristicsSchema,
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  rating: z.number().min(1).max(5).optional(),
  vintage: z.string().max(10, 'Vintage must be less than 10 characters').optional(),
  region: z.string().max(100, 'Region must be less than 100 characters').optional(),
  grapeVariety: z.string().max(100, 'Grape variety must be less than 100 characters').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  producer: z.string().max(100, 'Producer must be less than 100 characters').optional(),
});

// Wine update schema (all fields optional except id)
export const WineUpdateSchema = z.object({
  id: z.string().min(1, 'Wine ID is required'),
  name: z.string().min(1).max(100).optional(),
  characteristics: WineCharacteristicsSchema.partial().optional(),
  notes: z.string().max(1000).optional(),
  rating: z.number().min(1).max(5).optional(),
  vintage: z.string().max(10).optional(),
  region: z.string().max(100).optional(),
  grapeVariety: z.string().max(100).optional(),
  imageUrl: z.string().url().optional(),
  producer: z.string().max(100).optional(),
});

// Wine search schema
export const WineSearchSchema = z.object({
  characteristics: WineCharacteristicsSchema.partial().optional(),
  region: z.string().optional(),
  grapeVariety: z.string().optional(),
  minRating: z.number().min(1).max(5).optional(),
  maxRating: z.number().min(1).max(5).optional(),
});

// Wine response schema
export const WineResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  characteristics: WineCharacteristicsSchema,
  notes: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  vintage: z.string().optional(),
  region: z.string().optional(),
  grapeVariety: z.string().optional(),
  imageUrl: z.string().optional(),
  producer: z.string().optional(),
  ocrData: OCRDataSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Image upload response schema
export const ImageUploadResponseSchema = z.object({
  success: z.boolean(),
  imageUrl: z.string().optional(),
  error: z.string().optional(),
});

// OCR processing response schema
export const OCRResponseSchema = z.object({
  success: z.boolean(),
  data: OCRDataSchema.optional(),
  error: z.string().optional(),
});

// API response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  details: z.any().optional(),
});

// Wine list response schema
export const WineListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(WineResponseSchema),
  total: z.number(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// Type exports
export type WineCharacteristics = z.infer<typeof WineCharacteristicsSchema>;
export type WineCreate = z.infer<typeof WineCreateSchema>;
export type WineUpdate = z.infer<typeof WineUpdateSchema>;
export type WineSearch = z.infer<typeof WineSearchSchema>;
export type WineResponse = z.infer<typeof WineResponseSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type WineListResponse = z.infer<typeof WineListResponseSchema>;
export type OCRData = z.infer<typeof OCRDataSchema>;
export type ImageUploadResponse = z.infer<typeof ImageUploadResponseSchema>;
export type OCRResponse = z.infer<typeof OCRResponseSchema>; 