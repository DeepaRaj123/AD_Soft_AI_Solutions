/*
 * Builds the slimmed stylesheets the pages load:
 *   css/core.min.css   <- css/vendors.min.css + css/style.css + css/responsive.css
 *   css/icon.slim.css  <- css/icon.min.css
 * Only rules whose selectors appear in the site's HTML/JS are kept, then the result is minified.
 *
 * Run again after editing style.css, responsive.css or vendors.min.css, or after adding
 * template classes / icons to any page that were not used anywhere before:
 *   npm i --no-save purgecss@6 clean-css@5
 *   node tools/build-css.mjs
 *   python tools/subset-icons.py      (icon fonts -> fonts/subset/, needs: pip install fonttools brotli)
 */
import { PurgeCSS } from 'purgecss';
import CleanCSS from 'clean-css';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = process.env.SITE_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);

const content = [
  '*.html',
  'templates/**/*.html',
  'js/*.js',
  'js/vendors/*.js',
];

// classes added at runtime by plugins with string building the extractor can't see
const safelist = {
  standard: [/^swiper/, /^mfp-/, /^atropos/, /^isotope/, /^is-/, /^has-/, /^show/, /^active/, /^sticky/,
    /^appear/, /^anime/, /^collaps/, /^fade/, /^modal/, /^tooltip/, /^popover/, /^bs-/, /^dropdown/,
    /^navbar/, /^nav-/, /^menu/, /^header-/, /^open/, /^magic-/, /^cursor/, /^splitting/, /^char/, /^word/,
    /^vertical-counter/, /^counter/, /^progress/, /^grid/, /^filter/, /^selected/, /^loading/, /^loaded/,
    /^custom-/, /^form-/, /^was-validated/, /^invalid/, /^valid/, /^parallax/, /^skrollable/, /^text-slider/,
    /^owl-/, /^slick-/, /^tab-/, /^accordion/],
  deep: [/swiper/, /mfp/, /navbar-collapse-show/, /sticky/, /show/, /active/, /appear/],
  greedy: [/swiper/, /mfp/],
};

// source font file name (as referenced in the CSS) -> subset file in fonts/subset/
const subsetFonts = {
  'bootstrap-icons.woff': 'bootstrap-icons.woff2',
  'feather.eot': 'feather.woff2',
  'fa-brands-400.woff2': 'fa-brands-400.woff2',
  'fa-solid-900.woff2': 'fa-solid-900.woff2',
  'fa-regular-400.woff2': 'fa-regular-400.woff2',
  'themify.woff2': 'themify.woff2',
};

// Pages build some icon classes in JS (e.g. `bi-${name}` from ['server', ...]); treat every
// quoted word in the site's own pages/scripts as a possible icon name too.
const ownFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'))
  .concat(fs.readdirSync('js').filter(f => f.endsWith('.js') && !/vendors|jquery/.test(f)).map(f => 'js/' + f));
const words = new Set();
for (const f of ownFiles) {
  for (const m of fs.readFileSync(f, 'utf8').matchAll(/['"`]([a-z][a-z0-9-]{1,40})['"`]/g)) words.add(m[1]);
}
const iconNames = { raw: [...words].map(w => `bi-${w} fa-${w} icon-feather-${w} ti-${w}`).join(' '), extension: 'html' };

const bundles = [
  { out: 'css/core.min.css', src: ['css/vendors.min.css', 'css/style.css', 'css/responsive.css'] },
  { out: 'css/icon.slim.css', src: ['css/icon.min.css'] },
];

for (const b of bundles) {
  const raw = b.src.map(f => fs.readFileSync(f, 'utf8')
    // these sheets point at Google Fonts; the site self-hosts its fonts in css/fonts.css
    .replace(/@import\s+url\([^)]*fonts\.googleapis[^)]*\)\s*;?/g, '')
    // strip source-map comments
    .replace(/\/\*#\s*sourceMappingURL=[^*]*\*\//g, '')).join('\n');
  const [res] = await new PurgeCSS().purge({
    content: [...content, iconNames],
    css: [{ raw }],
    safelist,
    fontFace: false,
    keyframes: false,
    variables: false,
  });
  const min = new CleanCSS({ level: 1, rebase: false }).minify(res.css);
  if (min.errors.length) throw new Error(min.errors.join('\n'));
  let css = min.styles;
  // icon fonts: point every @font-face at the small subset woff2 made by tools/subset-icons.py
  css = css.replace(/@font-face\{[^}]*\}/g, (face) => {
    const sub = Object.entries(subsetFonts).find(([k]) => face.includes(`../fonts/${k}`));
    if (!sub) return face;
    return face.replace(/src:[^;}]*(;src:[^;}]*)?/, `src:url(../fonts/subset/${sub[1]}) format("woff2")`);
  });
  fs.writeFileSync(b.out, css);
  console.log(`${b.out}: ${(raw.length / 1024).toFixed(0)} KB -> ${(min.styles.length / 1024).toFixed(0)} KB`);
}
