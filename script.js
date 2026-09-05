const themes = [
  { id: 'sunset', name: 'Sunset Glow', note: 'Warm & dreamy', bg: '#c95f4c', fg: '#fff6e9', soft: 'rgba(255,246,233,.68)', swatch: 'linear-gradient(145deg,#e99a77,#b94d45)', spark: '#ffe7a5' },
  { id: 'midnight', name: 'Midnight', note: 'Deep & celestial', bg: '#20243f', fg: '#f5eee1', soft: 'rgba(245,238,225,.64)', swatch: 'linear-gradient(145deg,#343b67,#17192e)', spark: '#f2d488' },
  { id: 'meadow', name: 'Wild Meadow', note: 'Fresh & natural', bg: '#637963', fg: '#fff9e9', soft: 'rgba(255,249,233,.68)', swatch: 'linear-gradient(145deg,#9faf88,#506753)', spark: '#f5df9b' },
  { id: 'blush', name: 'Soft Blush', note: 'Sweet & romantic', bg: '#dba0a0', fg: '#fffaf2', soft: 'rgba(255,250,242,.72)', swatch: 'linear-gradient(145deg,#ecc4bb,#ce898e)', spark: '#fff1bb' },
  { id: 'concert', name: 'Neon Concert', note: 'Electric & bold', bg: 'linear-gradient(145deg,#161026,#5e1d80)', fg: '#fff7ff', soft: 'rgba(255,247,255,.7)', swatch: 'linear-gradient(145deg,#0d0b18,#7526a0,#ec2f86)', spark: '#65f7ff' }
];

const decorations = [
  { id: 'stars', label: 'Stars', icon: '✦', items: ['✦','⋆','✧','★','⋆'] },
  { id: 'flowers', label: 'Flowers', icon: '❀', items: ['❀','✿','❁','❃','❀'] },
  { id: 'hearts', label: 'Hearts', icon: '♥', items: ['♥','♡','♥','❥','♡'] },
  { id: 'confetti', label: 'Confetti', icon: '◆', items: ['●','◆','▪','▲','●','◇'] },
  { id: 'sparkles', label: 'Sparkles', icon: '✧', items: ['✧','✦','⋆','✧','✦'] },
  { id: 'balloons', label: 'Balloons', icon: '◉', items: ['◉','◯','●','◉','○'] },
  { id: 'nature', label: 'Botanical', icon: '❧', items: ['❧','♣','❦','♠','❧'] },
  { id: 'sunshine', label: 'Sun & Moon', icon: '☀', items: ['☀','☾','☼','☁','✦'] },
  { id: 'none', label: 'None', icon: '○', items: [] }
];

const themeGrid = document.querySelector('#themeGrid');
const decorationList = document.querySelector('#decorationList');
const preview = document.querySelector('#preview');
const titleInput = document.querySelector('#eventTitle');
const eventDateInput = document.querySelector('#eventDate');
const eventTimeInput = document.querySelector('#eventTime');
const currentDateInput = document.querySelector('#currentDate');
const decorLayer = document.querySelector('#decorLayer');
const pageDecor = document.querySelector('#pageDecor');
const designPrompt = document.querySelector('#designPrompt');
const musicChoice = document.querySelector('#musicChoice');
const musicToggle = document.querySelector('#musicToggle');
const lockScreen = document.querySelector('#lockScreen');
const celebrationLayer = document.querySelector('#celebrationLayer');
let activeTheme = themes[0];
let activeDecor = new Set(['stars', 'sparkles']);
let customSymbols = [];
let lightingMode = 'none';
let activeLightColors = [];
let countdownPassword = '';
let audioContext;
let musicTimer;
let musicStep = 0;
let hasCelebrated = false;

