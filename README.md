# Versa — Bíblia Minimalista

> Uma experiência bíblica limpa, elegante e bilíngue (PT / EN).

---

## Identidade Visual

| Token | Valor |
|---|---|
| Fundo | `#FAFAF8` |
| Texto | `#1A1A1A` |
| Dourado | `#C9A96E` |
| Tipografia títulos | Playfair Display |
| Tipografia corpo | Lora |

---

## Stack

| Camada | Tecnologia |
|---|---|
| Mobile | React Native + Expo (SDK 55) + TypeScript |
| Estilo | NativeWind 4 (Tailwind CSS para RN) |
| Fontes | @expo-google-fonts/playfair-display + lora |
| Armazenamento | AsyncStorage + Expo SQLite |
| Widget | Expo Widgets (WidgetKit / Glance) |
| Notificações | Expo Notifications |
| Bíblia | API.Bible (gratuita) |
| Navegação | React Navigation v7 |
| i18n | i18n-js |
| Testes | Jest + jest-expo + Testing Library |

---

## Funcionalidades

- **Bíblia completa** — navegação por livro → capítulo → versículo, busca por palavra-chave
- **Palavra do Dia** — versículo diário com modo bilíngue PT/EN e compartilhamento como imagem
- **Evangelho do Dia** — trecho litúrgico diário com reflexão bilíngue
- **Favoritos** — salvos localmente via AsyncStorage
- **Widget** — pequeno (só versículo) e médio (versículo + botão abrir)
- **Notificação diária** — horário configurável, preview da palavra do dia
- **Modo leitura** — ajuste de tamanho de fonte (Pequeno / Médio / Grande)
- **Alternância PT/EN** em tempo real em todas as telas

---

## Estrutura de Pastas

```
versa/
├── App.tsx                    # Entry point, navegação, fontes
├── global.css                 # Tailwind directives (NativeWind)
├── tailwind.config.js
├── metro.config.js
├── babel.config.js
└── src/
    ├── screens/
    │   ├── Home.tsx           # Palavra do dia + Evangelho + atalhos
    │   ├── Bible.tsx          # Livro → Capítulo → Versículos + busca
    │   ├── DailyVerse.tsx     # Versículo do dia expandido + bilíngue
    │   ├── Gospel.tsx         # Evangelho + reflexão
    │   ├── Favorites.tsx      # Versículos favoritos
    │   └── Settings.tsx       # Idioma, versão, fonte, notificações
    ├── components/
    │   ├── VerseCard.tsx      # Card reutilizável de versículo
    │   ├── DayWidget.tsx      # Card diário para a Home
    │   ├── LanguageToggle.tsx # Toggle PT / EN
    │   └── ShareCard.tsx      # Card para captura e compartilhamento
    ├── hooks/
    │   ├── useBible.ts        # Estado e chamadas da API.Bible
    │   ├── useDailyVerse.ts   # Versículo + Evangelho do dia
    │   ├── useLanguage.ts     # i18n + persistência do idioma
    │   └── useFavorites.ts    # CRUD de favoritos local
    ├── services/
    │   ├── bibleApi.ts        # Cliente API.Bible com cache
    │   ├── dailyContent.ts    # Pool de versículos/evangelhos diários
    │   └── notifications.ts   # Expo Notifications helpers
    ├── i18n/
    │   ├── index.ts           # Configuração i18n-js
    │   ├── pt.ts              # Strings em Português
    │   └── en.ts              # Strings em English
    ├── widgets/
    │   ├── SmallWidget.tsx    # Widget pequeno (preview)
    │   └── MediumWidget.tsx   # Widget médio (preview)
    ├── constants/
    │   └── theme.ts           # Cores, fontes, espaçamentos
    └── types/
        └── bible.ts           # Interfaces TypeScript
```

---

## Configuração e Execução

### 1. Pré-requisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Conta gratuita em [API.Bible](https://scripture.api.bible) para obter a API key

### 2. Instalar dependências

```bash
cd versa
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_BIBLE_API_KEY=sua_chave_aqui
```

> As versões da Bíblia (NVI, ARC, NIV, ESV) precisam ser encontradas no painel da API.Bible.
> Atualize os IDs em `src/services/bibleApi.ts` → `BIBLE_VERSIONS`.

### 4. Rodar o projeto

```bash
# iOS (requer macOS + Xcode)
npm run ios

# Android
npm run android

# Web (preview)
npm run web

# Expo Go (scan QR)
npx expo start
```

### 5. Rodar os testes

```bash
npm test
```

---

## Prints (Placeholder)

| Home | Bíblia | Palavra do Dia |
|---|---|---|
| `[screenshot-home]` | `[screenshot-bible]` | `[screenshot-daily]` |

| Evangelho | Favoritos | Configurações |
|---|---|---|
| `[screenshot-gospel]` | `[screenshot-favorites]` | `[screenshot-settings]` |

---

## Roadmap

- [ ] Integração real com API.Bible (confirmar IDs das versões NVI/ARC)
- [ ] Widget nativo iOS (WidgetKit via expo-config-plugin)
- [ ] Widget nativo Android (Glance)
- [ ] Compartilhar versículo como imagem (react-native-view-shot)
- [ ] Offline-first com Expo SQLite
- [ ] Modo escuro
- [ ] Planos de leitura

---

## Créditos

- Bíblia API: [API.Bible](https://scripture.api.bible)
- Fontes: [Google Fonts](https://fonts.google.com)
- Inspiração de design: Calm, Notion, Day One

---

*Versa — feito com ♡ e Palavra.*
