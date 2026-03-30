export interface BrandProfile {
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontStyle: 'modern' | 'classic' | 'playful' | 'bold';
  tone: 'professional' | 'casual' | 'authoritative' | 'friendly' | 'edgy';
  industry: string;
  targetAudience: string;
  valuePropositions: string[];
  keyFeatures: string[];
  socialProof: string[];
  ctaText: string;
  logoUrl?: string;
  productScreenshots: string[];
  websiteUrl?: string;
}

export interface ContentPiece {
  id: string;
  platform: 'instagram' | 'linkedin' | 'facebook' | 'email' | 'twitter';
  contentType: 'post' | 'story' | 'carousel' | 'ad' | 'email-header';
  angle: 'pain-point' | 'benefit' | 'social-proof' | 'urgency' | 'comparison' | 'stat';
  headline: string;
  body: string;
  cta: string;
  imagePrompt?: string;
  templateId: string;
  dimensions: { width: number; height: number };
  status: 'pending' | 'generating' | 'compositing' | 'complete' | 'failed';
  outputUrl?: string;
  // Patch B — ad platform fields
  hashtags?: string[];
  subjectLine?: string;
  previewText?: string;
  adHeadline1?: string;
  adHeadline2?: string;
  adHeadline3?: string;
  adPrimaryText?: string;
  adDescription?: string;
  // Patch C — UTM tracking
  utmUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
}

export interface GenerationJob {
  id: string;
  url: string;
  status:
    | 'queued'
    | 'scraping'
    | 'analyzing'
    | 'generating-copy'
    | 'generating-images'
    | 'rendering'
    | 'compositing'
    | 'complete'
    | 'failed';
  brandProfile?: BrandProfile;
  contentPieces: ContentPiece[];
  progress: number;
  totalPieces: number;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  platform: string;
  contentType: string;
  dimensions: { width: number; height: number };
  requiresImage: boolean;
  render: (data: TemplateData) => string; // returns HTML string
}

export interface TemplateData {
  brandProfile: BrandProfile;
  content: ContentPiece;
  imageUrl?: string;
}