const designWorlds = [
  { words: ['midnight','night','space','galaxy','celestial','moon','starry'], paper:'#11162d', ink:'#f7efdf', muted:'#aaaac0', line:'#343955', accent:'#e5c66f', surface:'rgba(255,255,255,.06)', glow:'rgba(94,113,255,.18)', bg:'#20294d', fg:'#fff5d7', soft:'rgba(255,245,215,.65)' },
  { words: ['ocean','beach','tropical','sea','aqua','mermaid'], paper:'#e7f4ef', ink:'#173c42', muted:'#66888a', line:'#bad8d1', accent:'#ed775f', surface:'rgba(255,255,255,.5)', glow:'rgba(42,173,181,.16)', bg:'#268c95', fg:'#fff9df', soft:'rgba(255,249,223,.7)' },
  { words: ['forest','woodland','earthy','nature','camping'], paper:'#edf0e2', ink:'#283a2b', muted:'#70806b', line:'#cbd3bc', accent:'#b1663f', surface:'rgba(255,255,255,.35)', glow:'rgba(75,113,70,.14)', bg:'#48664c', fg:'#fff8df', soft:'rgba(255,248,223,.68)' },
  { words: ['romantic','garden','pink','blush','princess','fairy','lavender'], paper:'#f8edf0', ink:'#53323f', muted:'#987481', line:'#e8cfd7', accent:'#c85f83', surface:'rgba(255,255,255,.42)', glow:'rgba(211,109,155,.14)', bg:'#c9809b', fg:'#fff8ee', soft:'rgba(255,248,238,.72)' },
  { words: ['sunset','warm','boho','desert','terracotta'], paper:'#f5eee2', ink:'#412d25', muted:'#8b746a', line:'#ddcfc0', accent:'#d45e45', surface:'rgba(255,255,255,.3)', glow:'rgba(212,94,69,.12)', bg:'#bd5947', fg:'#fff5e7', soft:'rgba(255,245,231,.68)' },
  { words: ['party','birthday','colorful','rainbow','joyful','fun'], paper:'#fff7df', ink:'#332b4f', muted:'#746d8b', line:'#e5d7bf', accent:'#7657d5', surface:'rgba(255,255,255,.48)', glow:'rgba(247,98,136,.15)', bg:'#7657d5', fg:'#fffbea', soft:'rgba(255,251,234,.72)' },
  { words: ['winter','snow','ice','frozen','christmas'], paper:'#edf5f7', ink:'#263c4d', muted:'#728894', line:'#cbdde2', accent:'#527fa0', surface:'rgba(255,255,255,.52)', glow:'rgba(99,165,196,.15)', bg:'#668da8', fg:'#ffffff', soft:'rgba(255,255,255,.72)' }
  ,{ words: ['concert','music','festival','stage','neon','dj','disco','rave','band'], paper:'#0d0b18', ink:'#fff7ff', muted:'#aaa1b8', line:'#312940', accent:'#ec2f86', surface:'rgba(255,255,255,.055)', glow:'rgba(101,247,255,.18)', bg:'linear-gradient(145deg,#161026,#5e1d80 58%,#a51f68)', fg:'#fff7ff', soft:'rgba(255,247,255,.7)' }
];

const symbolRules = [
  { words:['star','space','galaxy','celestial'], symbols:['✦','★','⋆','✧','✦'] }, { words:['moon','night'], symbols:['☾','✦','⋆'] },
  { words:['flower','garden','rose','floral'], symbols:['❀','✿','❁','❃','❦'] }, { words:['heart','romantic','love','wedding'], symbols:['♥','♡','❥','♥'] },
  { words:['butterfly','fairy'], symbols:['Ƹ̵̡Ӝ̵̨̄Ʒ','✧','❦'] }, { words:['beach','ocean','sea','tropical'], symbols:['≈','≋','☀','◇','∿'] },
  { words:['palm'], symbols:['♠','❧','☀'] }, { words:['forest','leaf','nature','woodland'], symbols:['❧','♣','♠','❦','✦'] },
  { words:['sun','sunshine','summer'], symbols:['☀','☼','✺','✦'] }, { words:['snow','winter','ice'], symbols:['❄','❅','❆','✦'] },
  { words:['party','birthday','confetti','celebration'], symbols:['●','◆','▲','■','✦','◉'] }, { words:['firefly','glowing','sparkle','magic'], symbols:['✦','·','✧','⋆'] },
  { words:['cat','kitten','dog','puppy','animal'], symbols:['♠','●','♥','❧'] },
  { words:['music','concert','dance'], symbols:['♪','♫','♬','✦'] }, { words:['food','dinner','restaurant'], symbols:['❦','●','◇','✦'] },
  { words:['book','library','reading'], symbols:['❦','§','✧','☾'] }, { words:['sports','game','football','soccer'], symbols:['★','●','◆','✦'] },
  { words:['travel','vacation','trip','airplane'], symbols:['✈','◇','✦','⌖'] }, { words:['baby','shower'], symbols:['♡','○','⋆','❦'] },
  { words:['halloween','spooky','ghost'], symbols:['☾','♠','✦','☠'] }, { words:['christmas','holiday'], symbols:['♠','★','❄','✦'] },
  { words:['graduation','graduate'], symbols:['★','◆','✦','❦'] }, { words:['coffee','cafe'], symbols:['♨','❦','♡'] }
];

