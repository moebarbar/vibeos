'use client';

import { useState, useEffect, useRef } from 'react';

interface ContentPieceResult {
  id: string;
  platform: string;
  contentType: string;
  angle: string;
  headline: string;
  body: string;
  cta: string;
  dimensions: { width: number; height: number };
  imageData: string | null;
}

interface ResultsResponse {
  jobId: string;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  pieces: ContentPieceResult[];
  brandProfile: { name: string; primaryColor: string } | null;
}

const PLATFORM_ICONS: Record<string, string> = {
  instagram: '📸',
  linkedin:  '💼',
  facebook:  '👥',
  email:     '📧',
  twitter:   '🐦',
};

const STATUS_LABELS: Record<string, string> = {
  queued:           'Queued',
  scraping:         'Scraping your website…',
  analyzing:        'Analyzing your brand…',
  'generating-copy':'Writing 100+ pieces of copy…',
  'generating-images': 'Generating AI images…',
  rendering:        'Rendering templates…',
  compositing:      'Compositing final images…',
  complete:         'Complete!',
  failed:           'Failed',
};

export default function GeneratePage() {
  const [url, setUrl]           = useState('');
  const [jobId, setJobId]       = useState<string | null>(null);
  const [status, setStatus]     = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [total, setTotal]       = useState(0);
  const [results, setResults]   = useState<ContentPieceResult[]>([]);
  const [brandName, setBrandName] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [filter, setFilter]     = useState('all');
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopPoll() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  useEffect(() => () => stopPoll(), []);

  async function startGeneration() {
    if (!url.trim()) return;
    setError('');
    setLoading(true);
    setResults([]);
    setPage(1);
    setStatus('queued');
    setProgress(0);

    try {
      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Failed to start generation');
      }
      const data = await res.json();
      setJobId(data.jobId);
      startPolling(data.jobId);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  function startPolling(id: string) {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/content/status?jobId=${id}`);
        if (!res.ok) return;
        const data = await res.json();
        setStatus(data.status);
        setProgress(data.progress ?? 0);
        setTotal(data.totalPieces ?? 0);

        if (data.status === 'complete') {
          stopPoll();
          setLoading(false);
          await loadResults(id, 1, 'all');
        } else if (data.status === 'failed') {
          stopPoll();
          setLoading(false);
          setError(data.error ?? 'Generation failed');
        }
      } catch {
        // ignore transient errors
      }
    }, 2000);
  }

  async function loadResults(id: string, pg: number, plt: string) {
    const platformParam = plt !== 'all' ? `&platform=${plt}` : '';
    const res = await fetch(`/api/content/results?jobId=${id}&page=${pg}&limit=20${platformParam}`);
    if (!res.ok) return;
    const data: ResultsResponse = await res.json();
    if (pg === 1) {
      setResults(data.pieces);
    } else {
      setResults(prev => [...prev, ...data.pieces]);
    }
    setHasMore(data.hasMore);
    setPage(pg);
    if (data.brandProfile?.name) setBrandName(data.brandProfile.name);
  }

  async function applyFilter(plt: string) {
    setFilter(plt);
    setPage(1);
    if (jobId) await loadResults(jobId, 1, plt);
  }

  async function loadMore() {
    if (jobId) await loadResults(jobId, page + 1, filter);
  }

  function downloadImage(piece: ContentPieceResult) {
    if (!piece.imageData) return;
    const a = document.createElement('a');
    a.href = piece.imageData;
    a.download = `${piece.platform}-${piece.angle}-${piece.id.slice(0, 8)}.png`;
    a.click();
  }

  const platforms = ['all', 'instagram', 'linkedin', 'facebook', 'email', 'twitter'];

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
          Content Generator
        </h1>
        <p style={{ fontSize: 16, color: '#64748b' }}>
          Enter a URL and generate 100+ social media posts, ads &amp; email headers — instantly.
        </p>
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && startGeneration()}
          placeholder="https://yourproduct.com"
          disabled={loading}
          style={{
            flex: 1,
            background: '#0d0d1a',
            border: '1px solid #1e2a3a',
            borderRadius: 12,
            padding: '14px 20px',
            color: '#fff',
            fontSize: 16,
            outline: 'none',
          }}
        />
        <button
          onClick={startGeneration}
          disabled={loading || !url.trim()}
          style={{
            background: loading ? '#1e2a3a' : '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '14px 32px',
            fontSize: 16,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: !url.trim() ? 0.5 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Generating…' : 'Generate Content'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#1a0a0a', border: '1px solid #ef444440', borderRadius: 12, padding: '16px 20px', marginBottom: 24, color: '#ef4444', fontSize: 15 }}>
          {error}
        </div>
      )}

      {/* Progress */}
      {loading && (
        <div style={{ background: '#0d0d1a', border: '1px solid #1e2a3a', borderRadius: 16, padding: 28, marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ color: '#94a3b8', fontSize: 15 }}>
              {STATUS_LABELS[status] ?? status}
            </span>
            <span style={{ color: '#6366f1', fontWeight: 700, fontSize: 15 }}>
              {progress}%
            </span>
          </div>
          <div style={{ background: '#1e2a3a', borderRadius: 100, height: 8, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              borderRadius: 100,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              width: `${progress}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
          {total > 0 && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#475569' }}>
              {total} pieces queued
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <>
          {/* Brand name + filters */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <div>
              {brandName && (
                <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
                  {brandName}
                </div>
              )}
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
                {results.length} of {total} pieces
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {platforms.map(plt => (
                <button
                  key={plt}
                  onClick={() => applyFilter(plt)}
                  style={{
                    background: filter === plt ? '#6366f1' : '#0d0d1a',
                    border: `1px solid ${filter === plt ? '#6366f1' : '#1e2a3a'}`,
                    borderRadius: 100,
                    padding: '6px 16px',
                    color: filter === plt ? '#fff' : '#94a3b8',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {plt === 'all' ? 'All' : `${PLATFORM_ICONS[plt] ?? ''} ${plt}`}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
            marginBottom: 32,
          }}>
            {results.map(piece => (
              <div
                key={piece.id}
                style={{
                  background: '#0d0d1a',
                  border: '1px solid #1e2a3a',
                  borderRadius: 16,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Image preview */}
                {piece.imageData ? (
                  <div style={{ position: 'relative', background: '#060612', aspectRatio: `${piece.dimensions.width}/${piece.dimensions.height}`, maxHeight: 220, overflow: 'hidden' }}>
                    <img
                      src={piece.imageData}
                      alt={piece.headline}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                ) : (
                  <div style={{ background: '#060612', aspectRatio: '16/9', maxHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 40, opacity: 0.3 }}>{PLATFORM_ICONS[piece.platform] ?? '🖼️'}</span>
                  </div>
                )}

                {/* Info */}
                <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ background: '#1e2a3a', color: '#94a3b8', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {PLATFORM_ICONS[piece.platform]} {piece.platform}
                    </span>
                    <span style={{ background: '#1a1a2e', color: '#6366f1', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {piece.angle}
                    </span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.3 }}>
                    {piece.headline}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, flex: 1 }}>
                    {piece.body.slice(0, 120)}{piece.body.length > 120 ? '…' : ''}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: '#334155' }}>
                      {piece.dimensions.width}×{piece.dimensions.height}
                    </span>
                    {piece.imageData && (
                      <button
                        onClick={() => downloadImage(piece)}
                        style={{
                          background: '#6366f1',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          padding: '6px 14px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Download
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <button
                onClick={loadMore}
                style={{
                  background: '#0d0d1a',
                  border: '1px solid #1e2a3a',
                  borderRadius: 12,
                  padding: '12px 32px',
                  color: '#94a3b8',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
