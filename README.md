# Монорепозиторий Soer Open Source

[![CI](https://github.com/zenby/naris/actions/workflows/test.yml/badge.svg)](https://github.com/zenby/naris/actions/workflows/test.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/78542e1b-51fe-4d2c-a604-a36e75306933/deploy-status)](https://app.netlify.com/sites/lovely-flan-99671a/deploys)

---

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

### Диаграмма проектов

![Visualization of the codebase](./diagram.svg)

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

#### Тестирование тарифов с использование stage серверов

Чтобы тестировать подписки нужно запустить на localhost сборку Naris зайти в "Улучшить тариф" выбрать подписку и нажать оплатить, тебя перекинет на тестовый платежный шлюз.
Тестовая карта "5555 55555 5555 4444" с любой корреткной датой окончания (просто месяц и год в будущем) и любым трехзначным CVC

После этого на 20 минут будет доступ на выбранный тариф.
### Auth

Единый сервис аутентификации и авторизации пользователей. Сервис реализует SSO подход для работы всех сервисов проекта.
Для подготовки  Docker образа с сервисом нужно:
 * открыть терминал в коне проекта
 * запустить скрипт `apps/auth/build.sh`
 * образ готов

`apps/auth/Dockerfile` ожидает, что `apps/auth` будет собран командой `npx build auth` в папку `dist/apps/auth`.



### Auth CDN

CDN с проверкой прав на доступ к контенту

### Naris API

Сервис реализации REST API для задач Naris

### Payment

Платежный сервис. В рамках репозитория реализует только интерфейс.



