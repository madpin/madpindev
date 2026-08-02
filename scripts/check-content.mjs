import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const postsRoot = join(root, 'content', 'post');
const failures = [];

const walk = directory => readdirSync(directory).flatMap(name => {
  const path = join(directory, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});

const unquote = value => value.trim().replace(/^['"]|['"]$/g, '');
const directField = (frontmatter, name) => {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'mi'));
  return match ? unquote(match[1]) : '';
};

for (const path of walk(postsRoot).filter(path => /^index(?:\.[a-z-]+)?\.md$/.test(path.split('/').at(-1)))) {
  const label = relative(root, path);
  const source = readFileSync(path, 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    failures.push(`${label}: missing YAML front matter`);
    continue;
  }

  const frontmatter = match[1];
  const body = source.slice(match[0].length);
  for (const field of ['type', 'title', 'description', 'date', 'lastmod', 'draft', 'author', 'image', 'imageAlt', 'categories', 'tags']) {
    if (!new RegExp(`^${field}:`, 'mi').test(frontmatter)) failures.push(`${label}: missing ${field}`);
  }

  if (!/^type:\s*post\s*$/mi.test(frontmatter)) failures.push(`${label}: type must be post`);
  if (!/^draft:\s*(true|false)\s*$/mi.test(frontmatter)) failures.push(`${label}: draft must be explicitly true or false`);
  if (/^URL:/mi.test(frontmatter)) failures.push(`${label}: use central permalinks and aliases instead of URL`);
  if (/^\s*-\s*$/m.test(frontmatter)) failures.push(`${label}: contains an empty list item`);

  const description = directField(frontmatter, 'description');
  if (!description || /^(\/|static\/).+\.(png|jpe?g|gif|webp|svg)$/i.test(description)) failures.push(`${label}: description must be meaningful text`);

  const image = directField(frontmatter, 'image');
  if (image && !/^https?:\/\//.test(image)) {
    const imagePaths = image.startsWith('/')
      ? [join(root, 'static', image)]
      : [join(path, '..', image), join(root, 'assets', image)];
    if (!imagePaths.some(candidate => existsSync(candidate))) failures.push(`${label}: missing image ${image}`);
  }

  let fenced = false;
  for (const [index, line] of body.split(/\r?\n/).entries()) {
    if (/^\s*```/.test(line)) fenced = !fenced;
    if (!fenced && /^#\s/.test(line)) failures.push(`${label}:${index + 1}: body headings must start at H2`);
    if (!fenced && /<(script|style|link|iframe|div)\b/i.test(line)) failures.push(`${label}:${index + 1}: raw HTML is not allowed in posts`);
    if (!fenced && /placeholder|your instagram link here/i.test(line)) failures.push(`${label}:${index + 1}: unresolved placeholder text`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Content contract passed.');
