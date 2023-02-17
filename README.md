# Монорепозиторий Soer Open Source

Репозиторий создан для организации совместной разработки участников проекта soer.pro

### Install

```
git clone ssh://git@gitlog.ru:2222/Naris/soermono.git
cd soermono
nvm use
npm install
npx nx serve naris
```

Важно! В Windows nvm нужно указать конкретную версию, ее можно посмотреть в файле .nvmrc

### Login

- Открыть браузер http://localhost:4200
- Выбрать один из доступных методов авторизации

### Storybook

Все визуальные компоненты собраны в Storybook, для его запуска:

- Выполнить `npm run storybook:serve`
- Открыть браузер http://localhost:4400

## Проекты

### Naris

Naris - это платформа для саморазвития, которая включает в себя следующие возможности:

- Раздельный доступ к материалам на основе ролей;
- Брифинг текущих задач;
- Постановка целей;
- Публикация заметок;
- Секция "Вопрос/ответ";
- Видео-материалы;
- Архив материалов для скачивания.

В проекте используется сервисная архетектура, поэтому бэкенд разделен на несколько независимых сервисов.

### Auth

Единый сервис аутентификации и авторизации пользователей. Сервис реализует SSO подход для работы всех сервисов проекта.

### Auth CDN

CDN с проверкой прав на доступ к контенту

### Naris API

Сервис реализации REST API для задач Naris

### Payment

Платежный сервис. В рамках репозитория реализует только интерфейс.



