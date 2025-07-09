import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'wine-memo-465402.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'wine-memo-465402',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'wine-memo-465402.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'demo-app-id',
};

// Check if we're in a server environment and skip client initialization
const isServer = typeof window === 'undefined';

let app: any;
let db: any;
let auth: any;

if (!isServer) {
  try {
    // Initialize Firebase only on client side
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.warn('Firebase client initialization failed:', error);
    // Provide fallback objects for development
    app = null;
    db = null;
    auth = null;
  }
}

// Wine collection reference (only available on client)
export const winesCollection = isServer ? null : collection(db, 'wines');

// Wine interface
export interface Wine {
  id: string;
  name: string;
  characteristics: {
    sweetness: number;
    body: number;
    acidity: number;
    tannin: number;
    bitterness: number;
  };
  notes?: string;
  rating?: number;
  vintage?: string;
  region?: string;
  grapeVariety?: string;
  createdAt: string;
  updatedAt: string;
}

// Wine CRUD operations
export const wineService = {
  // Create a new wine entry
  async create(wineData: Omit<Wine, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wine> {
    if (!winesCollection) {
      throw new Error('Firebase not initialized. Please check your environment variables.');
    }
    
    const id = Date.now().toString();
    const now = new Date().toISOString();
    const wine: Wine = {
      ...wineData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(winesCollection, id), wine);
    return wine;
  },

  // Get a wine by ID
  async getById(id: string): Promise<Wine | null> {
    if (!winesCollection) {
      throw new Error('Firebase not initialized. Please check your environment variables.');
    }
    
    const docRef = doc(winesCollection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as Wine;
    }
    return null;
  },

  // Get all wines
  async getAll(): Promise<Wine[]> {
    if (!winesCollection) {
      throw new Error('Firebase not initialized. Please check your environment variables.');
    }
    
    const q = query(winesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => doc.data() as Wine);
  },

  // Update a wine
  async update(id: string, updates: Partial<Omit<Wine, 'id' | 'createdAt'>>): Promise<void> {
    if (!winesCollection) {
      throw new Error('Firebase not initialized. Please check your environment variables.');
    }
    
    const docRef = doc(winesCollection, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  // Delete a wine
  async delete(id: string): Promise<void> {
    if (!winesCollection) {
      throw new Error('Firebase not initialized. Please check your environment variables.');
    }
    
    const docRef = doc(winesCollection, id);
    await deleteDoc(docRef);
  },

  // Search wines by characteristics
  async searchByCharacteristics(characteristics: Partial<Wine['characteristics']>): Promise<Wine[]> {
    const wines = await this.getAll();
    
    return wines.filter(wine => {
      return Object.entries(characteristics).every(([key, value]) => {
        const wineValue = wine.characteristics[key as keyof Wine['characteristics']];
        // Allow for some tolerance in the search (within 20 points)
        return Math.abs(wineValue - value) <= 20;
      });
    });
  },
};

export { db, auth };
export default db; 