---
sidebar_position: 2
---

# Установка и запуск

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

## Артефакты

Команда сформирует следующие артефакты:

- **@storyshots/core** - базовый модуль, является обязательным к использованию
- **@storyshots/manager** - модуль управляющий тестами, обязательный
- **@storyshots/react-preview** - адаптер для [приложений](/specification/requirements/borders#функция) написанных на
  `react`
- **@storyshots/webpack-bundler** - сборщик (или же сервер) приложений написанных на `webpack`
- **@storyshots/proxy-bundler** - сервер позволяющий тестировать удалённые приложения по url
- **@storyshots/msw-externals** - набор утилит для подмены запросов с помощью `msw` библиотеки
- **@storyshots/rtk-externals** - набор утилит для подмены запросов сгенерированных `rtk` библиотекой

:::tip
Для проекта написанного на `react` с использованием `webpack` сборщика подойдёт следующий набор:

* @storyshots/core
* @storyshots/manager
* @storyshots/react-preview
* @storyshots/webpack-bundler
  :::

## Описание тестовых сценариев

После установки, первым делом следует описать превью область и определить первые тесты:

```tsx title="/storyshots/preview.tsx"
import { createPreviewApp } from '@storyshots/react-preview';

// Инициализация превью
const { it, run } = createPreviewApp({
    // Определение поведения "по умолчанию" для внешних зависимостей
    createExternals: (config) => ({
        getUser: async () => ({ id: 1, name: 'John Doe' }),
    }),
    // Маркировка методов для записи в журнал вызовов
    createJournalExternals: (externals, config) => ({
        getUser: config.journal.asRecordable(externals.getUser),
    }),
});

// Описание историй
const stories = [
    it('renders the application correctly', {
        render: (externals) => <App externals={externals} />,
    }),
    it('handles missing user gracefully', {
        arrange: (externals) => ({ ...externals, getUser: async () => null }),
        render: (externals) => <App externals={externals} />,
    }),
];

// Запуск превью
run(stories);
```

Использование режима **UI**:

```tsx title="/storyshots/ui.ts"
import { runUI } from '@storyshots/manager';
import { createWebpackBundler } from '@storyshots/webpack-bundler';
import path from 'path';

void runUI({
  // Описание тестируемых устройств
  devices: [
    {
      type: 'size-only',
      name: 'desktop',
      config: { width: 1480, height: 920 },
    }
  ],
  // Описание путей до основных артефактов: эталонного результата работы и временного хранилища
  paths: {
    screenshots: path.join(process.cwd(), 'screenshots'),
    records: path.join(process.cwd(), 'records'),
    temp: path.join(process.cwd(), 'temp'),
  },
  // Описание сервера превью
  preview: createWebpackBundler({ entry: '/storyshots/preview.tsx' /* ... */ }),
  // Настройка служб тестирования
  runner: RUNNER.pool({ agentsCount: 4 }),
});
```

Запуск (требуется ts-node)

```shell
npx ts-node /storyshots/ui.ts
```

:::tip
Типовой пример проекта можно
посмотреть [тут](https://github.com/rkhaimov/storyshots/tree/master/examples/basic-externals)
:::
