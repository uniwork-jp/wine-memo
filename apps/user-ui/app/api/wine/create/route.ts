import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

// Wine creation schema
const WineCreateSchema = z.object({
  name: z.string().min(1, 'Wine name is required'),
  characteristics: z.object({
    sweetness: z.number().min(0).max(100),
    body: z.number().min(0).max(100),
    acidity: z.number().min(0).max(100),
    tannin: z.number().min(0).max(100),
    bitterness: z.number().min(0).max(100),
  }),
  notes: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  vintage: z.string().optional(),
  region: z.string().optional(),
  grapeVariety: z.string().optional(),
});

type WineCreateRequest = z.infer<typeof WineCreateSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const validatedData = WineCreateSchema.parse(req.body);
    
    // TODO: Add database integration here
    // For now, just return the validated data
    const wineEntry = {
      id: Date.now().toString(), // Temporary ID generation
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Simulate database save
    console.log('Saving wine entry:', wineEntry);

    return res.status(201).json({
      success: true,
      data: wineEntry,
      message: 'Wine entry created successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Error creating wine entry:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
} 