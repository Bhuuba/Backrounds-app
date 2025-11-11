# Backgrounds Ops Platform

Каркас багатомодульної платформи на Next.js (App Router) для двох ключових сценаріїв:

1. **Автоматизоване дослідження** — запуск запитів, збір та узагальнення джерел, редагування Markdown-звіту.
2. **Автона різка відео** — завантаження з tus/resumable, автосегментація, ручне редагування таймлайну та експорт.

## Технічний стек

- [Next.js 14 (App Router)](https://nextjs.org/) + TypeScript
- Tailwind CSS + shadcn/ui компоненти
- React Query для data fetching та полінгу
- Zustand для стану відеоредактора
- NextAuth (OAuth/Credentials) для подальшої інтеграції авторизації
- tus-js-client + HTML5 video, (опц.) @ffmpeg/ffmpeg для подальшого превʼю
- Sentry (клієнт/сервер) та подієва аналітика-хелпер `trackEvent`

## Старт проєкту локально

```bash
npm install
npm run dev
```

Середовище розгортається на `http://localhost:3000`. У репозиторії доступні мок-ендпоїнти (`/api/research/*`, `/api/video/*`), які імітують бекенд: прогрес, результати, експорт, збереження звітів та сегментів.

### Обовʼязкові ENV

Створіть файл `.env.local` (або скористайтесь `.env.example`):

```bash
NEXTAUTH_SECRET="change-me"
GITHUB_ID=""
GITHUB_SECRET=""
SENTRY_DSN=""
NEXT_PUBLIC_SENTRY_DSN=""
```

> За відсутності OAuth-пари NextAuth автоматично переключається на Credentials-провайдера, що дозволяє тестувати логін через будь-який email.

## Скрипти npm

| Команда             | Опис                                          |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Дев-сервер Next.js                            |
| `npm run build`     | Продакшн-білд                                 |
| `npm run start`     | Запуск продакшн-сервера                       |
| `npm run lint`      | ESLint (Next core-web-vitals)                 |
| `npm run test`      | Юніт-тести (Vitest, наразі заглушка)          |
| `npm run test:e2e`  | Playwright e2e (додайте `@playwright/test` перед запуском)|

## Структура

```
app/
  layout.tsx           — глобальний layout + провайдери (React Query, Theme, Session)
  page.tsx             — лендинг з навігацією по модулях
  (dashboard)/         — приватні сторінки модулів (research, video)
  api/                 — мок-ендпоїнти для обох пайплайнів та NextAuth
components/
  ui/                  — shadcn/ui компоненти (button, table, dialog тощо)
  research/            — CriteriaList, JobProgress, FindingsTable, MarkdownEditor, ExportButtons
  video/               — UploadArea, Timeline, SegmentsList, ExportModal, JobStatus, VideoPlayer
lib/
  api.ts               — клієнтські SDK для запитів
  analytics.ts         — подієва аналітика (розширюйте інтеграцію)
  mock-db.ts           — in-memory storage для моків
  sentry/              — ініціалізація Sentry
providers/             — обʼєднаний React Query + Theme + Session провайдер
stores/                — Zustand стор для сегментів відео
```

## Функціональний огляд

### Research модуль
- `/research/new` — форма запиту (textarea, editable list, сутності, мова, режим).
- `/research/runs` — таблиця запусків (id, тема, статус, дата).
- `/research/run/[id]` — live прогрес (stepper, лог), вкладки Findings/Report, markdown-редактор, експорти MD/PDF (моки), кнопка Regenerate (плейсхолдер).

### Video модуль
- `/video/new` — завантаження через tus/resumable, drag&drop, перевірка розміру, прогрес.
- `/video/projects` — список задач з статусами.
- `/video/project/[id]` — таймлайн з сегментами (split/merge/delete), праворуч список сегментів, експорти JSON/SRT/EDL/Clips (моки), кнопка Request render (плейсхолдер).

## Тести та якість

- Юніт-тести: `vitest` (додайте покриття для утиліт та сторів).
- Інтеграційні: рекомендується `@testing-library/react` для форм/полінгу.
- E2E: каркас Playwright (`npm run test:e2e`).
- Лінтинг: `npm run lint`.
- Lighthouse: ціль ≥ 90 (адаптивні макети, ARIA, фокус-стейти вже налаштовані).

## Деплой

Готовий до розгортання на Vercel/Netlify (Next.js 14). Моки працюють і в serverless-середовищі завдяки in-memory стораже; при інтеграції з реальним бекендом замініть `/api/*` ендпоїнти на виклики до BFF/Edge-функцій.

## Дорожня карта

1. **Етап 0 (готово)** — базовий каркас, UI, провайдери, авторизація, мок-API.
2. **Етап 1** — розширення Research: AI-збагачення, секційне регенерування, колаборація.
3. **Етап 2** — покращення Video: превʼю кліпів через ffmpeg.wasm, ручні маркери, гарячі клавіші.
4. **Етап 3** — полірування: i18n, аналітика, CI (lint/type/test), реальні інтеграції.

## License

MIT — використовуйте як основу для подальшої розробки.
