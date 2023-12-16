import * as fs from 'fs';
import { renderFeed } from "../renderFeed";
import { earlySeriesTeachings, fileNameSlug } from "../teachingLookup";

for (const feed of earlySeriesTeachings()) {
   const slug = fileNameSlug(feed.title)
   const rss = renderFeed(feed);
   fs.writeFileSync(`docs/${slug}.xml`, rss);
}
