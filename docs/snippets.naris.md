# Сниппеты для коносли Naris

## Изменение accessTag для JSON документов

```
    patch = (did) => {
        naris.bus$.publish(naris.commands().patch({...naris.emitters.jsonDocument, ...{key: {did}}}, {accessTag: 'PRIVATE'}));
    }
```

## Просмотр всех изменений в namespace

```
log = () => {} 
runner = (d) => log(d)
naris.scripts.onChangeDataForEach('templates', runner)
```

Далее нужео в log указать, что именно смотреть, например:

```
log = d => console.log(d) // просмотр
log = d => patch(d.id) // установить всем документам новый accessTag, см. snippet patch
```

## Примеры

```typescript
namespace = 'templates' 
run = () => {} 
guard = () => true
runner = (d) => guard(d) ? run(d) : ''
naris.scripts.onChangeDataForEach('templates', runner)

namespace = 'targets'; guard = d => d.id === 7002; run = d => console.log('Ok', d.id);
```
