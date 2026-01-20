import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
  type Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export type InquiryStatus = 'pending' | 'in_progress' | 'complete';
export type InquiryType = 'estimate' | 'contact';

export interface Inquiry {
  id: string;
  type: InquiryType;
  status: InquiryStatus;
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
  message?: string;
  selectedProduct?: string;
  estimateDetails?: {
    items: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    materialTotal: number;
    laborCharge: number;
    distanceCharge: number;
    grandTotal: number;
  };
}

const COLLECTION_NAME = 'enquiries';
const LEGACY_STORAGE_KEY = 'bms_inquiries';
const LEGACY_MIGRATED_FLAG = 'bms_inquiries_migrated';

const normalizeDate = (value: Timestamp | string | undefined): string => {
  if (value && typeof (value as Timestamp).toDate === 'function') {
    return (value as Timestamp).toDate().toISOString();
  }
  if (typeof value === 'string') return value;
  return new Date().toISOString();
};

const mapDocToInquiry = (docId: string, data: Record<string, any>): Inquiry => ({
  id: docId,
  type: data.type ?? 'contact',
  status: data.status ?? 'pending',
  createdAt: normalizeDate(data.createdAt),
  customerName: data.customerName ?? '',
  customerPhone: data.customerPhone ?? '',
  message: data.message ?? '',
  selectedProduct: data.selectedProduct,
  estimateDetails: data.estimateDetails,
});

export const subscribeToInquiries = (onChange: (items: Inquiry[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const mapped = snapshot.docs.map((docSnap) => mapDocToInquiry(docSnap.id, docSnap.data()));
    onChange(mapped);
  });
};

export const getInquiriesOnce = async (): Promise<Inquiry[]> => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => mapDocToInquiry(docSnap.id, docSnap.data()));
};

export const addInquiry = async (
  inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>
): Promise<Inquiry> => {
  const payload = {
    ...inquiry,
    status: 'pending' as InquiryStatus,
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, COLLECTION_NAME), payload);
  return {
    ...inquiry,
    id: ref.id,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
};

export const updateInquiryStatus = async (id: string, status: InquiryStatus) => {
  await updateDoc(doc(db, COLLECTION_NAME, id), { status });
};

export const deleteInquiry = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};

const loadLegacyInquiries = (): Inquiry[] => {
  try {
    const saved = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load legacy inquiries:', error);
  }
  return [];
};

export const migrateLegacyInquiries = async () => {
  if (localStorage.getItem(LEGACY_MIGRATED_FLAG) === 'true') return;

  const legacy = loadLegacyInquiries();
  if (!legacy.length) {
    localStorage.setItem(LEGACY_MIGRATED_FLAG, 'true');
    return;
  }

  const batch = writeBatch(db);
  const colRef = collection(db, COLLECTION_NAME);

  legacy.forEach((item) => {
    const ref = doc(colRef);
    batch.set(ref, {
      ...item,
      createdAt: item.createdAt ? new Date(item.createdAt) : serverTimestamp(),
    });
  });

  await batch.commit();
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  localStorage.setItem(LEGACY_MIGRATED_FLAG, 'true');
};
