# createPreviewApp

Функция, инициализирующая [AUT](#) и создающая [фабрики тестов](#). Принимает описание внешних
зависимостей [ExternalsFactory](#).

## ExternalsFactory

Объект для инициализации и управления внешними зависимостями приложения.

---

### createExternals

Основная фабрика, инициализирующая [внешние зависимости](#) приложения. Принимает [StoryConfig](#).

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

Помечает функции в объекте `externals`, которые должны быть [журналироваться](#) по умолчанию. После того как функция
помечена как записываемая, это действие нельзя отменить.

Принимает итоговый `externals` и [StoryConfig](#).

```ts
createPreview({
    createJournalExternals: (externals, config) => ({
        ...externals,
        getUser: config.journal.asRecordable(externals.getUser)
    })
});
```

## run

Помимо [фабрики тестов](#), возвращает функцию `run`, необходимую для запуска превью. Принимает массив [историй](#).

```tsx
const { run, it } = createPreview(/* ... */);

run([
    it('works', {
        render: (externals) => <App externals={externals} />
    }),
]);
```