import { allTeachings } from "../teachingLookup";


const dateRanges = new Map<string, [Date, Date]>();

for (const teaching of allTeachings()) {
   const date = new Date(teaching.date!)
   const rangeEntry = dateRanges.get(teaching.series)
   if (!rangeEntry) {
      dateRanges.set(teaching.series, [date, date])
   } else {
       const [minDate, maxDate] = rangeEntry
       if (date < minDate) {
           dateRanges.set(teaching.series, [date, maxDate])
       } else if (date > maxDate) {
           dateRanges.set(teaching.series, [minDate, date])
       }
   }
}

console.log(dateRanges)
