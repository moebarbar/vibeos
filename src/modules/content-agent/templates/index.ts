export { instagramPostTemplates, getInstagramPostTemplate, getRandomInstagramPostTemplate } from './instagram-post';
export { instagramStoryTemplates, getInstagramStoryTemplate, getRandomInstagramStoryTemplate } from './instagram-story';
export { linkedinPostTemplates, getLinkedinPostTemplate, getRandomLinkedinPostTemplate } from './linkedin-post';
export { facebookAdTemplates, getFacebookAdTemplate, getRandomFacebookAdTemplate } from './facebook-ad';
export { emailHeaderTemplates, getEmailHeaderTemplate, getRandomEmailHeaderTemplate } from './email-header';

import { instagramPostTemplates } from './instagram-post';
import { instagramStoryTemplates } from './instagram-story';
import { linkedinPostTemplates } from './linkedin-post';
import { facebookAdTemplates } from './facebook-ad';
import { emailHeaderTemplates } from './email-header';
import type { TemplateConfig } from '../types';

export const ALL_TEMPLATES: TemplateConfig[] = [
  ...instagramPostTemplates,
  ...instagramStoryTemplates,
  ...linkedinPostTemplates,
  ...facebookAdTemplates,
  ...emailHeaderTemplates,
];

export function getTemplate(id: string): TemplateConfig | undefined {
  return ALL_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesForPlatform(platform: string): TemplateConfig[] {
  return ALL_TEMPLATES.filter(t => t.platform === platform && !t.name.includes('alias'));
}
