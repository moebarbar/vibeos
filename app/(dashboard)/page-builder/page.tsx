'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const PageEditor = dynamic(() => import('@/src/modules/page-builder/components/PageEditor'), { ssr: false });

function PageBuilderInner() {
  const params  = useSearchParams();
  const jobId   = params.get('jobId') ?? '';
  const [html, setHtml]     = useState('');
  const [brand, setBrand]   = useState(undefined);
  const [loading, setLoading] = useState(!!jobId);

  useEffect(() => {
    if (!jobId) return;
    fetch(`/api/content/results?jobId=${jobId}`)
      .then(r => r.json())
      .then(d => {
        setHtml(d.landingPage?.html ?? '');
        setBrand(d.brandProfile);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [jobId]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading page…</div>;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageEditor
        initialHTML={html}
        brandProfile={brand}
        onSave={(html, css) => {
          console.log('Saved', html.length, css.length);
          alert('Page saved!');
        }}
        onPublish={async (html, css) => {
          const res = await fetch('/api/page-builder/deploy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ html, css, slug: `page-${jobId || Date.now()}` }),
          });
          const data = await res.json() as { url: string };
          return data.url;
        }}
      />
    </div>
  );
}

export default function PageBuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading…</div>}>
      <PageBuilderInner />
    </Suspense>
  );
}