const colorHues = {
  red: 5, coral: 12, orange: 28, gold: 44, yellow: 52, lime: 82,
  green: 132, mint: 158, teal: 178, aqua: 188, blue: 218, navy: 228,
  purple: 270, violet: 282, lavender: 276, pink: 332, rose: 344, brown: 24
};

const patternRules = [
  { name:'striped', words:['stripe','stripes','striped','lines'], image:'repeating-linear-gradient(45deg, transparent 0 14px, var(--accent) 14px 17px)', size:'40px 40px', opacity:'.18' },
  { name:'polka dot', words:['polka','dots','dotted','dot pattern'], image:'radial-gradient(circle, var(--accent) 2.5px, transparent 3px)', size:'24px 24px', opacity:'.2' },
  { name:'soft gingham checkerboard', words:['checker','checkered','checkerboard','chess'], image:'linear-gradient(90deg, color-mix(in srgb, var(--accent) 42%, transparent) 50%, transparent 50%), linear-gradient(color-mix(in srgb, var(--accent) 42%, transparent) 50%, transparent 50%)', size:'72px 72px', opacity:'.72' },
  { name:'grid', words:['grid','graph','squares'], image:'linear-gradient(var(--accent) 1.5px, transparent 1.5px), linear-gradient(90deg, var(--accent) 1.5px, transparent 1.5px)', size:'30px 30px', opacity:'.16' },
  { name:'waves', words:['wave','wavy','waves','ocean pattern'], image:'radial-gradient(ellipse at 50% 100%, transparent 12px, var(--accent) 13px 15px, transparent 16px)', size:'34px 18px', opacity:'.2' },
  { name:'diamonds', words:['diamond','diamonds','geometric','argyle'], image:'linear-gradient(45deg, transparent 45%, var(--accent) 46% 54%, transparent 55%), linear-gradient(-45deg, transparent 45%, var(--accent) 46% 54%, transparent 55%)', size:'38px 38px', opacity:'.16' },
  { name:'stars', words:['star pattern','pattern of stars','starry pattern'], image:'radial-gradient(circle, var(--accent) 1.5px, transparent 2px), radial-gradient(circle, var(--accent) 2px, transparent 2.5px)', size:'28px 28px', opacity:'.21' },
  { name:'floral', words:['floral pattern','flower pattern','pattern of flowers','botanical pattern'], image:'radial-gradient(ellipse at 50% 0%, var(--accent) 0 3px, transparent 4px), radial-gradient(ellipse at 0% 50%, var(--accent) 0 3px, transparent 4px)', size:'30px 30px', opacity:'.2' },
  { name:'confetti', words:['confetti pattern','sprinkles','sprinkle pattern'], image:'linear-gradient(65deg, transparent 45%, var(--accent) 46% 54%, transparent 55%)', size:'23px 31px', opacity:'.22' }
  ,{ name:'plaid', words:['plaid','tartan','crosshatch'], image:'repeating-linear-gradient(0deg, transparent 0 18px, var(--accent) 18px 22px), repeating-linear-gradient(90deg, transparent 0 18px, var(--accent) 18px 22px)', size:'44px 44px', opacity:'.18' }
  ,{ name:'gingham', words:['gingham','picnic pattern'], image:'linear-gradient(90deg, var(--accent) 50%, transparent 50%), linear-gradient(var(--accent) 50%, transparent 50%)', size:'28px 28px', opacity:'.14' }
  ,{ name:'chevron', words:['chevron','zigzag','zig zag'], image:'linear-gradient(135deg, var(--accent) 25%, transparent 25%) -18px 0, linear-gradient(225deg, var(--accent) 25%, transparent 25%) -18px 0, linear-gradient(315deg, var(--accent) 25%, transparent 25%), linear-gradient(45deg, var(--accent) 25%, transparent 25%)', size:'36px 36px', opacity:'.18' }
  ,{ name:'honeycomb', words:['honeycomb','honey comb','hexagon','hexagons','bee pattern'], image:'radial-gradient(circle at 0 50%, transparent 9px, var(--accent) 10px 11px, transparent 12px), radial-gradient(circle at 100% 50%, transparent 9px, var(--accent) 10px 11px, transparent 12px)', size:'28px 24px', opacity:'.2' }
  ,{ name:'circles', words:['circle pattern','circles','bubbles','bubble pattern','rings'], image:'radial-gradient(circle, transparent 7px, var(--accent) 8px 10px, transparent 11px)', size:'29px 29px', opacity:'.2' }
  ,{ name:'hearts', words:['heart pattern','pattern of hearts','hearts pattern'], image:'radial-gradient(circle at 35% 35%, var(--accent) 0 3px, transparent 4px), radial-gradient(circle at 65% 35%, var(--accent) 0 3px, transparent 4px)', size:'25px 25px', opacity:'.22' }
  ,{ name:'bricks', words:['brick','bricks','brickwork','wall pattern'], image:'linear-gradient(var(--accent) 1.5px, transparent 1.5px), linear-gradient(90deg, var(--accent) 1.5px, transparent 1.5px)', size:'42px 21px', opacity:'.17' }
  ,{ name:'scallops', words:['scallop','scallops','fish scale','mermaid scale'], image:'radial-gradient(circle at 50% 0, transparent 14px, var(--accent) 15px 17px, transparent 18px)', size:'30px 20px', opacity:'.21' }
  ,{ name:'speckles', words:['speckle','speckles','speckled','terrazzo','grain','freckles'], image:'radial-gradient(circle at 20% 30%, var(--accent) 0 2px, transparent 2.5px), radial-gradient(circle at 75% 65%, var(--accent) 0 3px, transparent 3.5px), radial-gradient(circle at 45% 85%, var(--accent) 0 1.5px, transparent 2px)', size:'38px 38px', opacity:'.24' }
  ,{ name:'pinstripes', words:['pinstripe','pinstripes','thin stripes'], image:'repeating-linear-gradient(90deg, transparent 0 9px, var(--accent) 9px 10px)', size:'30px 30px', opacity:'.2' }
  ,{ name:'sound waves', words:['sound wave','soundwave','equalizer','audio pattern','music pattern'], image:'repeating-linear-gradient(90deg, var(--accent) 0 3px, transparent 3px 9px)', size:'45px 24px', opacity:'.2' }
];

