import ky from "ky";

/* 
Response from GET https://cdn.jwplayer.com/v2/media/mJ0z4d0f 
{
    "title": "S3001",
    "description": "",
    "kind": "Single Item",
    "playlist": [
        {
            "title": "S3001",
            "mediaid": "mJ0z4d0f",
            "link": "https://cdn.jwplayer.com/previews/mJ0z4d0f",
            "image": "https://cdn.jwplayer.com/v2/media/mJ0z4d0f/poster.jpg?width=720",
            "images": [
                {
                    "src": "https://cdn.jwplayer.com/v2/media/mJ0z4d0f/poster.jpg?width=320",
                    "width": 320,
                    "type": "image/jpeg"
                },
                {
                    "src": "https://cdn.jwplayer.com/v2/media/mJ0z4d0f/poster.jpg?width=480",
                    "width": 480,
                    "type": "image/jpeg"
                },
                {
                    "src": "https://cdn.jwplayer.com/v2/media/mJ0z4d0f/poster.jpg?width=640",
                    "width": 640,
                    "type": "image/jpeg"
                },
                {
                    "src": "https://cdn.jwplayer.com/v2/media/mJ0z4d0f/poster.jpg?width=720",
                    "width": 720,
                    "type": "image/jpeg"
                },
                {
                    "src": "https://cdn.jwplayer.com/v2/media/mJ0z4d0f/poster.jpg?width=1280",
                    "width": 1280,
                    "type": "image/jpeg"
                },
                {
                    "src": "https://cdn.jwplayer.com/v2/media/mJ0z4d0f/poster.jpg?width=1920",
                    "width": 1920,
                    "type": "image/jpeg"
                }
            ],
            "duration": 2763,
            "pubdate": 1452726389,
            "description": "",
            "sources": [
                {
                    "file": "https://cdn.jwplayer.com/videos/mJ0z4d0f-IzMGdSSs.aac",
                    "label": "Passthrough",
                    "filesize": 22111197
                },
                {
                    "file": "https://cdn.jwplayer.com/videos/mJ0z4d0f-LDq1jMq6.m4a",
                    "type": "audio/mp4",
                    "label": "AAC Audio",
                    "bitrate": 113376,
                    "filesize": 39172600
                }
            ],
            "variations": {}
        }
    ],
    "feed_instance_id": "6aa52090-683b-42fa-a891-33ab3f632a25"
}
 */

export interface MediaItem {
   title: string
   description: string
   kind: string
   playlist: MediaItemPlaylist[]
   feed_instance_id: string
}

export interface MediaItemPlaylist {
   title: string
   mediaid: string
   link: string
   image: string
   images: MediaItemPlaylistImage[]
   duration: number
   pubdate: number
   description: string
   sources: MediaItemPlaylistSource[]
   variations: {}
}

export interface MediaItemPlaylistImage {
   src: string
   width: number
   type: string
}

export interface MediaItemPlaylistSource {
   file: string
   type: string
   label: string
   bitrate?: number
   filesize?: number
}

export function getMediaItem(mediaId: string) { 
   return ky.get(`https://cdn.jwplayer.com/v2/media/${mediaId}`).json<MediaItem>()
}
