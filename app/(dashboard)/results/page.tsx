'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CalendarView from '@/src/modules/content-agent/components/CalendarView';
import type { ContentCalendar } from '@/src/modules/content-agent/lib/content-calendar';
import type { ContentPiece, BrandProfile } from '@/src/modules/content-agent/types';
import type { EmailSequence } from '@/src/modules/content-agent/lib/email-sequence-generator';

type Tab = 'social' | 'landing' | 'emails' | 'calendar' | 'brand';

interface ResultsData {
  jobId: string;
  brandProfile: BrandProfile;
  contentPieces: ContentPiece[];
  landingPage: { html: string; editorUrl: string };
  emailSequences: EmailSequence[];
  calendar: { calendarData: ContentCalendar; csvDownloadUrl: string; jsonDownloadUrl: string };
  stats: { totalPieces: number; socialPosts: number; emailsGenerated: number; landingPageGenerated: boolean; generationTimeSeconds: number };
}

const PLATFORM_FILTER = ['All','instagram','linkedin','facebook','twitter','email'] as const;

function ResultsInner() {
  const params = useSearchParams();
  const jobId  = params.get('jobId') ?? '';
  const [data, setData]     = useState<ResultsData | null>(null);
  const [tab,  setTab]      = useState<Tab>('social');
  const [filter, setFilter] = useState<string>('All');
  const [error, setError]   = useState('');

  useEffect(() => {
    if (!jobId) return;
    fetch(`/api/content/results?jobId=${jobId}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setData(d as ResultsData); })
      .catch(e => setError(e.message));
  }, [jobId]);

  if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">{error}</div>;
  if (!data)  return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading results…</div>;

  const filteredPieces = filter === 'All' ? data.contentPieces : data.contentPieces.filter(p => p.platform === filter);

  const TAB_STYLE = (t: Tab) =>
    `px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${tab === t ? 'text-white border-indigo-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{data.brandProfile?.name} — Content Package</h1>
            <p className="text-slate-400 text-sm mt-1">
              {data.stats.totalPieces} pieces · {data.stats.emailsGenerated} emails · generated in {data.stats.generationTimeSeconds}s
            </p>
          </div>
          <div className="flex gap-3">
            <a href={`/api/content/calendar-csv?jobId=${jobId}`} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-all">
              Export CSV
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {(['social','landing','emails','calendar','brand'] as Tab[]).map(t => (
            <button key={t} className={TAB_STYLE(t)} onClick={() => setTab(t)}>
              {t === 'social' ? `Social Posts (${data.stats.socialPosts})`
               : t === 'landing' ? 'Landing Page'
               : t === 'emails' ? `Email Sequences (${data.stats.emailsGenerated})`
               : t === 'calendar' ? 'Content Calendar'
               : 'Brand Profile'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── TAB 1: Social Posts ──────────────────────────────────────────── */}
        {tab === 'social' && (
          <div>
            <div className="flex gap-2 mb-6 flex-wrap">
              {PLATFORM_FILTER.map(p => (
                <button key={p} onClick={() => setFilter(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${filter === p ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                  {p}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPieces.map(piece => (
                <div key={piece.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all">
                  {piece.outputUrl ? (
                    <img src={piece.outputUrl} alt={piece.headline} className="w-full aspect-square object-cover" />
                  ) : (
                    <div className="w-full aspect-square bg-slate-800 flex items-center justify-center">
                      <span className="text-slate-600 text-xs capitalize">{piece.platform}</span>
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-indigo-400 capitalize">{piece.platform}</span>
                      <span className="text-xs text-slate-600">{piece.contentType}</span>
                    </div>
                    <p className="text-white text-xs font-medium mb-1 line-clamp-2">{piece.headline}</p>
                    <p className="text-slate-500 text-xs line-clamp-2">{piece.body}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => navigator.clipboard.writeText(`${piece.headline}\n\n${piece.body}`)}
                        className="flex-1 text-xs py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 transition-all">
                        Copy Text
                      </button>
                      {piece.outputUrl && (
                        <a href={piece.outputUrl} download className="flex-1 text-xs py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 transition-all text-center">
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: Landing Page ──────────────────────────────────────────── */}
        {tab === 'landing' && (
          <div>
            <div className="flex gap-3 mb-6">
              <a href={data.landingPage.editorUrl} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all">
                Edit in Page Builder →
              </a>
              <button onClick={() => {
                const blob = new Blob([data.landingPage.html], { type: 'text/html' });
                const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
                a.download = 'landing-page.html'; a.click();
              }} className="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-all">
                Download HTML
              </button>
            </div>
            {data.landingPage.html ? (
              <div className="border border-slate-700 rounded-xl overflow-hidden" style={{ height: 600 }}>
                <iframe srcDoc={data.landingPage.html} className="w-full h-full" title="Landing Page Preview" />
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                <p className="text-slate-500">Landing page generation failed or not available.</p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: Email Sequences ───────────────────────────────────────── */}
        {tab === 'emails' && (
          <div className="space-y-4">
            {(['welcome','nurture','abandoned'] as const).map(seqType => {
              const emails = data.emailSequences.filter(e => e.sequenceType === seqType);
              return (
                <div key={seqType} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <button className="w-full flex items-center justify-between px-5 py-4 text-left"
                    onClick={e => { const next = e.currentTarget.nextElementSibling as HTMLElement; next.style.display = next.style.display === 'none' ? 'block' : 'none'; }}>
                    <span className="text-white font-semibold capitalize">{seqType} Sequence ({emails.length} emails)</span>
                    <span className="text-slate-500">▾</span>
                  </button>
                  <div style={{ display: 'none' }} className="border-t border-slate-800">
                    {emails.map((email, i) => (
                      <div key={i} className="border-b border-slate-800 last:border-0 p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="text-xs text-slate-500 mb-1">Email {email.emailNumber} · Day {email.sendDay}</div>
                            <div className="text-white font-medium">{email.subjectLine}</div>
                            <div className="text-slate-400 text-sm">{email.previewText}</div>
                          </div>
                          <button onClick={() => navigator.clipboard.writeText(email.bodyHtml)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs hover:bg-slate-700 transition-all flex-shrink-0">
                            Copy HTML
                          </button>
                        </div>
                        <div className="bg-white rounded-xl overflow-hidden" style={{ height: 200 }}>
                          <iframe srcDoc={email.bodyHtml} className="w-full h-full" title={`Email ${email.emailNumber}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB 4: Calendar ──────────────────────────────────────────────── */}
        {tab === 'calendar' && data.calendar.calendarData && (
          <CalendarView calendar={data.calendar.calendarData} />
        )}

        {/* ── TAB 5: Brand Profile ─────────────────────────────────────────── */}
        {tab === 'brand' && data.brandProfile && (
          <BrandProfileEditor brandProfile={data.brandProfile} jobId={jobId} />
        )}
      </div>
    </div>
  );
}

function BrandProfileEditor({ brandProfile: initial, jobId }: { brandProfile: BrandProfile; jobId: string }) {
  const [bp, setBp] = useState<BrandProfile>(initial);

  function update(field: keyof BrandProfile, value: string | string[]) {
    setBp(prev => ({ ...prev, [field]: value }));
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold text-white">Brand Profile</h2>

        {(['name','tagline','industry','targetAudience','ctaText'] as (keyof BrandProfile)[]).map(field => (
          <div key={field}>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-widest mb-1.5 capitalize">{field}</label>
            <input type="text" value={bp[field] as string ?? ''}
              onChange={e => update(field, e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500" />
          </div>
        ))}

        <div className="grid grid-cols-3 gap-4">
          {(['primaryColor','secondaryColor','accentColor'] as (keyof BrandProfile)[]).map(field => (
            <div key={field}>
              <label className="block text-xs text-slate-400 mb-1 capitalize">{(field as string).replace('Color',' Color')}</label>
              <input type="color" value={bp[field] as string ?? '#6366f1'}
                onChange={e => update(field, e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-700 cursor-pointer bg-slate-800" />
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={() => alert('Brand profile saved!')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all">
            Save Profile
          </button>
          <a href={`/generate?regenerate=${jobId}`}
            className="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-all">
            Regenerate with New Profile
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading…</div>}>
      <ResultsInner />
    </Suspense>
  );
}