function localISO(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

const today = new Date();
const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
currentDateInput.value = localISO(today);
eventDateInput.value = localISO(tomorrow);
eventDateInput.min = currentDateInput.value;

themes.forEach(theme => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `theme-card${theme.id === activeTheme.id ? ' active' : ''}`;
  button.setAttribute('role', 'radio');
  button.setAttribute('aria-checked', theme.id === activeTheme.id);
  button.innerHTML = `<div class="theme-swatch" style="--swatch:${theme.swatch};--spark:${theme.spark}"></div><strong>${theme.name}</strong><small>${theme.note}</small>`;
  button.addEventListener('click', () => {
    activeTheme = theme;
    customSymbols = [];
    lightingMode = 'none';
    activeLightColors = [];
    applyPatternFromPrompt('');
    preview.classList.remove('lights-moving', 'lights-flashing');
    if (theme.id === 'concert') {
      lightingMode = 'moving';
      activeLightColors = ['hsl(330 90% 62%)', 'hsl(184 90% 62%)', 'hsl(275 90% 65%)'];
      customSymbols = ['♪','♫','♬','✦','★'];
      preview.classList.add('lights-moving');
      applyPatternFromPrompt('equalizer');
    }
    document.querySelectorAll('.theme-card').forEach(card => {
      const selected = card === button;
      card.classList.toggle('active', selected);
      card.setAttribute('aria-checked', selected);
    });
    applyTheme(true);
  });
  themeGrid.appendChild(button);
});

