'use client';

import { useState } from 'react';
import type { ContentCalendar, CalendarDay, ScheduledPost } from '../lib/content-calendar';
import { exportToCSV, exportToJSON } from '../lib/content-calendar';

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#e1306c',
  linkedin:  '#0077b5',
  facebook:  '#1877f2',
  twitter:   '#1da1f2',
  email:     '#10b981',
};

interface CalendarViewProps {
  calendar: ContentCalendar;
}

export default function CalendarView({ calendar }: CalendarViewProps) {
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);

  function downloadCSV() {
    const csv = exportToCSV(calendar);
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'content-calendar.csv';
    a.click();
  }

  function downloadJSON() {
    const json = exportToJSON(calendar);
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'content-calendar.json';
    a.click();
  }

  return (
    <div className="bg-slate-950 text-white min-h-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Content Calendar</h2>
          <p className="text-slate-400 text-sm mt-1">{calendar.stats.totalPosts} posts over 30 days · {calendar.stats.postsPerDay}/day avg</p>
        </div>
        <div className="flex gap-3">
          <button onClick={downloadCSV} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-all">
            Export CSV (Buffer/Hootsuite)
          </button>
          <button onClick={downloadJSON} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-all">
            Export JSON
          </button>
        </div>
      </div>

      {/* Platform legend */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {Object.entries(PLATFORM_COLORS).map(([platform, color]) => (
          <div key={platform} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <span className="text-slate-400 text-xs capitalize">{platform}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-slate-500 py-2">{d}</div>
        ))}
        {/* Offset for first day */}
        {Array.from({ length: calendar.days[0]?.date.getDay() ?? 0 }).map((_, i) => (
          <div key={`offset-${i}`} />
        ))}
        {calendar.days.map((day) => {
          const platforms = [...new Set(day.posts.map(p => p.platform))];
          const isSelected = selectedDay?.date.toDateString() === day.date.toDateString();
          return (
            <button
              key={day.date.toISOString()}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className={`relative min-h-[72px] rounded-lg p-2 text-left transition-all border ${isSelected ? 'border-indigo-500 bg-indigo-950/30' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}
            >
              <div className="text-xs font-medium text-slate-400 mb-1.5">{day.date.getDate()}</div>
              <div className="flex flex-wrap gap-0.5">
                {platforms.map(p => (
                  <div key={p} className="w-2 h-2 rounded-full" style={{ background: PLATFORM_COLORS[p] ?? '#6366f1' }} title={p} />
                ))}
              </div>
              {day.posts.length > 0 && (
                <div className="absolute bottom-1 right-1 text-xs text-slate-600">{day.posts.length}</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day posts */}
      {selectedDay && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">
            {selectedDay.date.toDateString()} · {selectedDay.posts.length} posts
          </h3>
          <div className="space-y-3">
            {selectedDay.posts.map((post, i) => (
              <button
                key={i}
                onClick={() => setSelectedPost(selectedPost === post ? null : post)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-left hover:border-slate-600 transition-all"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PLATFORM_COLORS[post.platform] ?? '#6366f1' }} />
                  <span className="text-xs font-medium text-slate-400 capitalize">{post.platform}</span>
                  <span className="text-xs text-slate-600">{post.scheduledTime}</span>
                </div>
                <div className="text-white text-sm font-medium">{post.contentPiece.headline}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Post preview */}
      {selectedPost && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ background: PLATFORM_COLORS[selectedPost.platform] ?? '#6366f1' }} />
            <span className="text-white font-semibold capitalize">{selectedPost.platform} — {selectedPost.scheduledTime}</span>
          </div>
          {selectedPost.contentPiece.outputUrl && (
            <img src={selectedPost.contentPiece.outputUrl} alt="" className="w-full max-w-sm rounded-xl mb-4 border border-slate-700" />
          )}
          <p className="text-white font-semibold mb-2">{selectedPost.contentPiece.headline}</p>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">{selectedPost.contentPiece.body}</p>
          {selectedPost.contentPiece.hashtags?.length ? (
            <p className="text-indigo-400 text-sm">{selectedPost.contentPiece.hashtags.join(' ')}</p>
          ) : null}
          {selectedPost.contentPiece.utmUrl && (
            <a href={selectedPost.contentPiece.utmUrl} target="_blank" className="text-xs text-slate-600 mt-2 block truncate">
              {selectedPost.contentPiece.utmUrl}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
