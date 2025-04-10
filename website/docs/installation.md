---
sidebar_position: 2
---

# Быстрый старт

`storyshots` легко интегрируется даже в уже написанные приложения благодаря своей [архитектуре](/modules/scheme).

## Установка и сборка

:::note
На данный момент библиотека не публикуется ни в один из реестров пакетов, ввиду наличия не стабильной структуры пакетов.
Установка выполняется в офлайн режиме.
:::

В корне проекта установить зависимости:

```shell
npm install
```

Собрать пакеты и запаковать в архив:

```shell
npm run build && npm run pack
```

## Интеграция в проект

По итогу в корне будут сформированы артефакты `.tar`. Описание данных компонентов можно найти в
разделе [архитектуры](/modules/scheme).

:::tip
Для проекта написанного на `react` с использованием `webpack` сборщика подойдёт следующий набор:

* @storyshots/core
* @storyshots/react
* @storyshots/webpack
  :::

Данные модули необходимо разместить в папке проекта и поместить их под контроль VCS:

```plaintext
project/
├── src/
├── offline/
│   ├── @storyshots-core-0.0.10.tgz
│   ├── @storyshots-react-0.0.10.tgz
│   └── @storyshots-webpack-0.0.10.tgz
└── package.json
```

Далее зависимости необходимо зарегистрировать:

```json title="package.json"
{
  "devDependencies": {
    "@storyshots/core": "file:offline/storyshots-core-0.0.10.tgz",
    "@storyshots/react": "file:offline/storyshots-react-0.0.10.tgz",
    "@storyshots/webpack": "file:offline/storyshots-webpack-0.0.10.tgz"
  }
}
```

И установить:

```shell
npm i
```

## Описание превью

:::note
Связанные со `storyshots` файлы в данном руководстве располагаются в `src/storyshots` (см. [дислокация тестов](/patterns/files#дислокация-тестов)).
:::

После установки всё готово для описания зоны превью и первых историй. Начнём с preview:

```ts title="/src/storyshots/preview/config.ts"
import { createPreviewApp } from '@storyshots/react';

// Инициализация превью
export const { it, run } = createPreviewApp({
    // Определение поведения "по умолчанию" для внешних зависимостей
    createExternals: (config) => ({
        getUser: async () => ({ id: 1, name: 'John Doe' }),
    }),
    // Маркировка методов для записи в журнал вызовов
    createJournalExternals: (externals, config) => ({
        getUser: config.journal.asRecordable('getUser', externals.getUser),
    }),
});
```

После, опишем первые истории:

```tsx title="/src/storyshots/stories/index.tsx"
import { finder } from '@storyshots/core';

import { it } from '../preview/config';

export const stories = [
  it('renders the application correctly'),
  it('handles missing user gracefully', {
    // Модифицируем поведение сервера для данной истории
    arrange: (externals) => ({ ...externals, getUser: async () => null }),
  }),
  it('allows to login', {
    // Эмулируем действия на странице
    act: (actor) => actor.click(finder.getByRole('button', {name: 'Login'})),
  }),
];
```

:::tip
Истории можно [декомпозировать](/patterns/stories#разделение-историй).
:::

После чего, запустим описанные истории реализовав [корневой render](/patterns/stories#универсальный-render) с [внедрением зависимостей](/patterns/replace#подмена-через-инверсию):

```tsx title="/src/storyshots/preview/index.tsx"
import { map } from '@storyshots/core';

import { run } from './config';
import { stories } from '../stories';

run(
    map(stories, (story) => ({
        render: (externals) => (
            <Externals externals={externals}>
                <App />
            </Externals>
        ),
        ...story,
    })),
);
```

## Описание менеджера

Далее необходимо описать [сервер превью](/modules/scheme#ipreviewserver):

```ts title="/src/storyshots/manager/createAppServer.ts"
import { createWebpackServer } from '@storyshots/webpack';
// Переиспользуем конфигурацию сборки
import config from '../../../webpack.config.ts';

export function createAppServer() {
    // Меняем entry и указываем на preview файл
    config.entry = '/src/storyshots/preview/index.ts';
    
    return createWebpackServer(config);
}
```

После описания сервера, нужно определить общую конфигурацию тестирования:

```ts title="/src/storyshots/manager/config.ts"
import { ManagerConfig } from '@storyshots/core/manager';

import { createAppServer } from './createAppServer';

export default {
  // Список тестируемых устройств
  devices: [
    {
      name: 'desktop',
      width: 1480,
      height: 920,
    },
  ],
  // Описание путей до основных артефактов: эталонного результата работы и временного хранилища
  paths: {
    screenshots: path.join(process.cwd(), 'screenshots'),
    records: path.join(process.cwd(), 'records'),
    temp: path.join(process.cwd(), 'temp'),
  },
  // Описание сервера превью
  preview: createAppServer(),
  // Настройка служб тестирования
  runner: RUNNER.pool({ agentsCount: 4 }),
} satisfies ManagerConfig;
```

Далее UI режим запустить с помощью

```shell
storyshots --ui /src/storyshots/manager/config.ts 
```

:::note
Для запуска всех тестов в фоновом режиме использовать:

```shell
storyshots /src/storyshots/manager/config.ts
```
:::

## Примеры

- [**Пример #1**](https://github.com/storyshots/storyshots/tree/master/examples/basic-externals) - `react` + `webpack` + стандартные `fetch` запросы.
- [**Пример #2**](https://github.com/storyshots/storyshots/tree/master/examples/msw-externals) - `react` + `webpack` + `rtk-query`.
