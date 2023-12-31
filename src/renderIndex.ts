import { bibleBooks } from "./lib/bible";
import { bookFileNameSlug, bookRangeFileNameSlug, bookRanges } from "./teachingData";

export function renderIndex() {
   const renderFeedRow = (slug: string, title: string) => {
      const feedFile = `${slug}.rss`;

      const basePath = 'rpggio.github.io/searchlight-rss';
      const appleLink = `podcast://${basePath}/feed/${feedFile}`;
      const androidLink = `pcast://${basePath}/feed/${feedFile}`;
      const rssLink = `https://${basePath}/feed/${feedFile}`;

      return `       
      <tr>
      <td>${title}</td><td>    
      <td class="feed-link">
         <div class="hstack">
         <a class="button" href="${appleLink}">Apple subscribe</a>
         <a class="button" href="${androidLink}">Android subscribe</a>
         <sl-copy-button alt="copy link" value="${rssLink}"></sl-copy-button>
         </div>
      </td>
      </tr>
      `.trim();
   }

   const groupedBookRows = bookRanges.map(range => {
      const slug = bookRangeFileNameSlug(range)
      return renderFeedRow(slug, `${range.from} - ${range.to}`);      
   })

   const bookRows = bibleBooks.map(book => {
      const slug = bookFileNameSlug(book)
      return renderFeedRow(slug, book);
   })

   return `<html><head>
      <meta name="viewport" content="width=device-width, initial-scale=1">

      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/themes/light.css" />
      <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/shoelace-autoloader.js"></script>

      <style>
      .feed-link {
         margin-left: 1em;
      }
      a {
         color: #1800cd
      }
      body {
         line-height: 1.5;
         background: #fffbf3;
      }
      .hstack { 
         display: flex;
         align-items: center;
         gap: 1em;
      }
      sl-copy-button {
         font-size: 1.5em;
         padding: 0 0 0 6px;
      }
      .books {
         margin-bottom: 2em;
      }

      </style>
   </head>
   <body>
      <h1>Searchlight Thru-the-Bible Podcast Feeds</h1>
      <p>Jon Courson bible studies from Mar 1985 (starting 2 Samuel) to Apr 2002 (ending 1 Samuel). Media provided by <a href="https://www.joncourson.com/">Searchlight</a>.</p>
      <h2>Instructions</h2>
      <p>
         The link for your device (Apple, Android) should automatically open your podcast player and prompt you to add the feed.
         <br>
         If not, click the copy button to copy the link and <a target="_blank" href="https://www.thepitch.show/blog/how-to-manually-add-an-rss-feed-to-your-podcast-app-on-desktop-ios-android/">manually add a subscription to your podcast player.</a>
      </p>

      <h3>Grouped books</h3>
      <div class="books">
       <table>
${groupedBookRows.join('\n')}
       </table>
      </div>

      <h3>Individual books</h3>
      <div class="books">
       <table>
${bookRows.join('\n')}
       </table>
      </div>

      <div class="footer">Podcast media is Copyright Searchlight 2023</div>
   </body>
   </html>`
}