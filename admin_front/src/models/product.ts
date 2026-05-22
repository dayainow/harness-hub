export type ToolStatus = 'ACTIVE' | 'PENDING' | 'COMING_SOON';

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDesc: string;
  category: string;
  developer?: string;
  pricingModel?: string; // e.g. Freemium, Free, Paid
  rating: number;
  iconUrl?: string;
  coverUrl?: string;
  isFeatured: boolean;
  launchUrl?: string;
  status: ToolStatus;
  tags: string[];
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetToolsParams {
  category?: string;
  pricing?: string;
  sort?: string; // e.g. "recent" or "rating"
}