decorations.forEach(decor => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `decor-button${activeDecor.has(decor.id) ? ' active' : ''}`;
  button.innerHTML = `<span>${decor.icon}</span>${decor.label}`;
  button.addEventListener('click', () => {
    customSymbols = [];
    if (decor.id === 'none') {
      activeDecor.clear();
    } else {
      activeDecor.delete('none');
      activeDecor.has(decor.id) ? activeDecor.delete(decor.id) : activeDecor.add(decor.id);
      if (!activeDecor.size) activeDecor.add('none');
    }
    document.querySelectorAll('.decor-button').forEach((item, index) => item.classList.toggle('active', activeDecor.has(decorations[index].id)));
    renderDecorations();
  });
  decorationList.appendChild(button);
});

function applyTheme(updateWholeSite = false) {
  preview.style.setProperty('--preview-bg', activeTheme.bg);
  preview.style.setProperty('--preview-fg', activeTheme.fg);
  preview.style.setProperty('--preview-soft', activeTheme.soft);
  if (updateWholeSite) {
    const quickWorlds = { sunset: designWorlds[4], midnight: designWorlds[0], meadow: designWorlds[2], blush: designWorlds[3], concert: designWorlds[7] };
    applyGlobalPalette(quickWorlds[activeTheme.id]);
  }
  renderDecorations();
}

function renderDecorations() {
  decorLayer.innerHTML = '';
  const positions = [[7,10],[83,12],[12,75],[89,70],[6,44],[92,39],[22,6],[74,84]];
  const symbols = [];
  customSymbols.forEach(symbol => symbols.push(symbol));
  [...activeDecor].filter(id => id !== 'none').forEach(id => {
    const decor = decorations.find(item => item.id === id);
    if (decor) symbols.push(...decor.items);
  });
  if (customSymbols.length) activeDecor = new Set();
  let cursor = 0;
  symbols.slice(0, 14).forEach((symbol, index) => {
      const [x, y] = positions[cursor++ % positions.length];
      const el = document.createElement('span');
      el.className = 'decor';
      el.textContent = symbol;
      el.style.cssText = `left:${x}%;top:${y}%;font-size:${14 + (index % 3) * 6}px;color:${activeTheme.fg};opacity:${.35 + (index % 3) * .18}`;
      decorLayer.appendChild(el);
  });
  renderPageDecorations(symbols);
}

function renderPageDecorations(symbols) {
  pageDecor.innerHTML = '';
  const positions = [[3,16],[91,21],[6,66],[94,78],[17,90],[81,51],[47,8]];
  const source = symbols.length ? symbols : ['✦','⋆','✧'];
  positions.forEach(([x,y], index) => {
    const el = document.createElement('span');
    el.className = 'page-ornament';
    el.textContent = source[index % source.length];
    el.style.cssText = `left:${x}%;top:${y}%;font-size:${28 + (index % 3) * 18}px`;
    pageDecor.appendChild(el);
  });
  if (lightingMode !== 'none') {
    pageDecor.classList.toggle('flashing', lightingMode === 'flashing');
    const colors = activeLightColors.length ? activeLightColors : ['hsl(48 90% 65%)', 'hsl(205 90% 65%)'];
    colors.slice(0, 4).forEach((color, index) => {
      const orb = document.createElement('i');
      orb.className = 'light-orb';
      orb.style.cssText = `left:${index % 2 ? 5 : 45}%;top:${index % 2 ? 50 : -5}%;background:${color};animation-delay:${index * -1.7}s`;
      pageDecor.appendChild(orb);
    });
  } else {
    pageDecor.classList.remove('flashing');
  }
}

function applyGlobalPalette(world) {
  if (!world) return;
  const root = document.documentElement.style;
  root.setProperty('--paper', world.paper);
  root.setProperty('--ink', world.ink);
  root.setProperty('--muted', world.muted);
  root.setProperty('--line', world.line);
  root.setProperty('--accent', world.accent);
  root.setProperty('--surface', world.surface);
  root.setProperty('--page-glow', world.glow);
}

function hashPrompt(prompt) {
  let hash = 0;
  for (const char of prompt) hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  return Math.abs(hash);
}

