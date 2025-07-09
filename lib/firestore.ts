import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Wine collection reference
export const winesCollection = collection(db, 'wines');

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
    const docRef = doc(winesCollection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as Wine;
    }
    return null;
  },

  // Get all wines
  async getAll(): Promise<Wine[]> {
    const q = query(winesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => doc.data() as Wine);
  },

  // Update a wine
  async update(id: string, updates: Partial<Omit<Wine, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(winesCollection, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  // Delete a wine
  async delete(id: string): Promise<void> {
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

export default db; 