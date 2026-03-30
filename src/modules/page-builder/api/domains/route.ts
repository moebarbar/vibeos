import { NextRequest, NextResponse } from 'next/server';
import { addCustomDomain, removeDomain, checkDomainStatus } from '../../lib/deployer';

export async function GET(req: NextRequest) {
  const projectName = req.nextUrl.searchParams.get('project') ?? '';
  const domain      = req.nextUrl.searchParams.get('domain')  ?? '';
  if (!projectName || !domain) return NextResponse.json({ error: 'project and domain required' }, { status: 400 });
  const status = await checkDomainStatus(projectName, domain);
  return NextResponse.json(status);
}

export async function POST(req: NextRequest) {
  const { projectName, domain } = await req.json() as { projectName: string; domain: string };
  await addCustomDomain(projectName, domain);
  return NextResponse.json({ status: 'added', domain });
}

export async function DELETE(req: NextRequest) {
  const { projectName, domain } = await req.json() as { projectName: string; domain: string };
  await removeDomain(projectName, domain);
  return NextResponse.json({ status: 'removed', domain });
}