function generatePromptWorld(prompt) {
  const hash = hashPrompt(prompt);
  const namedColors = Object.keys(colorHues).filter(color => new RegExp(`\\b${color}\\b`).test(prompt));
  const hues = namedColors.map(color => colorHues[color]);
  const hue = hues.length ? hues[0] : hash % 360;
  const isDark = /dark|moody|gothic|black|night|dramatic/.test(prompt);
  const isPastel = /pastel|soft|gentle|airy|light/.test(prompt);
  const saturation = isPastel ? 42 : 52 + (hash % 22);
  if (isDark) {
    const darkBackground = hues.length > 1 ? `linear-gradient(135deg, ${hues.map(value => `hsl(${value} ${saturation}% 22%)`).join(', ')})` : `hsl(${hue} ${saturation}% 26%)`;
    return {
      paper:`hsl(${hue} ${Math.max(18, saturation - 30)}% 12%)`, ink:`hsl(${hue} 24% 94%)`,
      muted:`hsl(${hue} 14% 68%)`, line:`hsl(${hue} 18% 27%)`, accent:`hsl(${(hue + 42) % 360} 72% 67%)`,
      surface:'rgba(255,255,255,.055)', glow:`hsla(${hue} 78% 58% / .17)`,
      bg:darkBackground, fg:'#fffaf0', soft:'rgba(255,250,240,.68)'
    };
  }
  const pageBackground = hues.length > 1 ? `linear-gradient(135deg, ${hues.map(value => `hsl(${value} 38% 94%)`).join(', ')})` : `hsl(${hue} ${isPastel ? 38 : 31}% 94%)`;
  const cardBackground = hues.length > 1 ? `linear-gradient(135deg, ${hues.map(value => `hsl(${value} ${saturation}% ${isPastel ? 67 : 43}%)`).join(', ')})` : `hsl(${hue} ${saturation}% ${isPastel ? 67 : 43}%)`;
  return {
    paper:pageBackground, ink:`hsl(${hue} 25% 20%)`,
    muted:`hsl(${hue} 13% 47%)`, line:`hsl(${hue} 24% 82%)`, accent:`hsl(${hue} ${saturation}% 48%)`,
    surface:'rgba(255,255,255,.4)', glow:`hsla(${hue} 70% 55% / .14)`,
    bg:cardBackground, fg:'#fffaf0', soft:'rgba(255,250,240,.7)'
  };
}

function applyPatternFromPrompt(prompt) {
  const normalized = prompt.toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
  const match = patternRules
    .flatMap(rule => rule.words.filter(word => normalized.includes(word)).map(word => ({ rule, length: word.length })))
    .sort((a, b) => b.length - a.length)[0];
  const pattern = match?.rule;
  const root = document.documentElement.style;
  const previewImage = pattern ? pattern.image.split('var(--accent)').join('rgba(255,255,255,.72)') : 'none';
  root.setProperty('--page-pattern-image', pattern ? pattern.image : 'none');
  root.setProperty('--preview-pattern-image', previewImage);
  root.setProperty('--pattern-size', pattern ? pattern.size : '40px 40px');
  root.setProperty('--pattern-opacity', pattern ? pattern.opacity : '0');
  root.setProperty('--preview-pattern-opacity', pattern ? '.3' : '0');
  return pattern?.name || '';
}

