import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const output = join(root, 'dist');
const failures = [];

const walk = directory => readdirSync(directory).flatMap(name => {
  const path = join(directory, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});

if (!existsSync(output)) failures.push('dist: production output is missing');

if (existsSync(output)) {
  const files = walk(output);
  for (const path of files) {
    const label = relative(output, path);
    const size = statSync(path).size;
    if (size > 800_000) failures.push(`${label}: asset exceeds 800 KB (${size} bytes)`);
    if (!path.endsWith('.html')) continue;
    const html = readFileSync(path, 'utf8');
    if (/http:\/\/localhost|livereload\.js/i.test(html)) failures.push(`${label}: contains development URLs or live reload`);
    if (/googletagmanager|google-analytics|instantsearch|algolia|jquery(?:\.min)?\.js|bootstrap(?:\.min)?\.js|cdn\.jsdelivr|cdnjs\.cloudflare/i.test(html)) failures.push(`${label}: contains a removed third-party dependency`);
    if (/<meta http-equiv=(?:["']?)refresh/i.test(html)) continue;
    if (!/<html lang=(?:["']?)(?:en-US|pt-BR)(?:["']?)[ >]/i.test(html)) failures.push(`${label}: missing supported language tag`);
    if (!/<main id=(?:["']?)main-content(?:["']?)[ >]/i.test(html)) failures.push(`${label}: missing main landmark`);
    if (!/<link rel=(?:["']?)canonical(?:["']?) href=(?:["']?)https:\/\/madpin\.dev\//i.test(html)) failures.push(`${label}: canonical URL is missing or not absolute`);
    if (/<meta property=(?:["']?)og:image(?:["']?) content=(?:["']?)\//i.test(html)) failures.push(`${label}: Open Graph image is relative`);
    if (/<(?:a|link)[^>]+href=(?:["']{2}|\s)|<(?:img|script)[^>]+src=(?:["']{2}|\s)/i.test(html)) failures.push(`${label}: contains an empty URL`);
  }

  const fileSet = new Set(files.map(path => relative(output, path).split('\\').join('/')));
  const localTarget = pathname => {
    const decoded = decodeURIComponent(pathname).replace(/^\/+/, '');
    if (!decoded) return 'index.html';
    const candidates = decoded.endsWith('/')
      ? [`${decoded}index.html`]
      : [decoded, `${decoded}/index.html`, `${decoded}.html`];
    return candidates.find(candidate => fileSet.has(candidate));
  };

  for (const path of files.filter(path => path.endsWith('.html'))) {
    const label = relative(output, path).split('\\').join('/');
    const html = readFileSync(path, 'utf8');
    const values = [...html.matchAll(/(?:href|src)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)].map(match => match[1] ?? match[2] ?? match[3]);
    for (const match of html.matchAll(/srcset=(?:"([^"]*)"|'([^']*)')/gi)) {
      values.push(...(match[1] ?? match[2]).split(',').map(candidate => candidate.trim().split(/\s+/)[0]));
    }
    for (const value of values) {
      if (!value || /^(?:mailto:|tel:|data:|javascript:)/i.test(value)) continue;
      const url = new URL(value, `https://madpin.dev/${label.replace(/index\.html$/, '')}`);
      if (url.hostname !== 'madpin.dev') continue;
      const target = localTarget(url.pathname);
      if (!target) {
        failures.push(`${label}: broken internal URL ${value}`);
        continue;
      }
      if (url.hash && target.endsWith('.html')) {
        const fragment = decodeURIComponent(url.hash.slice(1));
        if (!fragment) continue;
        const targetHTML = readFileSync(join(output, target), 'utf8');
        const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (!new RegExp(`(?:id|name)=(?:["']${escaped}["']|${escaped}(?:\\s|>))`, 'i').test(targetHTML)) failures.push(`${label}: missing fragment ${value}`);
      }
    }
  }

  for (const required of ['_headers', '_redirects', 'robots.txt', 'sitemap.xml', 'index.xml', 'pagefind/pagefind.js']) {
    if (!existsSync(join(output, required))) failures.push(`${required}: required artifact is missing`);
  }

  const headers = readFileSync(join(output, '_headers'), 'utf8');
  for (const header of ['Content-Security-Policy', 'Permissions-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options']) {
    if (!headers.includes(header)) failures.push(`_headers: missing ${header}`);
  }

  const robots = readFileSync(join(output, 'robots.txt'), 'utf8');
  if (!/Sitemap:\s+https:\/\/madpin\.dev\/sitemap\.xml/i.test(robots)) failures.push('robots.txt: absolute sitemap URL is missing');

  for (const feed of ['index.xml', 'pt-br/index.xml']) {
    const path = join(output, feed);
    if (!existsSync(path)) continue;
    const xml = readFileSync(path, 'utf8');
    if (/(\/search\/|\/archive\/|\/about\/|adhd-assessment|acls-notes)/i.test(xml)) failures.push(`${feed}: utility pages leaked into RSS`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Production output contract passed.');
