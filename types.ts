
export type Language = 'pt' | 'cn';

export type UserRole = 'client' | 'supplier' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  // Client specific
  cpf?: string;
  customFee?: number; // Admin can change this from default 0.05
  // Supplier specific
  supplierId?: string; // 6 digit unique ID
  alipayQr?: string; // URL/Base64 of the image
  isApproved?: boolean;
  balance?: number; // Available for withdrawal
  frozenBalance?: number; // Held in escrow
}

export type OrderStatus = 'pending_shipping' | 'shipped' | 'finalized' | 'dispute';

export interface Order {
  id: string;
  clientId: string;
  supplierId: string;
  amountYuan: number;
  amountBrl: number;
  feeBrl: number;
  status: OrderStatus;
  createdAt: string;
  description: string;
  // Shipping details
  trackingCode?: string;
  shippingPhotos?: string[]; // URLs
  // Dispute
  disputeReason?: string;
}

export interface Withdrawal {
  id: string;
  supplierId: string;
  amountYuan: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface ContentText {
  nav: {
    clientLogin: string;
    supplierLogin: string;
    solutions: string;
    about: string;
    contact: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
    trustBadge: string;
  };
  features: {
    title: string;
    items: {
      title: string;
      description: string;
      icon: string;
    }[];
  };
  calculator: {
    title: string;
    inputLabel: string;
    outputLabel: string;
    feeLabel: string;
    rateLabel: string;
    disclaimer: string;
    calculateButton: string;
  };
  aiWidget: {
    title: string;
    placeholder: string;
    send: string;
    welcome: string;
  };
}
