---
sidebar_position: 2
---

# Быстрый старт

`storyshots` легко интегрируется даже в уже написанные приложения благодаря своей архитектуре.

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
разделе [архитектуры](/architecture/scheme).

:::tip
Для проекта написанного на `react` с использованием `webpack` сборщика подойдёт следующий набор:

* @storyshots/manager
* @storyshots/react
* @storyshots/webpack-middleware
  :::

Данные модули необходимо разместить в папке проекта и поместить их под контроль VCS:

```plaintext
project/
├── src/
├── offline/
│   ├── @storyshots-manager-0.0.10.tgz
│   ├── @storyshots-react-0.0.10.tgz
│   └── @storyshots-webpack-middleware-0.0.10.tgz
└── package.json
```

Далее зависимости необходимо зарегистрировать:

```json title="package.json"
{
  "devDependencies": {
    "@storyshots/manager": "file:offline/storyshots-manager-0.0.10.tgz",
    "@storyshots/react": "file:offline/storyshots-react-0.0.10.tgz",
    "@storyshots/webpack-middleware": "file:offline/storyshots-webpack-middleware-0.0.10.tgz"
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
        getUser: config.journal.asRecordable(externals.getUser),
    }),
});
```

После, опишем первые истории:

```tsx title="/src/storyshots/stories/index.tsx"
import { finder } from '@storyshots/react';

import { it } from '../preview/config';

export const stories = [
  it('renders the application correctly'),
  it('handles missing user gracefully', {
    // Модифицируем поведение сервера для данной истории
    arrange: (externals) => ({ ...externals, getUser: async () => null }),
  }),
  it('allows to login', {
    // Эмулируем действия на странице"
    act: (actor) => actor.click(finder.getByRole('button', {name: 'Login'})),
  }),
];
```

:::tip
Истории можно [декомпозировать](/patterns/stories#разделение-историй).
:::

После чего, запустим описанные истории реализовав [корневой render](/patterns/stories#универсальный-render) с [внедрением зависимостей](/patterns/replace#подмена-через-инверсию):

```tsx title="/src/storyshots/preview/index.tsx"
import { map } from '@storyshots/react';

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

Далее необходимо описать [сервер превью](/architecture/scheme#ipreviewserver):

```ts title="/src/storyshots/manager/createAppServer.ts"
import { createWebpackMiddleware } from '@storyshots/webpack-middleware';
// Переиспользуем конфигурацию сборки
import config from '../../../webpack.config.ts';

export function createAppServer() {
    // Меняем entry и указываем на preview файл
    config.entry = '/src/storyshots/preview/index.ts';
    
    return createWebpackMiddleware(config);
}
```

После описания сервера, нужно определить общую конфигурацию тестирования:

```ts title="/src/storyshots/manager/config.ts"
import { ManagerConfig } from '@storyshots/react/manager';

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

- [**React**](https://github.com/rkhaimov/storyshots/tree/master/examples/basic-externals) - проект использующий стандартные репозитории с инверсией зависимостей.
- [**RTK**](https://github.com/rkhaimov/storyshots/tree/master/examples/msw-externals) - проект утилизирующий RTK запросы.
