# createPreviewApp

Функция, инициализирующая [AUT](/specification/requirements/borders#функция) и
создающая [фабрики тестов](/API/factories/). Принимает описание [внешних зависимостей](/specification/requirements/env)
`ExternalsFactory`.

## ExternalsFactory

Объект для инициализации и управления [внешними зависимостями](/specification/requirements/env) приложения.

---

### createExternals

Основная фабрика, инициализирующая [внешние зависимости](/specification/requirements/env) приложения.
Принимает [StoryConfig](/API/story-elements/story-config).

```ts
createPreview({
    createExternals: () => {
        // Данное поведение будет использоваться по умолчанию в историях
        getUser: async () => DEFAULT_USER
    },
    /* ... */
});
```

### createJournalExternals

Помечает функции в объекте `externals`, которые должны быть [журналироваться](/specification/requirements/storage#способ-верификации) по умолчанию. После того как функция
помечена как записываемая, это действие нельзя отменить.

Принимает итоговый `externals` и [StoryConfig](/API/story-elements/story-config).

```ts
createPreview({
    createJournalExternals: (externals, config) => ({
        ...externals,
        getUser: config.journal.asRecordable(externals.getUser)
    })
});
```

## run

Помимо [фабрики тестов](/API/factories/), возвращает функцию `run`, необходимую для запуска превью. Принимает
массив [историй](/specification/requirements/borders).

```tsx
const { run, it } = createPreview(/* ... */);

run([
    it('works', {
        render: (externals) => <App externals={externals} />
    }),
]);
```
