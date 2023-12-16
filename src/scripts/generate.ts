import * as fs from 'fs';
import { renderIndex } from "../renderIndex";
import { renderFeed } from "../renderFeed";
import { allFeeds, fileNameSlug } from "../teachingLookup";

const feeds = Array.from(allFeeds()).map(feed => {
   feed.teachings = feed.teachings.filter(t =>
      t.series === 'Thru-The-Bible Studies'
      || (t.series === 'Miscellaneous Bible Studies' && new Date(t.date) < new Date('2004-12-31'))
   )
   return feed
})

// rss files

for (const feed of feeds) {
   const slug = fileNameSlug(feed.title)
   const rss = renderFeed(feed);
   fs.writeFileSync(`docs/${slug}.xml`, rss);
}

// index.html

const index = renderIndex()
fs.writeFileSync('docs/index.html', index)
