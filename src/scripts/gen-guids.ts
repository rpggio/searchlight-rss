import getUuid from 'uuid-by-string'

import { allFeeds, canonicalTeachingLink, saveTeachingFeed } from "../teachingData";

for (const feed of allFeeds(false)) {
    let changed = false
    for (const teaching of feed.teachings) {
        if (!teaching.link || !teaching.guid) {
            teaching.link = canonicalTeachingLink(teaching)
            teaching.guid = getUuid(teaching.link)
            changed = true
        }
    }
    if (changed) {
        saveTeachingFeed(feed)
    }

    break;
}
