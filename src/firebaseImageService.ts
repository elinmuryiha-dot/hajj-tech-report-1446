// src/firebaseImageService.ts
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import app from './firebaseConfig';

const db = getFirestore(app);
const imagesCollection = collection(db, 'images');

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
  const { doc, updateDoc } = await import('firebase/firestore');
  const docRef = doc(db, 'images', id);
  await updateDoc(docRef, {
    title,
    description,
    url,
    lastUpdate: Timestamp.now(),
  });
}

export async function deleteImageData(id: string) {
  const { doc, deleteDoc } = await import('firebase/firestore');
  const docRef = doc(db, 'images', id);
  await deleteDoc(docRef);
}
