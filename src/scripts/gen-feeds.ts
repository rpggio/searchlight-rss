import * as fs from 'fs';
import { renderFeed } from "../renderFeed";
import { earlySeriesTeachings, bookFileNameSlug, groupedBookFeeds, isEarlySeries } from "../teachingData";

for (const feed of earlySeriesTeachings()) {
   const slug = bookFileNameSlug(feed.title)
   const rss = renderFeed(feed);
   fs.writeFileSync(`docs/feed/${slug}.rss`, rss);
}

for(const feed of groupedBookFeeds(isEarlySeries)) {
   const slug = feed.title.toLowerCase().replace(/ /g, '')
   const rss = renderFeed(feed);
   fs.writeFileSync(`docs/feed/${slug}.rss`, rss);
}
