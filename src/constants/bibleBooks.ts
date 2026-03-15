export interface BookMeta {
  id: string;          // internal ID
  apiName: string;     // name used in bible-api.com URLs (e.g. "john", "genesis")
  namePt: string;
  nameEn: string;
  chapters: number;
  testament: 'OT' | 'NT';
}

export const BIBLE_BOOKS: BookMeta[] = [
  // ── Old Testament ────────────────────────────────────────────────────────
  { id: 'GEN', apiName: 'genesis',        namePt: 'Gênesis',           nameEn: 'Genesis',          chapters: 50, testament: 'OT' },
  { id: 'EXO', apiName: 'exodus',         namePt: 'Êxodo',             nameEn: 'Exodus',            chapters: 40, testament: 'OT' },
  { id: 'LEV', apiName: 'leviticus',      namePt: 'Levítico',          nameEn: 'Leviticus',         chapters: 27, testament: 'OT' },
  { id: 'NUM', apiName: 'numbers',        namePt: 'Números',           nameEn: 'Numbers',           chapters: 36, testament: 'OT' },
  { id: 'DEU', apiName: 'deuteronomy',    namePt: 'Deuteronômio',      nameEn: 'Deuteronomy',       chapters: 34, testament: 'OT' },
  { id: 'JOS', apiName: 'joshua',         namePt: 'Josué',             nameEn: 'Joshua',            chapters: 24, testament: 'OT' },
  { id: 'JDG', apiName: 'judges',         namePt: 'Juízes',            nameEn: 'Judges',            chapters: 21, testament: 'OT' },
  { id: 'RUT', apiName: 'ruth',           namePt: 'Rute',              nameEn: 'Ruth',              chapters: 4,  testament: 'OT' },
  { id: '1SA', apiName: '1+samuel',       namePt: '1 Samuel',          nameEn: '1 Samuel',          chapters: 31, testament: 'OT' },
  { id: '2SA', apiName: '2+samuel',       namePt: '2 Samuel',          nameEn: '2 Samuel',          chapters: 24, testament: 'OT' },
  { id: '1KI', apiName: '1+kings',        namePt: '1 Reis',            nameEn: '1 Kings',           chapters: 22, testament: 'OT' },
  { id: '2KI', apiName: '2+kings',        namePt: '2 Reis',            nameEn: '2 Kings',           chapters: 25, testament: 'OT' },
  { id: '1CH', apiName: '1+chronicles',   namePt: '1 Crônicas',        nameEn: '1 Chronicles',      chapters: 29, testament: 'OT' },
  { id: '2CH', apiName: '2+chronicles',   namePt: '2 Crônicas',        nameEn: '2 Chronicles',      chapters: 36, testament: 'OT' },
  { id: 'EZR', apiName: 'ezra',           namePt: 'Esdras',            nameEn: 'Ezra',              chapters: 10, testament: 'OT' },
  { id: 'NEH', apiName: 'nehemiah',       namePt: 'Neemias',           nameEn: 'Nehemiah',          chapters: 13, testament: 'OT' },
  { id: 'EST', apiName: 'esther',         namePt: 'Ester',             nameEn: 'Esther',            chapters: 10, testament: 'OT' },
  { id: 'JOB', apiName: 'job',            namePt: 'Jó',                nameEn: 'Job',               chapters: 42, testament: 'OT' },
  { id: 'PSA', apiName: 'psalms',         namePt: 'Salmos',            nameEn: 'Psalms',            chapters: 150, testament: 'OT' },
  { id: 'PRO', apiName: 'proverbs',       namePt: 'Provérbios',        nameEn: 'Proverbs',          chapters: 31, testament: 'OT' },
  { id: 'ECC', apiName: 'ecclesiastes',   namePt: 'Eclesiastes',       nameEn: 'Ecclesiastes',      chapters: 12, testament: 'OT' },
  { id: 'SNG', apiName: 'song+of+solomon',namePt: 'Cânticos',          nameEn: 'Song of Solomon',   chapters: 8,  testament: 'OT' },
  { id: 'ISA', apiName: 'isaiah',         namePt: 'Isaías',            nameEn: 'Isaiah',            chapters: 66, testament: 'OT' },
  { id: 'JER', apiName: 'jeremiah',       namePt: 'Jeremias',          nameEn: 'Jeremiah',          chapters: 52, testament: 'OT' },
  { id: 'LAM', apiName: 'lamentations',   namePt: 'Lamentações',       nameEn: 'Lamentations',      chapters: 5,  testament: 'OT' },
  { id: 'EZK', apiName: 'ezekiel',        namePt: 'Ezequiel',          nameEn: 'Ezekiel',           chapters: 48, testament: 'OT' },
  { id: 'DAN', apiName: 'daniel',         namePt: 'Daniel',            nameEn: 'Daniel',            chapters: 12, testament: 'OT' },
  { id: 'HOS', apiName: 'hosea',          namePt: 'Oséias',            nameEn: 'Hosea',             chapters: 14, testament: 'OT' },
  { id: 'JOL', apiName: 'joel',           namePt: 'Joel',              nameEn: 'Joel',              chapters: 3,  testament: 'OT' },
  { id: 'AMO', apiName: 'amos',           namePt: 'Amós',              nameEn: 'Amos',              chapters: 9,  testament: 'OT' },
  { id: 'OBA', apiName: 'obadiah',        namePt: 'Obadias',           nameEn: 'Obadiah',           chapters: 1,  testament: 'OT' },
  { id: 'JON', apiName: 'jonah',          namePt: 'Jonas',             nameEn: 'Jonah',             chapters: 4,  testament: 'OT' },
  { id: 'MIC', apiName: 'micah',          namePt: 'Miquéias',          nameEn: 'Micah',             chapters: 7,  testament: 'OT' },
  { id: 'NAM', apiName: 'nahum',          namePt: 'Naum',              nameEn: 'Nahum',             chapters: 3,  testament: 'OT' },
  { id: 'HAB', apiName: 'habakkuk',       namePt: 'Habacuque',         nameEn: 'Habakkuk',          chapters: 3,  testament: 'OT' },
  { id: 'ZEP', apiName: 'zephaniah',      namePt: 'Sofonias',          nameEn: 'Zephaniah',         chapters: 3,  testament: 'OT' },
  { id: 'HAG', apiName: 'haggai',         namePt: 'Ageu',              nameEn: 'Haggai',            chapters: 2,  testament: 'OT' },
  { id: 'ZEC', apiName: 'zechariah',      namePt: 'Zacarias',          nameEn: 'Zechariah',         chapters: 14, testament: 'OT' },
  { id: 'MAL', apiName: 'malachi',        namePt: 'Malaquias',         nameEn: 'Malachi',           chapters: 4,  testament: 'OT' },
  // ── New Testament ────────────────────────────────────────────────────────
  { id: 'MAT', apiName: 'matthew',        namePt: 'Mateus',            nameEn: 'Matthew',           chapters: 28, testament: 'NT' },
  { id: 'MRK', apiName: 'mark',           namePt: 'Marcos',            nameEn: 'Mark',              chapters: 16, testament: 'NT' },
  { id: 'LUK', apiName: 'luke',           namePt: 'Lucas',             nameEn: 'Luke',              chapters: 24, testament: 'NT' },
  { id: 'JHN', apiName: 'john',           namePt: 'João',              nameEn: 'John',              chapters: 21, testament: 'NT' },
  { id: 'ACT', apiName: 'acts',           namePt: 'Atos',              nameEn: 'Acts',              chapters: 28, testament: 'NT' },
  { id: 'ROM', apiName: 'romans',         namePt: 'Romanos',           nameEn: 'Romans',            chapters: 16, testament: 'NT' },
  { id: '1CO', apiName: '1+corinthians',  namePt: '1 Coríntios',       nameEn: '1 Corinthians',     chapters: 16, testament: 'NT' },
  { id: '2CO', apiName: '2+corinthians',  namePt: '2 Coríntios',       nameEn: '2 Corinthians',     chapters: 13, testament: 'NT' },
  { id: 'GAL', apiName: 'galatians',      namePt: 'Gálatas',           nameEn: 'Galatians',         chapters: 6,  testament: 'NT' },
  { id: 'EPH', apiName: 'ephesians',      namePt: 'Efésios',           nameEn: 'Ephesians',         chapters: 6,  testament: 'NT' },
  { id: 'PHP', apiName: 'philippians',    namePt: 'Filipenses',        nameEn: 'Philippians',       chapters: 4,  testament: 'NT' },
  { id: 'COL', apiName: 'colossians',     namePt: 'Colossenses',       nameEn: 'Colossians',        chapters: 4,  testament: 'NT' },
  { id: '1TH', apiName: '1+thessalonians',namePt: '1 Tessalonicenses', nameEn: '1 Thessalonians',   chapters: 5,  testament: 'NT' },
  { id: '2TH', apiName: '2+thessalonians',namePt: '2 Tessalonicenses', nameEn: '2 Thessalonians',   chapters: 3,  testament: 'NT' },
  { id: '1TI', apiName: '1+timothy',      namePt: '1 Timóteo',         nameEn: '1 Timothy',         chapters: 6,  testament: 'NT' },
  { id: '2TI', apiName: '2+timothy',      namePt: '2 Timóteo',         nameEn: '2 Timothy',         chapters: 4,  testament: 'NT' },
  { id: 'TIT', apiName: 'titus',          namePt: 'Tito',              nameEn: 'Titus',             chapters: 3,  testament: 'NT' },
  { id: 'PHM', apiName: 'philemon',       namePt: 'Filemom',           nameEn: 'Philemon',          chapters: 1,  testament: 'NT' },
  { id: 'HEB', apiName: 'hebrews',        namePt: 'Hebreus',           nameEn: 'Hebrews',           chapters: 13, testament: 'NT' },
  { id: 'JAS', apiName: 'james',          namePt: 'Tiago',             nameEn: 'James',             chapters: 5,  testament: 'NT' },
  { id: '1PE', apiName: '1+peter',        namePt: '1 Pedro',           nameEn: '1 Peter',           chapters: 5,  testament: 'NT' },
  { id: '2PE', apiName: '2+peter',        namePt: '2 Pedro',           nameEn: '2 Peter',           chapters: 3,  testament: 'NT' },
  { id: '1JN', apiName: '1+john',         namePt: '1 João',            nameEn: '1 John',            chapters: 5,  testament: 'NT' },
  { id: '2JN', apiName: '2+john',         namePt: '2 João',            nameEn: '2 John',            chapters: 1,  testament: 'NT' },
  { id: '3JN', apiName: '3+john',         namePt: '3 João',            nameEn: '3 John',            chapters: 1,  testament: 'NT' },
  { id: 'JUD', apiName: 'jude',           namePt: 'Judas',             nameEn: 'Jude',              chapters: 1,  testament: 'NT' },
  { id: 'REV', apiName: 'revelation',     namePt: 'Apocalipse',        nameEn: 'Revelation',        chapters: 22, testament: 'NT' },
];

export function getBookByApiName(apiName: string): BookMeta | undefined {
  return BIBLE_BOOKS.find((b) => b.apiName === apiName);
}

export function getBookById(id: string): BookMeta | undefined {
  return BIBLE_BOOKS.find((b) => b.id === id);
}
