# Сниппеты для коносли Naris

## Изменение accessTag для JSON документов

```
    patch = (did) => {
        naris.bus$.publish(naris.commands().patch({...naris.emitters.jsonDocument, ...{key: {did}}}, {accessTag: 'PRIVATE'}));
    }
```
