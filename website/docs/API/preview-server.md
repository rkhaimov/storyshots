# PreviewServer

Описывает реальный или виртуальный сервер превью.

---

## handler

Обработчик входящих запросов клиента. Обычно это запросы на статические ресурсы превью:

```ts
{
    // Пример простого обработчика, возвращающего предсобранный index.html
    handler: (req, res, next) => {
        if (req.url.includes('index.html')) {
            res.sendFile(path.join('dist', 'index.html'));
        } else {
            next();
        }
    },
    /* ... */
}
```

:::note
Функция `handler` встраивается в метод `app.use` библиотеки `express` и представляет
собой [middleware](https://expressjs.com/en/guide/writing-middleware.html#writing-middleware-for-use-in-express-apps).
:::

Область применения `handler` выходит за пределы обычного сервера статики превью и может использоваться для реализации
более сложных поведений, необходимых для тестирования:

```ts
// Функция будет подменять все запросы к изображениям специальной заглушкой
function createImageStubber(): PreviewServer {
    return {
        handler: (req, res, next) => {
            if (isImageReq(req)) {
                res.sendFile('stub.png');
            } else {
                next();
            }
        },
        /* ... */
    };
}

// mergeServe комбинирует разные серверы превью в один
const server = mergeServe(createImageStubber(), createPreviewServer());
```

## cleanup

Функция, вызывающаяся при закрытии сервера. Используется для освобождения занятых ресурсов.

## onUpdate

Функция, выполняющая подписку на обновления статики превью. Необходима для автоматического перезапуска теста в
режиме [UI](#).

```ts
{
    onUpdate: (handler) =>
        /**
         * handler принимает текущий hash обозначающий содержимое превью, если хеш изменился,
         * то storyshots будет считать что AUT обновился.
         */
        compiler.hooks.done.tap('PreviewUpdate', (stats) => handler(stats.hash)),
    /* ... */
}
```