export enum TenderStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

export enum TenderType {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  reference: string;
  type: TenderType;
  status: TenderStatus;
  sector: string;
  location: string;
  publishDate: Date;
  deadline: Date;
  estimatedAmount?: number;
  currency: string;
  contactEmail: string;
  contactPhone?: string;
  documents: TenderDocument[];
  organizationName: string;
  organizationLogo?: string;
  requirements: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenderDocument {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadDate: Date;
}

export interface TenderFilter {
  sector?: string;
  type?: TenderType;
  location?: string;
  keyword?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: TenderStatus;
} 