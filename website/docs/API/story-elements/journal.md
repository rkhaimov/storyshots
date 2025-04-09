# Journal

Представляет собой экземпляр [журнала](/specification/requirements/storage#способ-верификации).

---

## record

Записывает вызов метода, сохраняя его имя и аргументы.

```ts
it('...', {
    arrange: (externals, config) => ({
        createUser: (body) => {
            config.journal.record('createUser', body);

            return externals.createUser(body);
        }
    })
});
```

## asRecordable

Оборачивает функцию для логирования её вызовов.

```ts
it('...', {
    arrange: (externals, config) => ({
        createUser: config.journal.asRecordable('createUser', externals.createUser)
    })
});
```
