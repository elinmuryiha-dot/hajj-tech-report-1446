// src/firebaseService.ts
// Centralized Firebase Firestore service for all data collections
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import app from './firebaseConfig';
import type { Stat, Unit, OrgUnit, GlobalSettings } from './admin-store';

const db = getFirestore(app);

// ==================== IMAGES ====================
const imagesCollection = collection(db, 'images');

export async function fetchAllImages() {
  const snapshot: QuerySnapshot<DocumentData> = await getDocs(imagesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function uploadImageData(title: string, description: string, url: string) {
  const docRef = await addDoc(imagesCollection, {
    title,
    description,
    url,
    uploadDate: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateImageData(id: string, title: string, description: string, url: string) {
  const docRef = doc(db, 'images', id);
  await updateDoc(docRef, {
    title,
    description,
    url,
    lastUpdate: Timestamp.now(),
  });
}

export async function deleteImageData(id: string) {
  const docRef = doc(db, 'images', id);
  await deleteDoc(docRef);
}

// ==================== STATS ====================
const statsCollection = collection(db, 'stats');

export async function fetchAllStats(): Promise<Stat[]> {
  const snapshot = await getDocs(statsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Stat));
}

export async function addStatData(stat: Omit<Stat, 'id'>): Promise<string> {
  const docRef = await addDoc(statsCollection, stat);
  return docRef.id;
}

export async function updateStatData(id: string, data: Partial<Stat>): Promise<void> {
  const docRef = doc(db, 'stats', id);
  const { id: _, ...updateData } = data as any;
  await updateDoc(docRef, updateData);
}

export async function deleteStatData(id: string): Promise<void> {
  const docRef = doc(db, 'stats', id);
  await deleteDoc(docRef);
}

// ==================== UNITS ====================
const unitsCollection = collection(db, 'units');

export async function fetchAllUnits(): Promise<Unit[]> {
  const snapshot = await getDocs(unitsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit));
}

export async function addUnitData(unit: Omit<Unit, 'id'>): Promise<string> {
  const docRef = await addDoc(unitsCollection, {
    name: unit.name,
    description: unit.description,
    details: unit.details,
  });
  return docRef.id;
}

export async function updateUnitData(id: string, data: Partial<Unit>): Promise<void> {
  const docRef = doc(db, 'units', id);
  const { id: _, ...updateData } = data as any;
  await updateDoc(docRef, updateData);
}

export async function deleteUnitData(id: string): Promise<void> {
  const docRef = doc(db, 'units', id);
  await deleteDoc(docRef);
}

// ==================== ORG UNITS ====================
const orgUnitsCollection = collection(db, 'orgUnits');

export async function fetchAllOrgUnits(): Promise<OrgUnit[]> {
  const snapshot = await getDocs(orgUnitsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrgUnit));
}

export async function addOrgUnitData(unit: Omit<OrgUnit, 'id'>): Promise<string> {
  const docRef = await addDoc(orgUnitsCollection, {
    name: unit.name,
    logoUrl: unit.logoUrl,
    order: unit.order,
  });
  return docRef.id;
}

export async function updateOrgUnitData(id: string, data: Partial<OrgUnit>): Promise<void> {
  const docRef = doc(db, 'orgUnits', id);
  const { id: _, ...updateData } = data as any;
  await updateDoc(docRef, updateData);
}

export async function deleteOrgUnitData(id: string): Promise<void> {
  const docRef = doc(db, 'orgUnits', id);
  await deleteDoc(docRef);
}

// ==================== SETTINGS ====================
const settingsDocRef = doc(db, 'settings', 'global');

export async function fetchSettings(): Promise<GlobalSettings | null> {
  const snapshot = await getDoc(settingsDocRef);
  if (snapshot.exists()) {
    return snapshot.data() as GlobalSettings;
  }
  return null;
}

export async function saveSettings(settings: GlobalSettings): Promise<void> {
  await setDoc(settingsDocRef, settings, { merge: true });
}