function createFromPrompt() {
  const prompt = designPrompt.value.trim().toLowerCase();
  const status = document.querySelector('#designStatus');
  const button = document.querySelector('#createDesign');
  if (!prompt) {
    status.textContent = 'Describe a theme first — anything you can imagine.';
    designPrompt.focus();
    return;
  }
  button.classList.add('is-creating');
  status.textContent = 'Dreaming up your design…';
  setTimeout(() => {
    const scored = designWorlds.map(world => ({ world, score: world.words.reduce((total, word) => total + (prompt.includes(word) ? 1 : 0), 0) }));
    scored.sort((a,b) => b.score - a.score);
    const requestedColors = Object.keys(colorHues).filter(color => new RegExp(`\\b${color}\\b`).test(prompt));
    const hasNamedColor = requestedColors.length > 0;
    const world = scored[0].score && !hasNamedColor ? scored[0].world : generatePromptWorld(prompt);
    lightingMode = /flash|flashing|blinking|strobe/.test(prompt) ? 'flashing' : /moving light|dancing light|light beam|spotlight|glowing light|lights|concert|festival|stage|disco|rave/.test(prompt) ? 'moving' : 'none';
    activeLightColors = requestedColors.map(color => `hsl(${colorHues[color]} 90% 62%)`);
    const patternName = applyPatternFromPrompt(/concert|music|festival|stage|dj|disco|rave|band/.test(prompt) && !/pattern|stripe|dot|checker|plaid|wave|grid|diamond|heart|brick|scallop|speckle/.test(prompt) ? `${prompt} equalizer` : prompt);
    preview.classList.toggle('lights-moving', lightingMode === 'moving' || lightingMode === 'flashing');
    preview.classList.toggle('lights-flashing', lightingMode === 'flashing');
    const foundSymbols = [];
    symbolRules.forEach(rule => {
      if (rule.words.some(word => prompt.includes(word))) foundSymbols.push(...rule.symbols);
    });
    customSymbols = [...new Set(foundSymbols)];
    if (!customSymbols.length) customSymbols = ['✦','✧','⋆'];
    activeTheme = { ...activeTheme, bg: world.bg, fg: world.fg, soft: world.soft };
    applyGlobalPalette(world);
    document.querySelectorAll('.theme-card').forEach(card => { card.classList.remove('active'); card.setAttribute('aria-checked', 'false'); });
    document.querySelectorAll('.decor-button').forEach(card => card.classList.remove('active'));
    applyTheme();
    button.classList.remove('is-creating');
    const colorLabel = requestedColors.length ? requestedColors.join(' + ') : 'custom';
    status.textContent = `Created a ${colorLabel} world${patternName ? ` with a ${patternName} pattern` : ''}${lightingMode !== 'none' ? ` and ${lightingMode} lights` : ''}.`;
  }, 480);
}

function parseLocalDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function updateCountdown() {
  const eventDate = parseLocalDate(eventDateInput.value);
  const chosenCurrent = parseLocalDate(currentDateInput.value);
  if (!eventDate || !chosenCurrent) return;
  const [eventHour, eventMinute] = (eventTimeInput.value || '00:00').split(':').map(Number);
  eventDate.setHours(eventHour, eventMinute, 0, 0);
  const elapsedToday = Date.now() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const simulatedNow = chosenCurrent.getTime() + elapsedToday;
  const difference = Math.max(0, eventDate.getTime() - simulatedNow);
  if (difference === 0 && !hasCelebrated) {
    hasCelebrated = true;
    triggerCelebration();
  } else if (difference > 0) {
    hasCelebrated = false;
  }
  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference / 3600000) % 24);
  const minutes = Math.floor((difference / 60000) % 60);
  const seconds = Math.floor((difference / 1000) % 60);
  document.querySelector('#days').textContent = String(days).padStart(2, '0');
  document.querySelector('#hours').textContent = String(hours).padStart(2, '0');
  document.querySelector('#minutes').textContent = String(minutes).padStart(2, '0');
  document.querySelector('#seconds').textContent = String(seconds).padStart(2, '0');
  document.querySelector('#dateLine').textContent = eventDate.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

const melodies = {
  dreamy: { notes:[261.63,329.63,392,493.88,392,329.63], tempo:620, wave:'sine' },
  celebration: { notes:[392,523.25,659.25,523.25,698.46,783.99], tempo:330, wave:'triangle' },
  concert: { notes:[110,146.83,164.81,220,196,146.83], tempo:260, wave:'sawtooth' },
  peaceful: { notes:[220,277.18,329.63,277.18,246.94,220], tempo:820, wave:'sine' }
};

function playMusicNote() {
  const melody = melodies[musicChoice.value];
  if (!audioContext || audioContext.state === 'closed') return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = melody.wave;
  oscillator.frequency.value = melody.notes[musicStep++ % melody.notes.length];
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.055, audioContext.currentTime + .04);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + .55);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + .6);
}

function stopMusic() {
  clearInterval(musicTimer);
  musicTimer = undefined;
  musicToggle.textContent = '▶ Play';
  musicToggle.classList.remove('playing');
}

function triggerCelebration() {
  celebrationLayer.innerHTML = '';
  const pieces = ['✦','◆','●','▲','♥','★','▪'];
  for (let index = 0; index < 48; index++) {
    const piece = document.createElement('span');
    piece.className = 'celebration-piece';
    piece.textContent = pieces[index % pieces.length];
    piece.style.cssText = `left:${(index * 23) % 100}%;--fall-delay:${(index % 12) * .08}s;--fall-speed:${2.2 + (index % 7) * .18}s;--drift:${-70 + (index % 9) * 18}px;--spin:${180 + (index % 6) * 90}deg`;
    celebrationLayer.appendChild(piece);
  }
  preview.classList.remove('celebrating');
  void preview.offsetWidth;
  preview.classList.add('celebrating');
  setTimeout(() => preview.classList.remove('celebrating'), 4300);
}

