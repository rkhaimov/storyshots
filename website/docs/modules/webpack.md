---
sidebar_position: 3
---

# @storyshots/webpack

[Сервер](/modules/scheme#ipreviewserver) `preview` использующий сборщик `webpack`.

:::tip
`@storyshots/webpack` подходит для приложений использующих `webpack` для `dev` сборки.
:::

## createWebpackServer

Создаёт сервер превью. В качестве аргумента принимает стандартную конфигурацию `webpack`.

```ts
import { ManagerConfig } from '@storyshots/core/manager';
import { createWebpackServer } from '@storyshots/webpack';

export default {
    preview: createWebpackServer({ /* webpack конфигурация */ }),
    /* ... */
} satisfies ManagerConfig;
```

:::note
В качестве `entry` должен указываться файл с инициализацией `preview`.
:::

:::warning Важно
`createWebpackServer` не поддерживает опции для `devServer` так как не использует его внутри.
:::
