import type { Editor } from 'grapesjs';

const ACCENT = 'var(--brand-primary, #6366f1)';
const SEC    = 'var(--brand-secondary, #8b5cf6)';

function block(editor: Editor, id: string, label: string, category: string, content: string, media = '') {
  editor.Blocks.add(id, { label, category, content, media: media || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/></svg>` });
}

export function chiefmktBlocksPlugin(editor: Editor) {

  // ── HEROES ────────────────────────────────────────────────────────────────

  block(editor, 'hero-centered', 'Hero Centered', 'Heroes', `
<section class="relative bg-slate-950 py-24 px-4 text-center overflow-hidden">
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950"></div>
  <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTI4MzgiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTJoMnYyek0zNiAzMGgtMnYtMmgydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
  <div class="relative max-w-4xl mx-auto">
    <div class="inline-block bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">Introducing v2.0</div>
    <h1 class="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none mb-6">The smarter way to<br><span style="color:${ACCENT}">grow your business</span></h1>
    <p class="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">Stop wasting time on manual work. Our platform automates everything so you can focus on what matters.</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="#" class="px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105" style="background:${ACCENT}">Get started free</a>
      <a href="#" class="px-8 py-4 rounded-xl font-semibold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all">Watch demo →</a>
    </div>
  </div>
</section>`);

  block(editor, 'hero-split', 'Hero Split', 'Heroes', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
    <div>
      <div class="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-6 border" style="color:${ACCENT};border-color:${ACCENT};background:color-mix(in srgb,${ACCENT} 10%,transparent)">New feature →</div>
      <h1 class="text-5xl font-bold text-white tracking-tight leading-tight mb-6">Build faster.<br>Convert more.</h1>
      <p class="text-lg text-slate-400 leading-relaxed mb-8">Everything you need to launch, grow, and scale your product — in one unified platform.</p>
      <div class="flex gap-4 flex-wrap">
        <a href="#" class="px-7 py-3.5 rounded-xl font-semibold text-white hover:opacity-90 transition-all" style="background:${ACCENT}">Start for free</a>
        <a href="#" class="px-7 py-3.5 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700">See pricing</a>
      </div>
    </div>
    <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl aspect-video flex items-center justify-center">
      <span class="text-slate-600 text-sm">Product screenshot</span>
    </div>
  </div>
</section>`);

  block(editor, 'hero-with-stats', 'Hero + Stats', 'Heroes', `
<section class="bg-slate-950 py-24 px-4 text-center">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-6xl font-black text-white tracking-tight mb-6">Trusted by<br><span style="color:${ACCENT}">10,000+ teams</span></h1>
    <p class="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">The platform that helps ambitious teams move faster and do more.</p>
    <a href="#" class="inline-block px-8 py-4 rounded-xl font-semibold text-white mb-16 hover:opacity-90 transition-all" style="background:${ACCENT}">Start free trial</a>
    <div class="grid grid-cols-3 gap-8 border-t border-slate-800 pt-12">
      <div><div class="text-4xl font-black text-white mb-1">10K+</div><div class="text-slate-500 text-sm">Active users</div></div>
      <div><div class="text-4xl font-black text-white mb-1">99.9%</div><div class="text-slate-500 text-sm">Uptime SLA</div></div>
      <div><div class="text-4xl font-black text-white mb-1">4.9★</div><div class="text-slate-500 text-sm">Average rating</div></div>
    </div>
  </div>
</section>`);

  block(editor, 'hero-product-screenshot', 'Hero + Screenshot', 'Heroes', `
<section class="bg-slate-950 py-20 px-4 text-center">
  <div class="max-w-5xl mx-auto">
    <h1 class="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">The all-in-one platform<br>for modern teams</h1>
    <p class="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">Stop juggling tools. Everything in one place.</p>
    <a href="#" class="inline-block px-8 py-4 rounded-xl font-semibold text-white mb-16 hover:opacity-90 transition-all" style="background:${ACCENT}">Get started free</a>
    <div class="bg-slate-800 border border-slate-700 rounded-2xl aspect-video w-full shadow-2xl shadow-black/50 flex items-center justify-center" style="transform:perspective(1200px) rotateX(4deg)">
      <span class="text-slate-600">Dashboard preview</span>
    </div>
  </div>
</section>`);

  block(editor, 'hero-minimal', 'Hero Minimal', 'Heroes', `
<section class="bg-white py-32 px-4 text-center">
  <div class="max-w-3xl mx-auto">
    <h1 class="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">Work less.<br>Earn more.</h1>
    <p class="text-xl text-slate-500 mb-12">The simplest way to automate your marketing.</p>
    <a href="#" class="inline-block px-10 py-4 rounded-2xl font-bold text-white text-lg hover:opacity-90 transition-all" style="background:${ACCENT}">Try it free</a>
  </div>
</section>`);

  block(editor, 'hero-gradient-mesh', 'Hero Gradient Mesh', 'Heroes', `
<section class="relative py-28 px-4 text-center overflow-hidden" style="background:linear-gradient(135deg,#0f0f23 0%,#1a1040 50%,#0f1729 100%)">
  <div class="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style="background:${ACCENT}"></div>
  <div class="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style="background:${SEC}"></div>
  <div class="relative max-w-4xl mx-auto">
    <h1 class="text-6xl font-black text-white tracking-tight mb-6">The future of<br><span style="background:linear-gradient(90deg,${ACCENT},${SEC});-webkit-background-clip:text;-webkit-text-fill-color:transparent">marketing is here</span></h1>
    <p class="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">AI-powered tools that write copy, generate images, and launch campaigns — automatically.</p>
    <a href="#" class="inline-block px-8 py-4 rounded-xl font-bold text-white hover:opacity-90 transition-all" style="background:${ACCENT}">Start building →</a>
  </div>
</section>`);

  block(editor, 'hero-animated', 'Hero Animated', 'Heroes', `
<style>.gradient-text{background:linear-gradient(90deg,${ACCENT},${SEC},${ACCENT});background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:gradientMove 3s linear infinite}@keyframes gradientMove{0%{background-position:0%}100%{background-position:200%}}.float{animation:float 6s ease-in-out infinite}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}</style>
<section class="bg-slate-950 py-24 px-4 text-center relative overflow-hidden">
  <div class="float absolute top-10 left-10 w-20 h-20 rounded-full opacity-10" style="background:${ACCENT}"></div>
  <div class="float absolute bottom-10 right-10 w-32 h-32 rounded-full opacity-5" style="background:${SEC};animation-delay:-3s"></div>
  <div class="max-w-4xl mx-auto relative">
    <h1 class="text-6xl font-black text-white tracking-tight mb-6">Generate content<br><span class="gradient-text">10x faster</span></h1>
    <p class="text-xl text-slate-400 mb-10 max-w-xl mx-auto">AI that writes, designs, and publishes — while you sleep.</p>
    <a href="#" class="inline-block px-8 py-4 rounded-xl font-bold text-white hover:opacity-90 transition-all" style="background:${ACCENT}">Get started →</a>
  </div>
</section>`);

  block(editor, 'hero-video', 'Hero Video', 'Heroes', `
<section class="bg-slate-950 py-24 px-4 text-center">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-5xl font-bold text-white mb-6">See it in action</h1>
    <p class="text-xl text-slate-400 mb-10">Watch how teams use our platform to 10x their output.</p>
    <div class="relative bg-slate-800 border border-slate-700 rounded-2xl aspect-video max-w-3xl mx-auto flex items-center justify-center cursor-pointer group">
      <div class="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-all">
        <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </div>
    </div>
  </div>
</section>`);

  // ── SOCIAL PROOF ──────────────────────────────────────────────────────────

  block(editor, 'logo-bar', 'Logo Bar', 'Social Proof', `
<section class="bg-slate-900 border-y border-slate-800 py-12 px-4">
  <div class="max-w-5xl mx-auto text-center">
    <p class="text-slate-500 text-sm font-medium uppercase tracking-widest mb-8">Trusted by teams at</p>
    <div class="flex flex-wrap gap-8 justify-center items-center">
      ${['Acme Corp','Globex','Umbrella','Initech','Hooli'].map(n=>`<div class="bg-slate-800 rounded-lg px-6 py-3 text-slate-500 font-semibold text-sm">${n}</div>`).join('')}
    </div>
  </div>
</section>`);

  block(editor, 'testimonial-cards', 'Testimonial Cards', 'Social Proof', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-4xl font-bold text-white text-center mb-12">Loved by thousands</h2>
    <div class="grid md:grid-cols-3 gap-6">
      ${[['Sarah K.','Founder @ Launchpad','This tool saved us 20 hours a week. Our content output tripled.'],['Marcus T.','CMO @ Growthly','Best investment we made. ROI was clear within the first week.'],['Priya M.','CEO @ Veloce','I was skeptical at first. Now I tell everyone about it.']].map(([name,role,quote])=>`
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <div class="flex gap-1 mb-4">${'★'.repeat(5).split('').map(()=>`<span style="color:${ACCENT}">★</span>`).join('')}</div>
        <p class="text-slate-300 leading-relaxed mb-6">"${quote}"</p>
        <div><div class="text-white font-semibold">${name}</div><div class="text-slate-500 text-sm">${role}</div></div>
      </div>`).join('')}
    </div>
  </div>
</section>`);

  block(editor, 'stats-row', 'Stats Row', 'Social Proof', `
<section class="bg-slate-900 py-16 px-4">
  <div class="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    ${[['50K+','Customers'],['$2M+','Revenue Generated'],['99.9%','Uptime'],['4.9/5','User Rating']].map(([n,l])=>`<div><div class="text-4xl font-black text-white mb-2" style="color:${ACCENT}">${n}</div><div class="text-slate-400 text-sm">${l}</div></div>`).join('')}
  </div>
</section>`);

  block(editor, 'testimonial-large', 'Testimonial Large', 'Social Proof', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-3xl mx-auto text-center">
    <div class="text-7xl font-black mb-6" style="color:${ACCENT}">"</div>
    <p class="text-2xl text-white font-medium leading-relaxed mb-8">This is the product I wish existed 5 years ago. It has completely changed how we approach marketing.</p>
    <div class="flex items-center justify-center gap-4">
      <div class="w-12 h-12 rounded-full bg-slate-700"></div>
      <div class="text-left"><div class="text-white font-semibold">Alex Rivera</div><div class="text-slate-500 text-sm">CEO, TechForward</div></div>
    </div>
  </div>
</section>`);

  block(editor, 'review-stars', 'Review Stars', 'Social Proof', `
<section class="bg-slate-900 py-12 px-4">
  <div class="max-w-4xl mx-auto flex flex-wrap gap-8 justify-center items-center">
    ${[['G2','4.9','450+ reviews'],['Capterra','4.8','300+ reviews'],['Product Hunt','#1','Product of the Day']].map(([p,r,s])=>`
    <div class="bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 text-center">
      <div class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">${p}</div>
      <div class="text-2xl font-black text-white">${r}</div>
      <div class="flex gap-0.5 justify-center my-1">${'★'.repeat(5).split('').map(()=>`<span class="text-xs" style="color:${ACCENT}">★</span>`).join('')}</div>
      <div class="text-slate-500 text-xs">${s}</div>
    </div>`).join('')}
  </div>
</section>`);

  block(editor, 'case-study-card', 'Case Study Card', 'Social Proof', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-4xl mx-auto bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
    <div class="w-full md:w-48 h-32 bg-slate-700 rounded-xl flex items-center justify-center text-slate-500 text-sm flex-shrink-0">Company Logo</div>
    <div>
      <div class="text-4xl font-black mb-2" style="color:${ACCENT}">+340% revenue</div>
      <p class="text-slate-300 leading-relaxed mb-4">"We went from $50K to $220K MRR in 6 months using this platform for all our content and ads."</p>
      <div class="text-white font-semibold">Jordan Lee</div>
      <div class="text-slate-500 text-sm">Growth Lead @ ScaleUp</div>
    </div>
  </div>
</section>`);

  // ── FEATURES ──────────────────────────────────────────────────────────────

  block(editor, 'feature-grid-3col', 'Feature Grid 3col', 'Features', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-14"><h2 class="text-4xl font-bold text-white mb-4">Everything you need</h2><p class="text-slate-400 text-lg max-w-xl mx-auto">Built for modern teams who move fast.</p></div>
    <div class="grid md:grid-cols-3 gap-6">
      ${[['⚡','Blazing Fast','Deploy in seconds with our optimized infrastructure.'],['🎯','Smart Targeting','Reach the right audience at the right time.'],['📊','Deep Analytics','Understand exactly what drives your growth.'],['🔒','Enterprise Security','SOC2 compliant with end-to-end encryption.'],['🤖','AI-Powered','Let AI handle the heavy lifting automatically.'],['🌐','Global Scale','Serve millions of users with zero downtime.']].map(([icon,title,desc])=>`
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/30 transition-all">
        <div class="text-3xl mb-4">${icon}</div>
        <h3 class="text-white font-semibold text-lg mb-2">${title}</h3>
        <p class="text-slate-400 text-sm leading-relaxed">${desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`);

  block(editor, 'feature-grid-4col', 'Feature Grid 4col', 'Features', `
<section class="bg-slate-900 py-16 px-4">
  <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
    ${[['🚀','Launch Fast'],['🎨','Beautiful UI'],['📈','Grow Revenue'],['🔧','Easy Setup'],['💬','Live Chat'],['📧','Email Flows'],['🔗','Integrations'],['🛡️','99.9% Uptime']].map(([i,t])=>`
    <div class="bg-slate-800 border border-slate-700/50 rounded-xl p-5 text-center">
      <div class="text-2xl mb-2">${i}</div>
      <div class="text-white text-sm font-medium">${t}</div>
    </div>`).join('')}
  </div>
</section>`);

  block(editor, 'feature-alternating', 'Feature Alternating', 'Features', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-6xl mx-auto space-y-20">
    ${[['Generate content at scale','Our AI analyzes your brand, then creates 100+ pieces of on-brand content — posts, ads, emails, landing pages — in minutes.','🤖'],['Publish everywhere, automatically','Connect your social accounts, email platform, and ad accounts. Schedule everything from one dashboard.','📅']].map(([title,desc,icon],i)=>`
    <div class="grid md:grid-cols-2 gap-12 items-center ${i%2===1?'md:[&>*:first-child]:order-2':''}">
      <div>
        <div class="text-4xl mb-4">${icon}</div>
        <h3 class="text-3xl font-bold text-white mb-4">${title}</h3>
        <p class="text-slate-400 leading-relaxed text-lg">${desc}</p>
      </div>
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl aspect-video flex items-center justify-center"><span class="text-slate-600 text-sm">Illustration</span></div>
    </div>`).join('')}
  </div>
</section>`);

  block(editor, 'feature-bento', 'Feature Bento Grid', 'Features', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-4xl font-bold text-white text-center mb-12">Built different</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div class="col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 flex gap-6 items-center">
        <div class="text-5xl">🧠</div>
        <div><h3 class="text-xl font-bold text-white mb-2">AI that actually works</h3><p class="text-slate-400">Not just GPT wrappers — purpose-built models trained on converting content.</p></div>
      </div>
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between">
        <div class="text-4xl">⚡</div>
        <div><h3 class="text-white font-bold mb-1">10x faster</h3><p class="text-slate-400 text-sm">Than doing it manually</p></div>
      </div>
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <div class="text-4xl mb-3">📊</div>
        <h3 class="text-white font-bold mb-1">Real analytics</h3>
        <p class="text-slate-400 text-sm">See exactly what's working</p>
      </div>
      <div class="col-span-2 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/30 rounded-2xl p-8">
        <h3 class="text-xl font-bold text-white mb-2">Ready to start?</h3>
        <p class="text-slate-400 mb-4">Join 10,000+ teams already using our platform.</p>
        <a href="#" class="inline-block px-5 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-all" style="background:${ACCENT}">Get started free →</a>
      </div>
    </div>
  </div>
</section>`);

  block(editor, 'feature-comparison', 'Feature Comparison', 'Features', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold text-white text-center mb-12">The old way vs our way</h2>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-red-900/10 border border-red-800/30 rounded-2xl p-6">
        <h3 class="text-red-400 font-bold text-lg mb-4">❌ Without us</h3>
        <ul class="space-y-3">
          ${['Hours writing copy manually','Expensive freelancers','Inconsistent brand voice','No performance data','Slow to launch campaigns'].map(i=>`<li class="text-slate-400 flex gap-2"><span class="text-red-500">✗</span>${i}</li>`).join('')}
        </ul>
      </div>
      <div class="bg-green-900/10 border border-green-800/30 rounded-2xl p-6">
        <h3 class="text-green-400 font-bold text-lg mb-4">✅ With us</h3>
        <ul class="space-y-3">
          ${['100+ pieces in minutes','AI does the heavy lifting','Always on-brand','Real-time analytics','Launch campaigns same day'].map(i=>`<li class="text-slate-300 flex gap-2"><span class="text-green-500">✓</span>${i}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
</section>`);

  block(editor, 'feature-with-screenshot', 'Feature + Screenshot', 'Features', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
    <div>
      <h2 class="text-4xl font-bold text-white mb-6">Powerful dashboard, simple interface</h2>
      <ul class="space-y-4">
        ${['See all your content in one place','Real-time performance metrics','One-click publishing to all platforms'].map(i=>`<li class="flex gap-3 text-slate-300"><span class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style="background:${ACCENT}">✓</span>${i}</li>`).join('')}
      </ul>
    </div>
    <div class="bg-slate-800 border border-slate-700 rounded-2xl aspect-video flex items-center justify-center shadow-2xl shadow-black/50"><span class="text-slate-600 text-sm">Screenshot</span></div>
  </div>
</section>`);

  block(editor, 'feature-tabs', 'Feature Tabs', 'Features', `
<style>.feat-tab{cursor:pointer;padding:10px 20px;border-radius:8px;color:#94a3b8;font-weight:500;border:none;background:none}.feat-tab.active{background:${ACCENT};color:#fff}.feat-panel{display:none}.feat-panel.active{display:block}</style>
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-4xl font-bold text-white text-center mb-10">One platform, infinite possibilities</h2>
    <div class="flex gap-2 justify-center mb-8" id="feat-tabs">
      <button class="feat-tab active" onclick="document.querySelectorAll('.feat-tab,.feat-panel').forEach(e=>e.classList.remove('active'));this.classList.add('active');document.getElementById('panel-1').classList.add('active')">Content</button>
      <button class="feat-tab" onclick="document.querySelectorAll('.feat-tab,.feat-panel').forEach(e=>e.classList.remove('active'));this.classList.add('active');document.getElementById('panel-2').classList.add('active')">Analytics</button>
      <button class="feat-tab" onclick="document.querySelectorAll('.feat-tab,.feat-panel').forEach(e=>e.classList.remove('active'));this.classList.add('active');document.getElementById('panel-3').classList.add('active')">Publish</button>
    </div>
    <div id="panel-1" class="feat-panel active bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center aspect-video flex items-center justify-center"><span class="text-slate-400 text-lg">Content generation interface</span></div>
    <div id="panel-2" class="feat-panel bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center aspect-video flex items-center justify-center"><span class="text-slate-400 text-lg">Analytics dashboard</span></div>
    <div id="panel-3" class="feat-panel bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center aspect-video flex items-center justify-center"><span class="text-slate-400 text-lg">Publishing workflow</span></div>
  </div>
</section>`);

  // ── CONTENT ───────────────────────────────────────────────────────────────

  block(editor, 'text-block', 'Text Block', 'Content', `<section class="bg-slate-950 py-16 px-4"><div class="max-w-3xl mx-auto"><h2 class="text-3xl font-bold text-white mb-4">Section Heading</h2><p class="text-slate-400 text-lg leading-relaxed mb-4">Write your content here. This block supports rich text editing — headings, paragraphs, bold, italic, and links.</p><p class="text-slate-400 text-lg leading-relaxed">Add as many paragraphs as you need. Keep it scannable with short paragraphs and clear language.</p></div></section>`);

  block(editor, 'two-column-text', 'Two Column Text', 'Content', `<section class="bg-slate-950 py-16 px-4"><div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12"><div><h3 class="text-2xl font-bold text-white mb-4">Column One</h3><p class="text-slate-400 leading-relaxed">Your content goes here. This left column can hold text, lists, or any other content you need.</p></div><div><h3 class="text-2xl font-bold text-white mb-4">Column Two</h3><p class="text-slate-400 leading-relaxed">Your content goes here. This right column mirrors the left for a balanced two-column layout.</p></div></div></section>`);

  block(editor, 'blockquote', 'Blockquote', 'Content', `<section class="bg-slate-950 py-16 px-4"><div class="max-w-3xl mx-auto"><blockquote class="border-l-4 pl-6" style="border-color:${ACCENT}"><p class="text-2xl text-white font-medium leading-relaxed mb-4">"The best time to plant a tree was 20 years ago. The second best time is now."</p><cite class="text-slate-500 not-italic">— Someone wise</cite></blockquote></div></section>`);

  block(editor, 'numbered-steps', 'Numbered Steps', 'Content', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold text-white text-center mb-14">How it works</h2>
    <div class="relative">
      <div class="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-800 md:hidden"></div>
      <div class="space-y-8">
        ${[['Enter your URL','Paste your website URL and our AI scrapes your brand, colors, and messaging.'],['AI generates content','Claude creates 100+ pieces of on-brand content across every platform.'],['Review and publish','Edit anything you want, then publish to all your channels in one click.']].map(([t,d],i)=>`
        <div class="flex gap-6 items-start">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg text-white flex-shrink-0" style="background:${ACCENT}">${i+1}</div>
          <div class="pt-2"><h3 class="text-xl font-bold text-white mb-2">${t}</h3><p class="text-slate-400 leading-relaxed">${d}</p></div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</section>`);

  block(editor, 'icon-list', 'Icon List', 'Content', `<section class="bg-slate-950 py-16 px-4"><div class="max-w-3xl mx-auto"><h2 class="text-3xl font-bold text-white mb-8">What you get</h2><ul class="space-y-4">${['Unlimited AI content generation','24/7 customer support','Advanced analytics dashboard','50+ social media templates','Email sequence builder','Landing page generator'].map(i=>`<li class="flex gap-3 text-slate-300 text-lg"><span class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5" style="background:${ACCENT}">✓</span>${i}</li>`).join('')}</ul></div></section>`);

  // ── CTA ───────────────────────────────────────────────────────────────────

  block(editor, 'cta-banner', 'CTA Banner', 'CTA', `
<section class="py-20 px-4 text-center" style="background:linear-gradient(135deg,${ACCENT},${SEC})">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-4xl font-black text-white mb-4">Ready to 10x your marketing?</h2>
    <p class="text-white/80 text-lg mb-8">Join 10,000+ teams using AI to grow faster.</p>
    <a href="#" class="inline-block bg-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-all" style="color:${ACCENT}">Start free trial →</a>
  </div>
</section>`);

  block(editor, 'cta-split', 'CTA Split', 'CTA', `
<section class="bg-slate-900 border-y border-slate-800 py-16 px-4">
  <div class="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-between">
    <div><h2 class="text-3xl font-bold text-white mb-2">Start for free today</h2><p class="text-slate-400">No credit card required. Cancel anytime.</p></div>
    <div class="flex gap-3 flex-shrink-0">
      <input type="email" placeholder="Enter your email" class="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none w-64">
      <button class="px-6 py-3 rounded-xl font-semibold text-white whitespace-nowrap hover:opacity-90 transition-all" style="background:${ACCENT}">Get started</button>
    </div>
  </div>
</section>`);

  block(editor, 'cta-card', 'CTA Card', 'CTA', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-2xl mx-auto text-center bg-slate-800/50 rounded-3xl p-12" style="border:1px solid ${ACCENT}40">
    <h2 class="text-4xl font-black text-white mb-4">Let's get started</h2>
    <p class="text-slate-400 text-lg mb-8">Everything you need to grow is one click away.</p>
    <a href="#" class="inline-block px-8 py-4 rounded-xl font-bold text-white hover:opacity-90 transition-all" style="background:${ACCENT}">Try free for 14 days</a>
    <p class="text-slate-600 text-sm mt-4">No credit card · Cancel anytime</p>
  </div>
</section>`);

  block(editor, 'cta-countdown', 'CTA Countdown', 'CTA', `
<style>#countdown{display:flex;gap:16px;justify-content:center;margin-bottom:24px}.cdown-box{background:rgba(255,255,255,.1);border-radius:12px;padding:12px 16px;min-width:64px;text-align:center}.cdown-num{font-size:28px;font-weight:900;color:#fff;display:block}.cdown-lbl{font-size:11px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:1px}</style>
<section class="py-20 px-4 text-center" style="background:linear-gradient(135deg,#1e1040,#0f1729)">
  <div class="max-w-2xl mx-auto">
    <div class="text-sm font-bold uppercase tracking-widest mb-4" style="color:${ACCENT}">Limited time offer</div>
    <h2 class="text-4xl font-black text-white mb-4">50% off ends soon</h2>
    <div id="countdown">
      <div class="cdown-box"><span class="cdown-num" id="cd-h">23</span><span class="cdown-lbl">hours</span></div>
      <div class="cdown-box"><span class="cdown-num" id="cd-m">59</span><span class="cdown-lbl">mins</span></div>
      <div class="cdown-box"><span class="cdown-num" id="cd-s">59</span><span class="cdown-lbl">secs</span></div>
    </div>
    <a href="#" class="inline-block px-8 py-4 rounded-xl font-bold text-white hover:opacity-90 transition-all" style="background:${ACCENT}">Claim 50% off</a>
  </div>
</section>
<script>let s=86399;setInterval(()=>{s--;const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;document.getElementById('cd-h').textContent=String(h).padStart(2,'0');document.getElementById('cd-m').textContent=String(m).padStart(2,'0');document.getElementById('cd-s').textContent=String(sec).padStart(2,'0');if(s<=0)s=86399},1000);</script>`);

  // ── PRICING ───────────────────────────────────────────────────────────────

  block(editor, 'pricing-3tier', 'Pricing 3 Tier', 'Pricing', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-12"><h2 class="text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2><p class="text-slate-400">Start free. Scale as you grow.</p></div>
    <div class="grid md:grid-cols-3 gap-6 items-start">
      ${[['Starter','Free','For individuals just getting started',['5 AI generations/month','3 social templates','Email support'],false],['Pro','$49/mo','For growing teams who need more',['Unlimited generations','All templates','Priority support','Analytics dashboard'],true],['Enterprise','Custom','For large teams and agencies',['Everything in Pro','Custom AI training','Dedicated account manager','SLA guarantee'],false]].map(([name,price,desc,features,popular])=>`
      <div class="bg-slate-800/50 border rounded-2xl p-8 ${popular?'border-indigo-500 relative':'border-slate-700/50'}">
        ${popular?`<div class="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full text-white" style="background:${ACCENT}">Most Popular</div>`:''}
        <h3 class="text-white font-bold text-lg mb-1">${name}</h3>
        <div class="text-4xl font-black text-white mb-2">${price}</div>
        <p class="text-slate-500 text-sm mb-6">${desc}</p>
        <ul class="space-y-3 mb-8">${(features as string[]).map(f=>`<li class="text-slate-300 text-sm flex gap-2"><span style="color:${ACCENT}">✓</span>${f}</li>`).join('')}</ul>
        <a href="#" class="block text-center py-3 rounded-xl font-semibold transition-all ${popular?'text-white hover:opacity-90':'text-slate-300 bg-slate-700 hover:bg-slate-600'}" style="${popular?`background:${ACCENT}`:''}">Get started</a>
      </div>`).join('')}
    </div>
  </div>
</section>`);

  block(editor, 'pricing-2tier', 'Pricing 2 Tier', 'Pricing', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-4xl font-bold text-white text-center mb-12">Choose your plan</h2>
    <div class="grid md:grid-cols-2 gap-6">
      ${[['Free','$0/mo',['5 generations/month','Basic templates','Community support'],false],['Pro','$49/mo',['Unlimited generations','All templates','Priority support','Analytics'],true]].map(([n,p,f,pop])=>`
      <div class="bg-slate-800/50 border ${pop?'border-indigo-500':'border-slate-700/50'} rounded-2xl p-8">
        <h3 class="text-white font-bold text-xl mb-1">${n}</h3>
        <div class="text-3xl font-black text-white mb-6">${p}</div>
        <ul class="space-y-3 mb-8">${(f as string[]).map(i=>`<li class="text-slate-300 flex gap-2 text-sm"><span style="color:${ACCENT}">✓</span>${i}</li>`).join('')}</ul>
        <a href="#" class="block text-center py-3 rounded-xl font-semibold transition-all ${pop?'text-white hover:opacity-90':'bg-slate-700 text-slate-300 hover:bg-slate-600'}" style="${pop?`background:${ACCENT}`:''}">Get started</a>
      </div>`).join('')}
    </div>
  </div>
</section>`);

  block(editor, 'pricing-toggle', 'Pricing Toggle', 'Pricing', `
<style>.toggle-btn{cursor:pointer;padding:6px 20px;border-radius:6px;font-size:14px;font-weight:600;border:none;background:none;color:#94a3b8}.toggle-btn.active{background:#1e2a3a;color:#fff}</style>
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-5xl mx-auto text-center">
    <h2 class="text-4xl font-bold text-white mb-8">Pricing</h2>
    <div class="inline-flex bg-slate-900 border border-slate-800 rounded-lg p-1 mb-10">
      <button class="toggle-btn active" onclick="document.querySelectorAll('.price-monthly').forEach(e=>e.style.display='block');document.querySelectorAll('.price-yearly').forEach(e=>e.style.display='none');document.querySelectorAll('.toggle-btn')[0].classList.add('active');document.querySelectorAll('.toggle-btn')[1].classList.remove('active')">Monthly</button>
      <button class="toggle-btn" onclick="document.querySelectorAll('.price-monthly').forEach(e=>e.style.display='none');document.querySelectorAll('.price-yearly').forEach(e=>e.style.display='block');document.querySelectorAll('.toggle-btn')[1].classList.add('active');document.querySelectorAll('.toggle-btn')[0].classList.remove('active')">Yearly <span class="text-green-400 text-xs">-20%</span></button>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      ${[['Starter','$0','$0'],['Pro','$49','$39'],['Agency','$149','$119']].map(([n,m,y])=>`
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
        <h3 class="text-white font-bold text-lg mb-2">${n}</h3>
        <div class="price-monthly text-3xl font-black text-white">${m}<span class="text-slate-500 text-sm font-normal">/mo</span></div>
        <div class="price-yearly text-3xl font-black text-white" style="display:none">${y}<span class="text-slate-500 text-sm font-normal">/mo</span></div>
        <a href="#" class="mt-6 block text-center py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-all" style="background:${ACCENT}">Get started</a>
      </div>`).join('')}
    </div>
  </div>
</section>`);

  // ── FAQ ───────────────────────────────────────────────────────────────────

  block(editor, 'faq-accordion', 'FAQ Accordion', 'FAQ', `
<style>.faq-item .faq-ans{display:none;padding:0 0 16px 0;color:#94a3b8;line-height:1.6}.faq-item.open .faq-ans{display:block}.faq-item.open .faq-icon{transform:rotate(45deg)}.faq-icon{transition:transform .2s;font-size:20px;color:#94a3b8}</style>
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-3xl mx-auto">
    <h2 class="text-4xl font-bold text-white text-center mb-12">Frequently asked questions</h2>
    <div class="space-y-3">
      ${[['How does the AI content generation work?','Our AI analyzes your website to extract your brand voice, colors, and messaging. Then it uses Claude to generate 100+ pieces of content tailored specifically to your brand.'],['Do I need any design skills?','No design skills needed. Our templates handle all the visual design automatically.'],['Can I edit the generated content?','Yes — everything is fully editable. The AI gives you a great starting point, you make it perfect.'],['What platforms does it support?','Instagram, LinkedIn, Facebook, Twitter/X, email, and Google Ads.'],['Is there a free trial?','Yes, you can start for free with no credit card required.']].map(([q,a])=>`
      <div class="faq-item bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <button onclick="this.closest('.faq-item').classList.toggle('open')" class="w-full flex justify-between items-center p-5 text-left bg-transparent border-none cursor-pointer">
          <span class="text-white font-medium">${q}</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-ans px-5">${a}</div>
      </div>`).join('')}
    </div>
  </div>
</section>`);

  block(editor, 'faq-2col', 'FAQ 2 Column', 'FAQ', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-4xl font-bold text-white text-center mb-12">Common questions</h2>
    <div class="grid md:grid-cols-2 gap-6">
      ${[['How long does it take?','Content is generated in under 2 minutes for a full brand package.'],['What formats do I get?','Images, copy, email HTML, and a full landing page.'],['Can I use my own images?','Yes, upload your own or use our AI-generated images.'],['Is my data secure?','Yes, SOC2 compliant with end-to-end encryption.'],['Do you offer refunds?','30-day money-back guarantee, no questions asked.'],['How many brands can I have?','Pro plan supports 3 brands, Agency supports unlimited.']].map(([q,a])=>`
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h3 class="text-white font-semibold mb-2">${q}</h3>
        <p class="text-slate-400 text-sm leading-relaxed">${a}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`);

  // ── NAVIGATION ────────────────────────────────────────────────────────────

  block(editor, 'navbar-simple', 'Navbar Simple', 'Navigation', `
<style>.mobile-menu{display:none}@media(max-width:768px){.nav-links{display:none}.mobile-menu{display:block}}</style>
<nav class="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
  <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    <div class="text-xl font-black text-white">YourBrand</div>
    <div class="nav-links flex items-center gap-8">
      <a href="#" class="text-slate-400 hover:text-white transition-colors text-sm">Features</a>
      <a href="#" class="text-slate-400 hover:text-white transition-colors text-sm">Pricing</a>
      <a href="#" class="text-slate-400 hover:text-white transition-colors text-sm">About</a>
      <a href="#" class="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-all" style="background:${ACCENT}">Get started</a>
    </div>
  </div>
</nav>`);

  block(editor, 'navbar-transparent', 'Navbar Transparent', 'Navigation', `
<style>.nav-scroll{transition:background .3s,border .3s}</style>
<nav class="nav-scroll fixed top-0 left-0 right-0 z-50 border-b border-transparent" id="main-nav">
  <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    <div class="text-xl font-black text-white">YourBrand</div>
    <div class="flex items-center gap-8">
      <a href="#" class="text-white/80 hover:text-white text-sm transition-colors">Features</a>
      <a href="#" class="text-white/80 hover:text-white text-sm transition-colors">Pricing</a>
      <a href="#" class="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style="background:${ACCENT}">Start free</a>
    </div>
  </div>
</nav>
<script>window.addEventListener('scroll',()=>{const n=document.getElementById('main-nav');n&&(window.scrollY>50?(n.style.background='rgba(10,10,26,0.95)',n.style.borderColor='rgba(30,42,58,1)'):(n.style.background='transparent',n.style.borderColor='transparent'))});</script>`);

  // ── FOOTERS ───────────────────────────────────────────────────────────────

  block(editor, 'footer-4col', 'Footer 4 Column', 'Footers', `
<footer class="bg-slate-950 border-t border-slate-800 pt-16 pb-8 px-4">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      <div><div class="text-lg font-black text-white mb-4">YourBrand</div><p class="text-slate-500 text-sm leading-relaxed">The AI platform for modern marketing teams.</p></div>
      ${[['Product',['Features','Pricing','Changelog','Roadmap']],['Company',['About','Blog','Careers','Press']],['Legal',['Privacy','Terms','Security','Cookies']]].map(([cat,links])=>`<div><h4 class="text-white font-semibold text-sm mb-4">${cat}</h4><ul class="space-y-2">${(links as string[]).map(l=>`<li><a href="#" class="text-slate-500 text-sm hover:text-white transition-colors">${l}</a></li>`).join('')}</ul></div>`).join('')}
    </div>
    <div class="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-slate-600 text-sm">© 2025 YourBrand. All rights reserved.</p>
      <div class="flex gap-4">${['Twitter','LinkedIn','GitHub'].map(s=>`<a href="#" class="text-slate-500 hover:text-white text-sm transition-colors">${s}</a>`).join('')}</div>
    </div>
  </div>
</footer>`);

  block(editor, 'footer-simple', 'Footer Simple', 'Footers', `
<footer class="bg-slate-950 border-t border-slate-800 py-8 px-4">
  <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
    <div class="text-lg font-black text-white">YourBrand</div>
    <div class="flex gap-6">${['Features','Pricing','Blog','Contact'].map(l=>`<a href="#" class="text-slate-500 text-sm hover:text-white transition-colors">${l}</a>`).join('')}</div>
    <p class="text-slate-600 text-sm">© 2025 YourBrand</p>
  </div>
</footer>`);

  block(editor, 'footer-cta', 'Footer + CTA', 'Footers', `
<footer class="bg-slate-950 border-t border-slate-800 px-4">
  <div class="max-w-3xl mx-auto py-16 text-center">
    <h3 class="text-3xl font-bold text-white mb-3">Stay in the loop</h3>
    <p class="text-slate-400 mb-6">Get the latest updates and tips delivered to your inbox.</p>
    <div class="flex gap-3 max-w-md mx-auto mb-12">
      <input type="email" placeholder="you@company.com" class="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none">
      <button class="px-5 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-all whitespace-nowrap" style="background:${ACCENT}">Subscribe</button>
    </div>
  </div>
  <div class="border-t border-slate-800 py-6 text-center"><p class="text-slate-600 text-sm">© 2025 YourBrand. All rights reserved.</p></div>
</footer>`);

  // ── MEDIA ─────────────────────────────────────────────────────────────────

  block(editor, 'image-full', 'Full Width Image', 'Media', `<section class="bg-slate-950 py-16 px-4"><div class="max-w-6xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl aspect-video flex items-center justify-center"><span class="text-slate-500 text-sm">Drop your image here</span></div></section>`);

  block(editor, 'video-embed', 'Video Embed', 'Media', `<section class="bg-slate-950 py-20 px-4"><div class="max-w-4xl mx-auto"><div class="bg-slate-800 border border-slate-700 rounded-2xl aspect-video overflow-hidden"><iframe class="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe></div></div></section>`);

  block(editor, 'image-gallery', 'Image Gallery', 'Media', `<section class="bg-slate-950 py-16 px-4"><div class="max-w-6xl mx-auto grid grid-cols-3 gap-4">${Array.from({length:6}).map(()=>`<div class="bg-slate-800 border border-slate-700 rounded-xl aspect-square flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-all"><span class="text-slate-600 text-xs">Image</span></div>`).join('')}</div></section>`);

  // ── FORMS ─────────────────────────────────────────────────────────────────

  block(editor, 'lead-capture', 'Lead Capture', 'Forms', `
<section class="bg-slate-950 py-20 px-4 text-center">
  <div class="max-w-lg mx-auto">
    <h2 class="text-3xl font-bold text-white mb-3">Get early access</h2>
    <p class="text-slate-400 mb-6">Join 2,000+ founders on the waitlist.</p>
    <div class="flex gap-3">
      <input type="email" placeholder="your@email.com" class="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none">
      <button class="px-6 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-all whitespace-nowrap" style="background:${ACCENT}">Join waitlist</button>
    </div>
    <p class="text-slate-600 text-xs mt-3">We respect your privacy. No spam, ever.</p>
  </div>
</section>`);

  block(editor, 'contact-form', 'Contact Form', 'Forms', `
<section class="bg-slate-950 py-20 px-4">
  <div class="max-w-xl mx-auto">
    <h2 class="text-4xl font-bold text-white mb-8 text-center">Get in touch</h2>
    <form class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <input type="text" placeholder="First name" class="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full">
        <input type="text" placeholder="Last name" class="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full">
      </div>
      <input type="email" placeholder="Email address" class="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500">
      <textarea rows="4" placeholder="Your message..." class="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"></textarea>
      <button type="submit" class="w-full py-4 rounded-xl font-semibold text-white hover:opacity-90 transition-all" style="background:${ACCENT}">Send message</button>
    </form>
  </div>
</section>`);

  block(editor, 'newsletter-signup', 'Newsletter Signup', 'Forms', `
<section class="bg-slate-900 border-y border-slate-800 py-12 px-4">
  <div class="max-w-2xl mx-auto text-center">
    <h3 class="text-2xl font-bold text-white mb-2">Subscribe to our newsletter</h3>
    <p class="text-slate-400 mb-6 text-sm">Weekly tips on growing your business with AI.</p>
    <div class="flex gap-3 max-w-sm mx-auto" id="nl-form">
      <input type="email" placeholder="Enter your email" class="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none text-sm">
      <button onclick="document.getElementById('nl-form').innerHTML='<p class=\\'text-green-400 font-medium\\'>✓ You\\'re in!</p>'" class="px-5 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-all text-sm whitespace-nowrap" style="background:${ACCENT}">Subscribe</button>
    </div>
  </div>
</section>`);

  // ── FULL PAGE TEMPLATES ───────────────────────────────────────────────────

  block(editor, 'template-saas', 'SaaS Landing Page', 'Full Page Templates', `
<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>YourBrand — The smarter way to grow</title><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-slate-950">
<nav class="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800"><div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between"><div class="text-xl font-black text-white">YourBrand</div><div class="flex items-center gap-6"><a href="#features" class="text-slate-400 hover:text-white text-sm">Features</a><a href="#pricing" class="text-slate-400 hover:text-white text-sm">Pricing</a><a href="#" class="px-4 py-2 rounded-lg text-sm font-semibold text-white" style="background:${ACCENT}">Get started</a></div></div></nav>
<section class="relative py-28 px-4 text-center overflow-hidden"><div class="absolute inset-0" style="background:radial-gradient(ellipse at 50% 0%,${ACCENT}20,transparent 70%)"></div><div class="relative max-w-4xl mx-auto"><h1 class="text-6xl font-black text-white tracking-tight mb-6">The smarter way to<br><span style="color:${ACCENT}">grow your business</span></h1><p class="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">AI-powered tools that write, design, and publish — so you can focus on what matters.</p><div class="flex gap-4 justify-center"><a href="#" class="px-8 py-4 rounded-xl font-semibold text-white hover:opacity-90 transition-all" style="background:${ACCENT}">Start for free</a><a href="#" class="px-8 py-4 rounded-xl font-semibold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all">See demo →</a></div></div></section>
<section class="bg-slate-900 border-y border-slate-800 py-10 px-4"><div class="max-w-5xl mx-auto flex flex-wrap gap-8 justify-center items-center"><p class="text-slate-500 text-sm font-medium uppercase tracking-widest w-full text-center mb-4">Trusted by teams at</p>${['Acme','Globex','Umbrella','Initech'].map(n=>`<div class="bg-slate-800 rounded-lg px-5 py-2.5 text-slate-500 font-semibold text-sm">${n}</div>`).join('')}</div></section>
<section id="features" class="bg-slate-950 py-20 px-4"><div class="max-w-6xl mx-auto"><h2 class="text-4xl font-bold text-white text-center mb-12">Everything you need</h2><div class="grid md:grid-cols-3 gap-6">${[['⚡','10x Faster','Generate content in minutes, not hours.'],['🎯','On-Brand','AI trained on your specific voice.'],['📊','Analytics','See exactly what drives results.']].map(([i,t,d])=>`<div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"><div class="text-3xl mb-4">${i}</div><h3 class="text-white font-semibold text-lg mb-2">${t}</h3><p class="text-slate-400 text-sm">${d}</p></div>`).join('')}</div></div></section>
<section id="pricing" class="bg-slate-900 py-20 px-4"><div class="max-w-3xl mx-auto text-center"><h2 class="text-4xl font-bold text-white mb-12">Simple pricing</h2><div class="grid md:grid-cols-2 gap-6">${[['Free','$0',['5 generations/mo','Basic templates']],['Pro','$49/mo',['Unlimited generations','All templates','Analytics']]].map(([n,p,f],i)=>`<div class="bg-slate-800/50 border ${i===1?'border-indigo-500':'border-slate-700/50'} rounded-2xl p-8"><h3 class="text-white font-bold text-xl mb-2">${n}</h3><div class="text-3xl font-black text-white mb-6">${p}</div><ul class="space-y-2 mb-6 text-left">${(f as string[]).map(x=>`<li class="text-slate-300 text-sm flex gap-2"><span style="color:${ACCENT}">✓</span>${x}</li>`).join('')}</ul><a href="#" class="block text-center py-3 rounded-xl font-semibold text-white hover:opacity-90" style="background:${ACCENT}">Get started</a></div>`).join('')}</div></div></section>
<footer class="bg-slate-950 border-t border-slate-800 py-8 px-4"><div class="max-w-6xl mx-auto flex justify-between items-center"><div class="text-lg font-black text-white">YourBrand</div><p class="text-slate-600 text-sm">© 2025 YourBrand. All rights reserved.</p></div></footer>
</body></html>`);

}
