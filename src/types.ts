import { MediaItem, MediaItemPlaylistSource } from "./lib/jwPlayerApi/getMediaItem";

export const teachingCsvColumns = [
  'date',
  'title',
  'passage',
  'event',
  'teachingNumber',
  'mediaURL',
];

export interface TeachingFeed {
  title: string,
  books: string[],
  teachings: Teaching[]
}

export interface TeachingMedia {
  link: string
  duration: number
  pubdate: number
  source: MediaItemPlaylistSource | undefined
}

export interface Teaching {
  series: string;
  date: string;
  title?: string;
  passage?: string;
  event?: string;
  teachingNumber: string;
  media?: TeachingMedia;
}
