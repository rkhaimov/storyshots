---
sidebar_position: 7
---

# @storyshots/proxy

[Сервер](/modules/scheme#ipreviewserver) `preview` проксирующий обращения на переданный адрес.

## createProxyServer

Создает `proxy` до заданного сервера:

```ts
import { ManagerConfig } from '@storyshots/core/manager';
import { createProxyServer } from '@storyshots/proxy';

export default {
    preview: createProxyServer('http://localhost:3000'),
    /* ... */
} satisfies ManagerConfig;
```

:::warning Важно
`@storyshots/proxy` следует рассматривать как временное решение при интеграции `storyshots` в проект.

Модуль хоть и позволяет облегчить интеграцию, однако не поддерживает некоторые из функций, такие как автоматическая
перезагрузка историй, а также не позволяет интегрировать UI режим в полной мере.
:::