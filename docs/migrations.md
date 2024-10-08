Миграции
========

Процедура миграции реализована с помощью `typeorm`, официальную документацию можно почитать [здесь](https://orkhan.gitbook.io/typeorm/docs/migrations)

## Предварительная настройка

Перед запуском миграции требуется убедиться в наличии файла с переменными окружения `.env` на уровне проекта в котором описаны параметры подключения к БД

## Создание файла миграции

Для создания новой миграции требуется выполнить команду 
```
nx run <проект>:migration-create --name=<название миграции>
```
Например:
```
nx run naris-api:migration-create --name=example
```
создаст файл `apps/naris-api/migrations/<timestamp>-example.ts`

## Запуск миграции

Для запуска миграции требуется выполнить команду 
```
nx run <проект>:migration-run
```

## Откат миграции

Для отмены внесенных изменений по средствам миграции требуется выполнить команду 
```
nx run <проект>:migration-revert
```
Данная команда отменит последнею примененную миграцию

## Генерация миграции

<i>Создание файла миграции описывающего уже внесенные изменения в БД</i>

Для генерации миграции требуется выполнить команду 
```
nx run <проект>:migration-generate --name=<название миграции>
```