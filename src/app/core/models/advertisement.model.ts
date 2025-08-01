export enum AdType {
  BANNER = 'banner',
  SIDEBAR = 'sidebar',
  INLINE = 'inline'
}

export enum AdPosition {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right'
}

export interface Advertisement {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl: string;
  type: AdType;
  position: AdPosition;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  clickCount: number;
  impressionCount: number;
  targetAudience?: string;
  createdAt: Date;
  updatedAt: Date;
} 