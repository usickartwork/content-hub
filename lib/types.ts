export type ContentStatus = 'IDEA' | 'PLANNED' | 'PRODUCTION' | 'REVIEW' | 'SCHEDULED' | 'PUBLISHED';
export type ContentType = 'Reels' | 'Carousel' | 'Photo' | 'Video' | 'Story';
export type Platform = 'Instagram' | 'TikTok' | 'YouTube' | 'LinkedIn';

export interface ContentItem {
  id: string;
  title: string;
  date: string;
  time: string;
  type: ContentType;
  platform: Platform;
  pic: string;
  status: ContentStatus;
  caption?: string;
  script?: string;
  asset?: string;
  notes?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  active: boolean;
}
