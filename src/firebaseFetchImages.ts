import { getFirestore, collection, getDocs, DocumentData, QuerySnapshot } from 'firebase/firestore';
import app from './firebaseConfig';

const db = getFirestore(app);
const imagesCollection = collection(db, 'images');

export async function fetchAllImages() {
  const snapshot: QuerySnapshot<DocumentData> = await getDocs(imagesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
