import * as fs from 'fs';
import { renderFeed } from "../renderFeed";
import { earlySeriesTeachings, fileNameSlug, groupedBookFeeds } from "../teachingLookup";

for (const feed of earlySeriesTeachings()) {
   const slug = fileNameSlug(feed.title)
   const rss = renderFeed(feed);
   fs.writeFileSync(`docs/${slug}.xml`, rss);
}

for(const feed of groupedBookFeeds()) {
   const slug = feed.title.toLowerCase().replace(/ /g, '')
   const rss = renderFeed(feed);
   fs.writeFileSync(`docs/${slug}.xml`, rss);
}
