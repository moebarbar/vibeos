import type { ContentPiece } from '../types';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ScheduledPost {
  contentPiece:  ContentPiece;
  scheduledTime: string;
  platform:      string;
  reason:        string;
}

export interface CalendarDay {
  date:      Date;
  dayOfWeek: string;
  posts:     ScheduledPost[];
}

export interface ContentCalendar {
  startDate: Date;
  endDate:   Date;
  days:      CalendarDay[];
  stats: {
    totalPosts:       number;
    postsPerPlatform: Record<string, number>;
    postsPerDay:      number;
  };
}

// ── Scheduling rules ──────────────────────────────────────────────────────────

const SCHEDULE: Record<string, { times: string[]; maxPerDay: number; weekdaysOnly?: boolean }> = {
  instagram: { times: ['09:00 AM', '12:00 PM', '05:00 PM'], maxPerDay: 3 },
  linkedin:  { times: ['08:00 AM', '10:00 AM', '12:00 PM'], maxPerDay: 1, weekdaysOnly: true },
  twitter:   { times: ['08:00 AM', '12:00 PM', '04:00 PM', '08:00 PM'], maxPerDay: 4 },
  facebook:  { times: ['01:00 PM', '03:00 PM'], maxPerDay: 2 },
  email:     { times: ['09:00 AM'], maxPerDay: 1, weekdaysOnly: true },
};

const EMAIL_DAYS = [2, 4]; // Tuesday=2, Thursday=4 (0=Sunday)
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// ── Core function ─────────────────────────────────────────────────────────────

export function generateCalendar(contentPieces: ContentPiece[], startDate?: Date): ContentCalendar {
  const start = startDate ?? new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 29);

  // Group pieces by platform
  const byPlatform: Record<string, ContentPiece[]> = {};
  for (const piece of contentPieces) {
    if (!byPlatform[piece.platform]) byPlatform[piece.platform] = [];
    byPlatform[piece.platform].push(piece);
  }

  // Track position per platform for round-robin distribution
  const platformIdx: Record<string, number> = {};

  const days: CalendarDay[] = [];

  for (let d = 0; d < 30; d++) {
    const date = new Date(start);
    date.setDate(start.getDate() + d);
    const dow = date.getDay();
    const dayOfWeek = DAYS[dow];
    const posts: ScheduledPost[] = [];

    for (const [platform, rule] of Object.entries(SCHEDULE)) {
      if (rule.weekdaysOnly && (dow === 0 || dow === 6)) continue;
      if (platform === 'email' && !EMAIL_DAYS.includes(dow)) continue;

      const pieces = byPlatform[platform] ?? [];
      if (!pieces.length) continue;

      const count = Math.min(rule.maxPerDay, pieces.length);
      for (let t = 0; t < count; t++) {
        const idx = (platformIdx[platform] ?? 0) % pieces.length;
        platformIdx[platform] = idx + 1;
        const piece = pieces[idx];
        posts.push({
          contentPiece:  piece,
          scheduledTime: rule.times[t % rule.times.length],
          platform,
          reason:        `Best engagement time for ${platform} on ${dayOfWeek}s`,
        });
      }
    }

    // Sort by time
    posts.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    days.push({ date, dayOfWeek, posts });
  }

  const totalPosts = days.reduce((sum, d) => sum + d.posts.length, 0);
  const postsPerPlatform: Record<string, number> = {};
  for (const day of days) {
    for (const post of day.posts) {
      postsPerPlatform[post.platform] = (postsPerPlatform[post.platform] ?? 0) + 1;
    }
  }

  return { startDate: start, endDate: end, days, stats: { totalPosts, postsPerPlatform, postsPerDay: +(totalPosts / 30).toFixed(1) } };
}

// ── Exports ───────────────────────────────────────────────────────────────────

export function exportToCSV(calendar: ContentCalendar): string {
  const rows = [['Date','Time','Platform','Content Type','Headline','Body','Hashtags','Image URL','UTM URL']];
  for (const day of calendar.days) {
    for (const post of day.posts) {
      const p = post.contentPiece;
      rows.push([
        day.date.toISOString().split('T')[0],
        post.scheduledTime,
        p.platform,
        p.contentType,
        `"${(p.headline ?? '').replace(/"/g, '""')}"`,
        `"${(p.body ?? '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${(p.hashtags ?? []).join(' ')}"`,
        p.outputUrl ?? '',
        p.utmUrl ?? '',
      ]);
    }
  }
  return rows.map(r => r.join(',')).join('\n');
}

export function exportToJSON(calendar: ContentCalendar): string {
  return JSON.stringify(calendar, null, 2);
}

export function exportToMarkdown(calendar: ContentCalendar): string {
  let md = `# Content Calendar\n\n**${calendar.stats.totalPosts} posts** over 30 days (${calendar.stats.postsPerDay}/day avg)\n\n`;
  let week = 1;
  calendar.days.forEach((day, i) => {
    if (i % 7 === 0) md += `\n## Week ${week++}\n\n| Date | Time | Platform | Headline |\n|------|------|----------|----------|\n`;
    for (const post of day.posts) {
      md += `| ${day.date.toDateString()} | ${post.scheduledTime} | ${post.platform} | ${post.contentPiece.headline} |\n`;
    }
  });
  return md;
}
