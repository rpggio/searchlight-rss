
export const bibleBooks = `
Genesis
Exodus
Leviticus
Numbers
Deuteronomy
Joshua
Judges
Ruth
1 Samuel
2 Samuel
1 Kings
2 Kings
1 Chronicles
2 Chronicles
Ezra
Nehemiah
Esther
Job
Psalms
Proverbs
Ecclesiastes
Song of Solomon
Isaiah
Jeremiah
Lamentations
Ezekiel
Daniel
Hosea
Joel
Amos
Obadiah
Jonah
Micah
Nahum
Habakkuk
Zephaniah
Haggai
Zechariah
Malachi
Matthew
Mark
Luke
John
Acts
Romans
1 Corinthians
2 Corinthians
Galatians
Ephesians
Philippians
Colossians
1 Thessalonians
2 Thessalonians
1 Timothy
2 Timothy
Titus
Philemon
Hebrews
James
1 Peter
2 Peter
1 John
2 John
3 John
Jude
Revelation
`.split('\n').map(s => s.trim()).filter(s => s.length > 0)

export const bookRanges = [
   { from: 'Genesis', to: 'Deuteronomy' },
   { from: 'Joshua', to: 'Esther' },
   { from: 'Job', to: 'Song of Solomon' },
   { from: 'Psalms', to: 'Proverbs' },
   { from: 'Isaiah', to: 'Malachi' },
   { from: 'Matthew', to: 'Acts' },
   { from: 'Romans', to: 'Revelation' }
]
