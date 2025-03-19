# Первые тесты

После [установки и настройки](#) `storyshots` самое время написать первый тестовый сценарий:

```ts
const { it, run } = createPreviewApp(/* ... */);

const stories = [
  it(''),
];

run(stories);
```
