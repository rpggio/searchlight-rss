import { bibleBooks } from "../lib/bible";
import { allTeachings, groupedBookFeeds, isEarlySeries } from "../teachingLookup";

const datesByBook = new Map<string, string[]>(bibleBooks.map(book => [book, []]))
const datesBySeries = new Map<string, [Date, Date]>();

const teachings = Array.from(allTeachings()).filter(isEarlySeries)
for (const teaching of teachings) {
    const date = new Date(teaching.date!)

    datesByBook.get(teaching.book)?.push(date.toISOString().substring(0, 10))

    const groupEntry = datesBySeries.get(teaching.series)
    if (!groupEntry) {
        datesBySeries.set(teaching.series, [date, date])
    } else {
        const [minDate, maxDate] = groupEntry
        if (date < minDate) {
            datesBySeries.set(teaching.series, [date, maxDate])
        } else if (date > maxDate) {
            datesBySeries.set(teaching.series, [minDate, date])
        }
    }
}
for (const dateArray of datesBySeries.entries()) {
    dateArray.sort()
}

console.log(datesBySeries)
console.log(datesByBook)

const groups = groupedBookFeeds(isEarlySeries)
const teachingCountsByGroup = Array.from(groups).map(group => [group.title, group.teachings.length])
console.log(teachingCountsByGroup)

// teaching counts by book
console.log(Array.from(datesByBook.entries()).map(items => [items[0], items[1].length]))
