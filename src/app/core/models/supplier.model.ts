export interface Supplier {
  id: string;
  companyName: string;
  description: string;
  tagline?: string;
  sector: string;
  subSectors: string[];
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  website?: string;
  logo?: string;
  images: string[];
  services: string[];
  certifications: string[];
  yearsOfExperience: number;
  isVerified: boolean;
  isFeatured: boolean;
  rating: number;
  reviewsCount: number;
  projects?: Array<{
    title: string;
    description: string;
    year: number;
    client: string;
    value: number;
  }>;
  reviews?: Array<{
    reviewerName: string;
    rating: number;
    comment: string;
    date: Date;
  }>;
  satisfiedClients?: number;
  successRate?: number;
  verificationStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierFilter {
  sector?: string;
  city?: string;
  keyword?: string;
  isVerified?: boolean;
  rating?: number;
} 