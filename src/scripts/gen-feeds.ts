import * as fs from 'fs';
import { renderFeed } from "../renderFeed";
import { earlySeriesTeachings, bookFileNameSlug, groupedBookFeeds } from "../teachingLookup";

for (const feed of earlySeriesTeachings()) {
   const slug = bookFileNameSlug(feed.title)
   const rss = renderFeed(feed);
   fs.writeFileSync(`docs/feed/${slug}.rss`, rss);
}

for(const feed of groupedBookFeeds()) {
   const slug = feed.title.toLowerCase().replace(/ /g, '')
   const rss = renderFeed(feed);
   fs.writeFileSync(`docs/feed/${slug}.rss`, rss);
}
