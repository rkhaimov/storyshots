---
sidebar_position: 2
---

# Установка и запуск

[//]: # (TODO дополнить)
:::note
На данный момент библиотека не публикуется ни в один из реестров пакетов, установка выполняется в локальном режиме.
:::

## Пример использования

*Описание превью и историй:*

```tsx title="/storyshots/preview.tsx"
import { createPreviewApp } from '@storyshots/react-preview';

// Определение внешних зависимостей
const factory = {
    createExternals: (config) => ({
        getUser: async () => ({ id: 1, name: 'John Doe' }),
    }),
    createJournalExternals: (externals, config) => ({
        getUser: config.journal.asRecordable(externals.getUser),
    }),
};

// Инициализация превью
const { it, run } = createPreviewApp(factory);

// Определение историй
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

*Описание менеджера в режиме **UI***:

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
        },
        {
            type: 'emulated',
            name: 'mobile',
            config: {
                userAgent:
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
                width: 414,
                height: 896,
                deviceScaleFactor: 3,
            },
        },
    ],
    // Описание путей до основных артефактов: эталонного результата работы и файлов браузера
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

*Запуск UI менеджера* (требуется ts-node)

```shell
npx ts-node /storyshots/ui.ts
```
