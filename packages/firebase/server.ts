import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminDb = getFirestore();
const adminAuth = getAuth();

// Admin wine service
export const adminWineService = {
  // Get all wines with admin privileges
  async getAllWines() {
    const snapshot = await adminDb.collection('wines').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Get wine by ID with admin privileges
  async getWineById(id: string) {
    const doc = await adminDb.collection('wines').doc(id).get();
    if (doc.exists) {
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    return null;
  },

  // Delete wine with admin privileges
  async deleteWine(id: string) {
    await adminDb.collection('wines').doc(id).delete();
  },

  // Get user statistics
  async getUserStats() {
    const usersSnapshot = await adminAuth.listUsers();
    return {
      totalUsers: usersSnapshot.users.length,
      users: usersSnapshot.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
      }))
    };
  },

  // Get wine statistics
  async getWineStats() {
    const winesSnapshot = await adminDb.collection('wines').get();
    const wines = winesSnapshot.docs.map(doc => doc.data());
    
    return {
      totalWines: wines.length,
      averageRating: wines.reduce((acc, wine) => acc + (wine.rating || 0), 0) / wines.length,
      topRegions: this.getTopRegions(wines),
      topGrapeVarieties: this.getTopGrapeVarieties(wines),
    };
  },

  // Helper methods
  getTopRegions(wines: any[]) {
    const regionCounts = wines.reduce((acc, wine) => {
      if (wine.region) {
        acc[wine.region] = (acc[wine.region] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(regionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([region, count]) => ({ region, count }));
  },

  getTopGrapeVarieties(wines: any[]) {
    const varietyCounts = wines.reduce((acc, wine) => {
      if (wine.grapeVariety) {
        acc[wine.grapeVariety] = (acc[wine.grapeVariety] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(varietyCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([variety, count]) => ({ variety, count }));
  },
};

export { adminDb, adminAuth };
export default adminDb; 