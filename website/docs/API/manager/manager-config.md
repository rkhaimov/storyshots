# ManagerConfig

Конфигурация для менеджера. Используется при запуске `storyshots` в режимах [UI](/API/manager/runUI) и [background](/API/manager/runInBackground).

---

## devices

Описывает список [устройств](/API/story-elements/device), в рамках которых запускаются истории. Возможные наименования устройств можно
найти [здесь](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json).

:::note
Первый объект в списке `devices` становится [устройством по умолчанию](/ui/#запуск).
:::

```ts
runUI({
    devices: [
        {
            name: 'desktop',
            width: 1480,
            height: 920
        },
        {
            name: 'mobile',
            userAgent:
                'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
            width: 414,
            height: 896,
            deviceScaleFactor: 3,
        },
    ],
    /* ... */
})
```

## preview

Принимает [IPreviewServer](/architecture/scheme#ipreviewserver).

```ts
runUI({
    preview: createWebpackMiddleware(/* конфигурация */),
    /* ... */
})
```

## paths

Содержит описание путей для артефактов `storyshots`.

```ts
runUI({
    paths: {
        // Путь до папки с журналами
        records: path.join(process.cwd(), 'records'),
        // Путь до папки со снимками экрана
        screenshots: path.join(process.cwd(), 'screenshots'),
        // Путь до папки со служебными файлами
        temp: path.join(process.cwd(), 'temp'),
    },
    /* ... */
})
```

## runner

Объект обработчик тестовых заданий. Чаще всего представляет собой кластер из нескольких экземпляров браузера. Реализация
по умолчанию позволяет контролировать их количество:

```ts
runUI({
    runner: RUNNER.pool({ agentsCount: 4 }),
    /* ... */
})
```

:::tip
Обычно количество агентов можно установить в зависимости от числа ядер процессора. Однако это не означает, что
увеличение количества агентов снизит производительность тестов, поэтому рекомендуется вычислять размер опытным путём.
:::

## capture

Функция снятия снимка экрана. Её основная задача — стабилизация страницы.

:::note
Страница считается стабильной, если её визуальное представление не изменяется, то есть она "замирает".
:::

По умолчанию используются оптимальные настройки для алгоритма стабилизации, но их можно изменить:

```ts
runUI({
    // Выполняет мнговенный снимок экрана, минуя стадию стабилизации. (Не рекомендуется для большинства сценариев)
    capture: CAPTURE.instantly,
    /* ... */
})
```

## compare

Описывает алгоритм сравнения двух изображений.

:::note
По умолчанию `storyshots` использует [looks-same](https://github.com/gemini-testing/looks-same), учитывающий особенности
человеческого цветовосприятия, что делает тесты менее хрупкими.
:::

```ts
runUI({
    // Сравнивает буферы напрямую, без использования продвинутых алгоритмов. (Не рекомендуется для большинства сценариев)
    compare: (actual, expected) => actual.equals(expected),
    /* ... */
})
```