musicToggle.addEventListener('click', async () => {
  if (musicTimer) {
    stopMusic();
    return;
  }
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  await audioContext.resume();
  musicStep = 0;
  playMusicNote();
  musicTimer = setInterval(playMusicNote, melodies[musicChoice.value].tempo);
  musicToggle.textContent = 'Ⅱ Pause';
  musicToggle.classList.add('playing');
});

musicChoice.addEventListener('change', () => {
  if (!musicTimer) return;
  clearInterval(musicTimer);
  musicStep = 0;
  playMusicNote();
  musicTimer = setInterval(playMusicNote, melodies[musicChoice.value].tempo);
});

document.querySelector('#previewCelebration').addEventListener('click', async () => {
  triggerCelebration();
  if (!musicTimer) {
    musicChoice.value = 'celebration';
    musicToggle.click();
    setTimeout(stopMusic, 4300);
  }
  document.querySelector('#extrasStatus').textContent = 'Celebration mode previewing now!';
});

document.querySelector('#lockCountdown').addEventListener('click', () => {
  const password = document.querySelector('#passwordSetup').value.trim();
  const status = document.querySelector('#extrasStatus');
  if (!password) {
    status.textContent = 'Enter a password before locking the countdown.';
    return;
  }
  countdownPassword = password;
  lockScreen.hidden = false;
  preview.classList.add('is-locked');
  document.querySelector('#passwordEntry').value = '';
  document.querySelector('#lockMessage').textContent = '';
  status.textContent = 'Your countdown is now locked.';
  setTimeout(() => document.querySelector('#passwordEntry').focus(), 50);
});

function unlockCountdown() {
  const entry = document.querySelector('#passwordEntry');
  const message = document.querySelector('#lockMessage');
  if (entry.value === countdownPassword) {
    lockScreen.hidden = true;
    preview.classList.remove('is-locked');
    entry.value = '';
    document.querySelector('#extrasStatus').textContent = 'Countdown unlocked.';
  } else {
    message.textContent = 'That password is not quite right.';
    entry.select();
  }
}

document.querySelector('#unlockCountdown').addEventListener('click', unlockCountdown);
document.querySelector('#passwordEntry').addEventListener('keydown', event => {
  if (event.key === 'Enter') unlockCountdown();
});

titleInput.addEventListener('input', () => document.querySelector('#previewTitle').textContent = titleInput.value.trim() || 'Your Big Day');
eventDateInput.addEventListener('change', updateCountdown);
eventTimeInput.addEventListener('input', updateCountdown);
currentDateInput.addEventListener('change', () => {
  eventDateInput.min = currentDateInput.value;
  const selectedCurrent = parseLocalDate(currentDateInput.value);
  selectedCurrent.setDate(selectedCurrent.getDate() + 1);
  eventDateInput.value = localISO(selectedCurrent);
  updateCountdown();
});

document.querySelector('#createDesign').addEventListener('click', createFromPrompt);
document.querySelector('#countdownForm').addEventListener('submit', event => event.preventDefault());
designPrompt.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') createFromPrompt();
});
document.querySelectorAll('.prompt-examples button').forEach(button => {
  button.addEventListener('click', () => {
    designPrompt.value = button.dataset.prompt;
    createFromPrompt();
  });
});

document.querySelector('#copyButton').addEventListener('click', async () => {
  const text = `${titleInput.value || 'My countdown'} — ${document.querySelector('#days').textContent} days to go! ${document.querySelector('#dateLine').textContent}`;
  try {
    await navigator.clipboard.writeText(text);
    document.querySelector('#shareStatus').textContent = 'Countdown details copied to your clipboard.';
  } catch {
    document.querySelector('#shareStatus').textContent = text;
  }
  setTimeout(() => document.querySelector('#shareStatus').textContent = '', 3500);
});

applyTheme();
renderDecorations();
updateCountdown();
setInterval(updateCountdown, 1000);
