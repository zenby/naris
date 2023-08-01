# Сниппеты для коносли Naris

## Изменение accessTag для JSON документов

```typescript
    patch = (did) => {
        naris.bus$.publish(naris.commands().patch({...naris.emitters.jsonDocument, ...{key: {did}}}, {accessTag: 'PRIVATE'}));
    }
```

## Создание линка

```
createLink = (lid, data) => {
        naris.bus$.publish(naris.commands().create({...naris.emitters.link, ...{key: {lid}}}, {json: JSON.stringify(data)}));
    }
```

## Просмотр всех изменений в namespace

```typescript
log = () => {} 
runner = (d) => log(d)
naris.scripts.onChangeDataForEach('templates', runner)
```

Далее нужео в log указать, что именно смотреть, например:

```typescript
log = d => console.log(d) // просмотр
log = d => patch(d.id) // установить всем документам новый accessTag, см. snippet patch
```

## Примеры

```typescript
namespace = 'templates' 
run = () => {} 
guard = () => true
runner = (d) => guard(d) ? run(d) : ''
naris.scripts.onChangeDataForEach(namespace, runner)

namespace = 'targets'; guard = d => d.id === 7002; run = d => console.log('Ok', d.id);
```
