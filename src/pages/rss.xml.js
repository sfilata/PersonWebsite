import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function get() {
  return rss({
    title: 'Fish-Father | Blog',
    description: 'My Unique Blog Garden',
    site: 'https://tranquil-mousse-25e3b1.netlify.app/',
    items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),
    customData: `<language>en-us</language>`
  });
}
