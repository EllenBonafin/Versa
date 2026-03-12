import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import type { DailyVerse } from '../types/bible';

const STORAGE_KEY_DAILY_VERSE = 'versa_daily_verse';
const STORAGE_KEY_GOSPEL = 'versa_daily_gospel';

// ─── Curated verse pool (fallback / seed data) ────────────────────────────────

const VERSE_POOL: DailyVerse[] = [
  {
    reference: 'João 3:16',
    text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
    textEn: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    referenceEn: 'John 3:16',
    date: '',
  },
  {
    reference: 'Salmos 23:1',
    text: 'O Senhor é o meu pastor; nada me faltará.',
    textEn: 'The Lord is my shepherd, I lack nothing.',
    referenceEn: 'Psalm 23:1',
    date: '',
  },
  {
    reference: 'Filipenses 4:13',
    text: 'Tudo posso naquele que me fortalece.',
    textEn: 'I can do all this through him who gives me strength.',
    referenceEn: 'Philippians 4:13',
    date: '',
  },
  {
    reference: 'Jeremias 29:11',
    text: 'Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro.',
    textEn: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    referenceEn: 'Jeremiah 29:11',
    date: '',
  },
  {
    reference: 'Provérbios 3:5-6',
    text: 'Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento; reconheça o Senhor em todos os seus caminhos, e ele endireitará as suas veredas.',
    textEn: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    referenceEn: 'Proverbs 3:5-6',
    date: '',
  },
  {
    reference: 'Romanos 8:28',
    text: 'Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.',
    textEn: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    referenceEn: 'Romans 8:28',
    date: '',
  },
  {
    reference: 'Isaías 41:10',
    text: 'Não tema, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a minha destra fiel.',
    textEn: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',
    referenceEn: 'Isaiah 41:10',
    date: '',
  },
  {
    reference: 'Mateus 5:8',
    text: 'Bem-aventurados os puros de coração, pois eles verão a Deus.',
    textEn: 'Blessed are the pure in heart, for they will see God.',
    referenceEn: 'Matthew 5:8',
    date: '',
  },
  {
    reference: 'Salmos 46:1',
    text: 'Deus é o nosso refúgio e a nossa força, socorro bem presente na angústia.',
    textEn: 'God is our refuge and strength, an ever-present help in trouble.',
    referenceEn: 'Psalm 46:1',
    date: '',
  },
  {
    reference: '1 Coríntios 13:13',
    text: 'Agora, pois, permanecem a fé, a esperança e o amor, esses três; mas o maior destes é o amor.',
    textEn: 'And now these three remain: faith, hope and love. But the greatest of these is love.',
    referenceEn: '1 Corinthians 13:13',
    date: '',
  },
];

// Picks a verse deterministically based on the day of year
function getDailyVerseFromPool(dateStr: string): DailyVerse {
  const date = new Date(dateStr);
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % VERSE_POOL.length;
  return { ...VERSE_POOL[index], date: dateStr };
}

// ─── Gospel seed data ─────────────────────────────────────────────────────────

const GOSPEL_POOL = [
  {
    reference: 'Marcos 1:14-15',
    referenceEn: 'Mark 1:14-15',
    text: 'Depois que João foi preso, Jesus foi para a Galileia, pregando o evangelho de Deus: "O tempo está cumprido, e o reino de Deus está próximo. Arrependam-se e creiam no evangelho!"',
    textEn: 'After John was put in prison, Jesus went into Galilee, proclaiming the good news of God. "The time has come," he said. "The kingdom of God has come near. Repent and believe the good news!"',
    reflection: 'O chamado ao arrependimento é um convite à transformação. Cada dia é uma nova oportunidade de aproximar-se de Deus.',
    reflectionEn: 'The call to repentance is an invitation to transformation. Each day is a new opportunity to draw closer to God.',
    date: '',
  },
  {
    reference: 'João 15:9-12',
    referenceEn: 'John 15:9-12',
    text: 'Como o Pai me amou, também eu os amei; permaneçam no meu amor. Se obedecerem aos meus mandamentos, permanecerão no meu amor, assim como eu tenho obedecido aos mandamentos do meu Pai e permaneço no seu amor. Digo-lhes isso para que a minha alegria esteja em vocês e a alegria de vocês seja completa. O meu mandamento é este: amem-se uns aos outros como eu os amei.',
    textEn: 'As the Father has loved me, so have I loved you. Now remain in my love. If you keep my commands, you will remain in my love, just as I have kept my Father\'s commands and remain in his love. I have told you this so that my joy may be in you and that your joy may be complete. My command is this: Love each other as I have loved you.',
    reflection: 'O amor é o centro da mensagem cristã. Permanecer no amor de Cristo é permanecer em Deus.',
    reflectionEn: 'Love is at the center of the Christian message. To remain in Christ\'s love is to remain in God.',
    date: '',
  },
  {
    reference: 'Mateus 6:25-34',
    referenceEn: 'Matthew 6:25-34',
    text: 'Por isso eu lhes digo: não se preocupem com a sua vida, quanto ao que comer ou beber; nem com o seu corpo, quanto ao que vestir. Não é a vida mais importante que a comida e o corpo mais importante que as roupas?',
    textEn: 'Therefore I tell you, do not worry about your life, what you will eat or drink; or about your body, what you will wear. Is not life more than food, and the body more than clothes?',
    reflection: 'A confiança em Deus nos liberta da ansiedade. Ele conhece as nossas necessidades antes mesmo de as expressarmos.',
    reflectionEn: 'Trust in God frees us from anxiety. He knows our needs even before we express them.',
    date: '',
  },
];

function getDailyGospelFromPool(dateStr: string) {
  const date = new Date(dateStr);
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const index = dayOfYear % GOSPEL_POOL.length;
  return { ...GOSPEL_POOL[index], date: dateStr };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getDailyVerse(): Promise<DailyVerse> {
  const today = format(new Date(), 'yyyy-MM-dd');

  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY_DAILY_VERSE);
    if (stored) {
      const verse: DailyVerse = JSON.parse(stored);
      if (verse.date === today) return verse;
    }
  } catch {
    // fall through to generate new
  }

  const verse = getDailyVerseFromPool(today);
  await AsyncStorage.setItem(STORAGE_KEY_DAILY_VERSE, JSON.stringify(verse));
  return verse;
}

export async function getDailyGospel() {
  const today = format(new Date(), 'yyyy-MM-dd');

  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY_GOSPEL);
    if (stored) {
      const gospel = JSON.parse(stored);
      if (gospel.date === today) return gospel;
    }
  } catch {
    // fall through
  }

  const gospel = getDailyGospelFromPool(today);
  await AsyncStorage.setItem(STORAGE_KEY_GOSPEL, JSON.stringify(gospel));
  return gospel;
}
