const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID ?? '';
const CF_API_TOKEN  = process.env.CF_API_TOKEN  ?? '';
const CF_BASE       = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages`;

function cfHeaders() {
  return { Authorization: `Bearer ${CF_API_TOKEN}`, 'Content-Type': 'application/json' };
}

export function buildStandaloneHtml(html: string, css: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${css}</style>
</head>
<body>
${html}
</body>
</html>`;
}

async function ensureProject(projectName: string): Promise<void> {
  const check = await fetch(`${CF_BASE}/projects/${projectName}`, { headers: cfHeaders() });
  if (check.status === 200) return;

  const res = await fetch(`${CF_BASE}/projects`, {
    method: 'POST',
    headers: cfHeaders(),
    body: JSON.stringify({ name: projectName, production_branch: 'main' }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create CF project: ${err}`);
  }
}

export async function deployToCloudflare(html: string, css: string, projectName: string): Promise<string> {
  await ensureProject(projectName);

  const fullHtml = buildStandaloneHtml(html, css);
  const formData = new FormData();
  formData.append('file', new Blob([fullHtml], { type: 'text/html' }), 'index.html');

  const res = await fetch(`${CF_BASE}/projects/${projectName}/deployments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
    body: formData,
  });

  if (!res.ok) throw new Error(`Deployment failed: ${await res.text()}`);

  const data = await res.json() as { result: { url: string } };
  return data.result.url;
}

export async function addCustomDomain(projectName: string, domain: string): Promise<void> {
  const res = await fetch(`${CF_BASE}/projects/${projectName}/domains`, {
    method: 'POST',
    headers: cfHeaders(),
    body: JSON.stringify({ name: domain }),
  });
  if (!res.ok) throw new Error(`Failed to add domain: ${await res.text()}`);
}

export async function removeDomain(projectName: string, domain: string): Promise<void> {
  const res = await fetch(`${CF_BASE}/projects/${projectName}/domains/${domain}`, {
    method: 'DELETE',
    headers: cfHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to remove domain: ${await res.text()}`);
}

export async function checkDomainStatus(projectName: string, domain: string): Promise<{ status: string; ssl: string }> {
  const res = await fetch(`${CF_BASE}/projects/${projectName}/domains/${domain}`, { headers: cfHeaders() });
  if (!res.ok) return { status: 'unknown', ssl: 'unknown' };
  const data = await res.json() as { result: { status: string; certificate_authority: string } };
  return { status: data.result.status, ssl: data.result.certificate_authority };
}
