
export const teachingCsvColumns = [
  'date',
  'title',
  'passage',
  'event',
  'teachingNumber',
  'mediaURL',
];

export interface Teaching {
  date: string;
  title?: string;
  passage?: string;
  event?: string;
  teachingNumber: string;
  mediaURL?: string;
}
