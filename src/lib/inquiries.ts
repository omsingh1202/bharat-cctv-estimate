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

const INQUIRIES_KEY = 'bms_inquiries';

export const loadInquiries = (): Inquiry[] => {
  try {
    const saved = localStorage.getItem(INQUIRIES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load inquiries:', error);
  }
  return [];
};

export const saveInquiries = (inquiries: Inquiry[]): void => {
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
};

export const addInquiry = (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry => {
  const newInquiry: Inquiry = {
    ...inquiry,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  
  const inquiries = loadInquiries();
  inquiries.unshift(newInquiry);
  saveInquiries(inquiries);
  
  return newInquiry;
};

export const updateInquiryStatus = (id: string, status: InquiryStatus): void => {
  const inquiries = loadInquiries();
  const index = inquiries.findIndex(inq => inq.id === id);
  if (index !== -1) {
    inquiries[index].status = status;
    saveInquiries(inquiries);
  }
};

export const deleteInquiry = (id: string): void => {
  const inquiries = loadInquiries();
  const filtered = inquiries.filter(inq => inq.id !== id);
  saveInquiries(filtered);
};
