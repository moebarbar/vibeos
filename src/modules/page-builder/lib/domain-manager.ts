import { addCustomDomain, removeDomain, checkDomainStatus } from './deployer';

const PROJECT_PREFIX = 'cmkt-user-';

export function userProjectName(userId: string, slug: string): string {
  return `${PROJECT_PREFIX}${userId}-${slug}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

export async function createSubdomain(userId: string, slug: string): Promise<string> {
  const projectName = userProjectName(userId, slug);
  const domain = `${slug}.pages.chiefmkt.com`;
  await addCustomDomain(projectName, domain);
  return `https://${domain}`;
}

export { addCustomDomain as addCustomDomainToProject, removeDomain, checkDomainStatus };

export async function listDomains(userId: string): Promise<string[]> {
  // In production: query your database for domains owned by this user
  // Returning stub for now
  return [];
}
