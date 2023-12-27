import * as fs from 'fs'
import { Teaching, TeachingFeed } from './types';
import { BibleBook, bibleBooks } from './lib/bible';

export type BookRange = { from: BibleBook, to: BibleBook, count?: number }

export const bookRanges: BookRange[] = [
   { "from": "Genesis", "to": "Exodus", "count": 143 },
   { "from": "Leviticus", "to": "Deuteronomy", "count": 94 },
   { "from": "Joshua", "to": "1 Samuel", "count": 85 },
   { "from": "2 Samuel", "to": "2 Chronicles", "count": 84 },
   { "from": "Ezra", "to": "Song of Solomon", "count": 84 },
   { "from": "Isaiah", "to": "Ezekiel", "count": 92 },
   { "from": "Daniel", "to": "Malachi", "count": 65 },
   { "from": "Matthew", "to": "Mark", "count": 90 },
   { "from": "Luke", "to": "John", "count": 109 },
   { "from": "Acts", "to": "Romans", "count": 112 },
   { "from": "1 Corinthians", "to": "Ephesians", "count": 100 },
   { "from": "Philippians", "to": "James", "count": 82 },
   { "from": "1 Peter", "to": "Revelation", "count": 96 }
]

export function saveTeachingFeed(feed: TeachingFeed) {
   if (feed.books.length !== 1) {
      throw new Error('Feed must have exactly one book')
   }
   const book = feed.books[0]
   const bookSlug = bookFileNameSlug(book)
   const json = JSON.stringify(feed, null, 3)
   fs.writeFileSync(`docs/feed/${bookSlug}.json`, json)
}

export function loadTeachingFeed(book: string, dateSort: boolean) {
   const slug = bookFileNameSlug(book)
   const feed = JSON.parse(fs.readFileSync(`docs/feed/${slug}.json`, 'utf8')) as Omit<TeachingFeed, 'books'>;
   if (dateSort){
      sortByDate(feed.teachings)
   }
   return {
      ...feed,
      books: [book],
   } satisfies TeachingFeed
}

export function* allFeeds(dateSort: boolean) {
   for (const book of bibleBooks) {
      yield loadTeachingFeed(book, dateSort)
   }
}

export function* allTeachings(dateSort: boolean): Iterable<Teaching & { book: string }> {
   for (const feed of allFeeds(dateSort)) {
      for (const teaching of feed.teachings) {
         yield {
            ...teaching,
            book: feed.title,
         }
      }
   }
}

export function isEarlySeries(teaching: Teaching) {
   return teaching.series === 'Thru-The-Bible Studies'
   // || (teaching.series === 'Miscellaneous Bible Studies' && new Date(teaching.date) < new Date('2004-12-31'))
}

export function* earlySeriesTeachings() {
   for (const feed of allFeeds(true)) {
      feed.teachings = feed.teachings.filter(isEarlySeries)
      yield feed
   }
}

export function* groupedBookFeeds(filter: (teaching: Teaching) => boolean) {
   for (const range of bookRanges) {
      const fromIdx = bibleBooks.indexOf(range.from)
      const toIdx = bibleBooks.indexOf(range.to)

      if (fromIdx === -1 || toIdx === -1 || fromIdx > toIdx) {
         throw new Error(`Invalid range: ${range.from} ${range.to}`)
      }

      const teachings: Teaching[] = []
      const books = bibleBooks.slice(fromIdx, toIdx + 1)
      for (const book of books) {
         teachings.push(...loadTeachingFeed(book, true).teachings.filter(filter))
      }

      sortByDate(teachings)

      yield {
         title: `${range.from} - ${range.to}`,
         books,
         teachings
      } satisfies TeachingFeed
   }
}

export function sortByDate(teachings: Teaching[]) {
   return teachings.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
   })

}

export function bookRangeFileNameSlug(range: BookRange) {
   return `${bookFileNameSlug(range.from)}-${bookFileNameSlug(range.to)}`
}

export function bookFileNameSlug(book: string) {
   return book.toLowerCase().replace(/ /g, '')
}

export function canonicalTeachingLink(teaching: Teaching){
   return `https://www.joncourson.com/playteaching/${teaching.teachingNumber}`
}
