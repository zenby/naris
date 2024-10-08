# Содержание

[Постановка задачи](#постановка-задачи)

[Общий порядок внесения изменений в проект](#общий-порядок-внесения-изменений-в-проект)

[Принципы разработки](#принципы-разработки)

[Полезные ссылки](#полезные-ссылки)
# Постановка задачи

Работа над проектом осуществляется только на основе задач. Первым делом, до написания кода, необходимо:

- Выбрать задачу из списка и назначить себя исполнителем 
- Задать уточняющие вопросы (опционально, если уверены что правильно понимаете задачу, можно не делать)
- Если задача подразумевает создание или изменение существующих фич, то в комментариях к задаче обязательно описать предполагаемое решение (кратко). 
- Если предполагаемое решение получило подтверждение (палец вверх), то можно приступать к выполнению задачи - написанию кода
- Если к описанию есть замечания,то в первую очередь нужно скорректировать решение, до тех пор пока не будет получен подтвержение



# Общий порядок внесения изменений в проект

Изменения в проект публикуются под MIT лицензией, желательно в первую очередь выполнять изменения относящиеся к Задачам проекта. Для правильного оформления запросов на изменение требуется выполнить следующий порядок действий:

- Изменения в проект делаются в виде отдельных веток, по принципу "одно изменение - одна ветка - одна задача"
- Именование веток делается в соответствии с разделом "Ветвление"
- Публикация изменений делается с помощью "Запросов на слияние" (Pull Request)
- Перед публикацией нужно убедиться что выполнены следующие требования:
  - все тесты проекта проходят успешно;
  - изменения оформлены в соответствии с CodeStyle
  - все коммиты названы в соответствии c Conventional Commits
  - запущен Prettier для унификации оформления исходных кодов
- Каждый раз, когда вы поработали надо кодом проекта, нужно заканчивать работу пушем изменений на сайт проекта.
- Пока вы работаете над PR он должен иметь статус WIP 
- Как только вы считаете, работа закончена, статус WIP должен быть снят 
- Снимать статус WIP может только тот кто делает изменения (Pull Request)
- PR должен быть готов к слиянию, конфликты должны устраняться автором PR

Примечание. Важно обратить внимание что работа над проектом идет маленькими шагами и все изменения в конце дня должны быть опубликованы, это попадает в "Активность" и необходимо для участия в проекте. Отсутствие публикаций означает отсутствие активности.

## Порядок устранения замечаний

После публикации PR он проходит ревью. Участвовать в ревью может каждый желающий, при наличии замечений ревьюер открывет обсуждения, которые должны быть решены автором ПР, при этом порядок следующий:

- если автор ПР *несогласен* (или непонятно что делать и нужно задать вопрос) с замечанием ревьюера, то указать в ответном комментарии причину несогласия (или уточняющий вопрос)
- если автор ПР *согласен* с замечанием, то он должен его устранить и после устрания нажать кнопку "Покинуть диалог" под замечанием (тогда комментарий помечается как звершенный)
- на время устранения замечаний ставится статус WIP
- когда все замечания закрыты и остались только вопросы, которые нужно обсудить (см. п.1), автор ПР убирает статус WIP
- повторному ревью подлежат только ПР без статуса WIP (если на PR стоит WIP значит вы хотите внести правки в код, если не стоит, значи вы хотите обсудить вопросы или получить ревью)
- если ревьюер согласен с причиной отказа выполнять замечание. то он закрывает диалог кнопкой "Покинуть диалог", если нет, то пишет замечания и переводит запрос в статус WIP.

Важно! В основную ветку мерджатся только запросы, которые не находятся в статусе WIP и все обсуждения закрыты. Статус WIP может ставится и убираться сколько угодно раз, он служет только указателем на то, что автор ПР либо работает над запросом, либо хочет чтобы сделали ревью его решений. 

## Ветвление

Что касается ветвления, придерживаемся подхода GitHub Flow. Прочитать можно на [SOER Media](https://s0er.ru/documents/workbook/3185) и [habr](https://habr.com/ru/post/346066/).

Названия для веток даем по шаблону:

> refactor/[что затронули]/[номер задачи]

Например:

> test/[auth-service]/#108  
> refactor/[auth-controller]/#109

## Conventional commits

Коммиты делаем малыми шагами, используя Conventional Commits.
Язык для комментариев En или Ru.
Следуем данному шаблону:

> \<type>[optional scope]: \<description>  
>  [optional body]  
>  [optional footer(s)]

### type

Для автоматизированной обработки важно чтобы типы были стандартизированы, их можно расширять, но базовый набор содержит следующие: feat:, fix:, build:, chore:, ci:, docs:, style:, refactor:, perf:, test:;

_feat_ - добавление новой функциональности  
_fix_ - исправление ошибки  
_build_ - изменения, затрагивающие процесс сборки приложения (например, _добавление_ зависимости в package.json).  
_ci_ - изменения, затрагивающие CI процессы  
_docs_ - изменения в документации, не затрагивающие работу кода  
_style_ - изменение в форматировании кода, не затрагивающие его реализацию (например переименование переменных)  
_refactor_ - изменение в реализации кода  
_perf_ - изменения, повышающие производительность кода (например, оптимизация работы алгоритма)  
_test_ - изменения затрагивающие тесты и не влияющие на функциональность  
_chore_ - изменение, не подпадающее под перечисленные категории

### description

Хочу особо подчеркнуть одно важное правило: хорошее примечание к коммиту должно заканчивать следующее предложение:
«После применения данного коммита будет {{ текст вашего примечания }}». При этом первая часть фразы в коммите не пишется, она произносится в уме.

Например:

> После применения данного коммита будет _обновлен файл readme_  
> После применения данного коммита будет _добавлена валидация вызова GET /user/:id API_  
> После применения данного коммита будет _отменен коммит 12345_

Или

«If applied, this commit will {{ your subject line here }}»

Например:

> If applied, this commit will _refactor subsystem X for readability_  
> If applied, this commit will _update getting started documentation_  
> If applied, this commit will _remove deprecated methods_

Примеры коммитов:

> _fix: move json module to modules_ - «If applied, this commit will Move json module to modules»
>
> _feat: добавлен сервис для конвертации md в pdf_ - «После применения данного коммита будет Добавлен сервис для конвертации md в pdf»

## План коммитов для фронтенд

При добавлении новой фичи, план коммитов такой:

1. Сначала делаем "простые" компоненты, которые зависят от входных параметров и содержат верстку, вносим их в сторибук;
2. Делаем коммит `feat: create [...]`;
3. Делаем глобальные типы и DTO (libs/sr-dto), если типы уже есть пропускаем п.п. 3 и 4;
4. Делаем коммит с `feat: create DTO/Interface [...]` ;
5. Делаем Page модуль, куда включаем Page компонент и сервис работы с данными
6. Делаем коммит `feat: create page [...]`
7. Вносим исправления в меню и дефолтные страницы
8. Делаем коммит `feat: modify default [...]`

## Политика слияния [Semi-linear merge](https://devblogs.microsoft.com/devops/pull-requests-with-rebase/)

![semi linear](https://devblogs.microsoft.com/devops/wp-content/uploads/sites/6/2019/04/semilinear-1.gif)

Эта стратегия представляет собой смесь rebase и merge.

1. Сначала коммиты в PR ребейзятся поверх основной ветки.
2. Затем происходит слияние с основной веткой с созданием мерж реквеста. Это эмулирует выполнение `git rebase master` на ветке pull request, а затем `git merge pr --no-ff` на ветке master.

Сочетает в себе лучшие из двух миров: отдельные коммиты сохраняются, чтобы мы могли видеть, как равивалась работа, но вместо простого ребейза у нас создается мерж коммит, чтобы мы могли увидеть начало и конец работы в каждом PR.

## Code Style

Соглашение о стиле кода контролируется с помощью линтера. Нужно устранять не только ошибки, но и предупреждения.

В проекте используется принцип "пионера", который гласит, что после себя пионер оставляет более чистое место, чем было до него. Это значит, что если ошибки и предупрждения относятся не к вашему коду,
то их тоже можно устранять по мере сил и возможностей. Чем чище проект - тем проще его сопровождать.

Для запуска линтера используется команда

```
npm run lint
```

## Форматирование кода

Для проекта настроен [конфиг](./.prettierrc) для форматирования согласно [prettier](https://prettier.io/). Для повышения удобства разработки желательно поставить соответствующий плагин в вашу IDE (например, для [vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)). Также в проекте установлены прекоммит хуки на форматирование кода. Поэтому если этот плагин все-таки не установлен, во время коммита все изменения в коде все равно будут отформатированы автоматически.

В случае ручного запуска команд для форматирования:

- Для форматирования всего проекта нужно использовать следующую команду:

```
npm run format
```

- Для форматирования конретного файла, например `mobile-menu.component.ts`, используем команду:

```
npx prettier --write **/mobile-menu.component.ts
```

Для более сложных настроек форматирования нескольких файлов или по указанным папкам стоит почитать [здесь](https://prettier.io/docs/en/cli.html#file-patterns)

## Тестирование

### Запуск тестов

Запуск тестов должен выполняться перед публикацией Pull Request. Если тесты не прошли, то публикация PR допускается только с префиксом WIP в названии, и указание в описании того, что тесты не прошли.

Запуск всех тестов во всех проектах:

```
npm run test
```

Запуск тестов по конкретному проекту

```
npx nx run test [имя проекта]
```

Основная цель создания автоматических тестов в проекте Naris - это поиск регрессий. Регрессия - это появление ошибки в работе некоторого участка кода, которое не связано с непосредственным изменением этого участка кода, а возникло вследствие изменения одной из его зависимостей (используемой библиотеки или других модулей).
Завершив работу над задачей (добавление функционала, рефакторинг, багфикс и т.д.), и подготовив ветку к созданию Pull Request, не забудьте запустить тесты и проверить, что произведенные изменения не привели к возникновению ошибок в других частях проекта.

### Формат написания тестов

При написании тестов группируйте тестовые блоки согласно тестируемой функциональности (названия тестируемого класса, компонента, модуля или маршрута API) с помощью блока _describe_. Все описания тестов должны быть написаны в декларативном стиле на бизнес-языке и должно состоять из трех частей:

1. Описание того, что именно тестируется (например, UserService)
2. Что ожидается в результате (should return UnauthorizedException)
3. При каких обстоятельствах (when passed password don't match exist hash)
Если при определенном условии (when), может быть несколько ожидаемых утверждений (should), то лучше поменять 2 и 3 пункты местами и сгруппировать их по условию (when) для повышения читаемости.
<details>
<summary> :pencil2: Пример кода</summary>

#### :thumbsup: Такой тест читается очень хорошо.

```js
describe('Auth e2e-test', () => {
  describe('POST /auth/signin', () => {
    it.todo('should signin user when pass valid credentials');
    it.todo('should return error when pass invalid credentials');
  });

  describe('POST /auth/signup', () => {
    it.todo('should create user when pass valid data');
    it.todo('should return error when pass invalid data ');
  });
});
```

#### :clap: Отлично! Тесты сгруппированы по условиям и так их очень удобно читать.

```js
describe('EditAbstracteFormComponent', () => {
  describe('when form is in preview state', () => {
    it('should prewiewFlag assert true');
    it('should not display soer-editor');
    it('should contain markdown blocks with workbook blocks text');
  });
  describe('when form is in edited state', () => {
    it('should display soer-editor');
    it('should not display markdown blocks');
  });
});
```

</details>

### Требования к написанию тестов

#### Не создавайте хрупких тестов

Хрупкий тест - это тест, в который необходимо вносить изменения вслед за внесением изменений в код, который он тестирует. Тесты - это такой же код, и они требуют не только временных затрат на их написание, но и поддержку. Поэтому чем проще в поддержке тест - тем лучше.

#### Не дублируйте тесты

Если вы покрыли тестом какой-либо метод, то старайтесь не дублировать точно такие же проверки в модулях, которые используют Ваш метод в качестве зависимостей. Вместо этого в unit-тестах других модулей лучше поставьте на данный метод заглушку.
В противном случае Вы лишь увеличите себе объем необходимой работы при написании и поддержании тестов.

#### Не создавайте Unit-тесты для методов-оберток

Многие методы представляют собой лишь обертки, которые не содержат в себе какой-либо логики. Такие методы только вызывают другие методы и обрабатывают их результат. Создание Unit-тестов для таких методов чаще всего приводит к созданию либо хрупких тестов, либо к дублированию тестов.
Вместо написания Unit-тестов, такие методы лучше включать в интеграционные тесты.

#### Ставьте заглушки на модули, взаимодействующие с внешним миром

При создании интеграционных тестов мы не разворачиваем какую-либо тестовую среду. Поэтому, если тестируемый код использует модуль, который работает с базами данных, файловой системой, отправляет данные по сети (и т.п), то мы заменяем его на заглушку (mock, stub).
При этом, заглушку необходимо ставить на тот модуль, который **непосредственно** заменяет нам работу с внешним миром! Потому что чем ближе к внешнему миру располагается заглушка, тем больше кода покрывается интеграционным тестом -> тем больше возможных регрессий он может отследить.

### Тестирование Backend

По возможности, все enpdoint'ы backend'a должны быть покрыты интеграционными тестами.  
При написании интеграционных тестов, необходимо покрыть **основные** возможные бизнес-значимые варианты входных данных со стороны клиента (тело и параметры запроса) и ответы со стороны мокируемых внешних сервисов и БД. **Обязательно** необходимо протестировать успешный вариант выполнения (так называемый Happy Path). Тестировать различные варианты ошибок валидации (передавать пустые поля, строки вместо чисел и т.д.), либо крайне редкие варианты ошибок в интеграционных **тестах не нужно**.
Написание Unit-тестов целесообразно для методов, содержащих в себе сложную логику, в которых изолировано может возникнуть регрессия.

### Тестирование Frontend

Простые компоненты добавляем в Storybook, это позволит наглядно тестировать их работу и отображение.  
Сложную логику работы компонентов тестируем с помощью unit или интеграционных тестов.  
Сервисы, использующие хранилище или шину, тестируем с помощью интеграционных тестов.  
Сетевые запросы обязательно мокируем.

# Принципы разработки

## Как описывать решение по рефакторингу

Описание рефакторинга предлагаю делать по принципу "АРУ":

### А - Аргументация:
Лучше когда аргументы основаны на числовых значениях, а не на "ощущениях". Т.е. "уменьшим код на Х строк", "уменьшим количество усовий на Х штук" и т.д. В случае с переимнованием функций желательно указать есть ли соглашения в проекте о именовании данных функций

### Р - Риски
Рефакторинг по классике - это изменение поведения без изменения интепрфейса. Т.е. мы должны показать, что мы не меняем интерфейс и у нас не посыпится программа (поменяли функцию, а где-то остался ее старый вариант)
Изменение именования функций у нас допускается (хотя это не по классике), но нужно показать сколько на эту функцию завязано, чтобы понять возможные регрессии.

Так же риски могут включать описание и других последствий.

### У - унификация
Нужно показать есть общий паттерн решения для улучшаемого поведения. Так, например, в данном случае нужно показать какая общая практика возврата значений из функции в проекте.
Желательно описание общих принципов выносить в CONTRIBUTE.md

## Управление ошибками

__требуется описание__

# Полезные ссылки:

[SOER Media](https://s0er.ru/documents/workbook/3185)  
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)  
[How to Write a Git Commit Message](https://cbea.ms/git-commit/)  
[Pull Requests with Rebase](https://devblogs.microsoft.com/devops/pull-requests-with-rebase/)  
[Лучшие практики тестирования](https://github.com/goldbergyoni/javascript-testing-best-practices/blob/master/readme-ru.md) ([оригинал](https://github.com/goldbergyoni/javascript-testing-best-practices))  
[Cypress best practices](https://docs.cypress.io/guides/references/best-practices)
