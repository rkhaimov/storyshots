---
sidebar_position: 6
---

# @storyshots/msw-externals

Подменяет обращения к серверу [не инвазивным методом](/patterns/replace#подмена-через-сайд-эффекты), с помощью
библиотеки [`msw`](https://github.com/mswjs/msw).

## createWorkerSupplier

Доставляет файл worker на страницу:

```ts
import { ManagerConfig, mergeServe } from '@storyshots/core/manager';
import { createWorkerSupplier } from '@storyshots/msw-externals/createWorkerSupplier';
import { createWebpackServer } from '@storyshots/webpack';

export default {
    preview: mergeServe(
        createWorkerSupplier(),
        // Может использоваться любой другой сервер
        createWebpackServer(/* ... */),
    ),
    /* ... */
} satisfies ManagerConfig;
```

## Endpoints

Хранит мета информацию о переопределённых эндпоинтах:

```ts
import { Endpoints } from '@storyshots/msw-externals'

type Externals = {
    // Мета описывается в общем типе Endpoints и хранится в externals.
    endpoints: Endpoints;
};
```

В качестве значения по умолчанию, в `preview` зоне указать пустой объект:

```ts
export const { run, it, describe } = createPreviewApp<Externals>({
    createExternals: () => ({ endpoints: {} as Endpoints }),
    createJournalExternals: (externals) => externals,
});
```

## MSWReplacer

Переопределяет поведение API на основе описанных `Endpoints`:

```tsx
void run(
    map(stories, (story) => ({
        render: (externals) => (
            // MSWReplacer должен инстанцироваться раньше основного приложения
            <MSWReplacer endpoints={externals.endpoints}>
                <App />
            </MSWReplacer>
        ),
        ...story,
    })),
);
```

## createMSWArrangers

Создаёт arrangers утилиты на базе [`@storyshots/arrangers`](/modules/arrangers):

```ts
import { createArrangers } from '@storyshots/arrangers';
import { createMSWArrangers, Endpoints } from '@storyshots/msw-externals';

const arrangers = createArrangers<Endpoints>();

const msw = createMSWArrangers(
    // Указываем путь до хранения Endpoints в externals
    arrangers.focus('endpoints')
);
```

## endpoint

Добавляет новый эндпоинт в мету:

```ts
it('...', {
    arrange: endpoint('findPetsByStatus', {
        url: '/api/pet/findByStatus',
        handle: () => [],
    })
});

declare module '@storyshots/msw-externals' {
    // Помимо описания эндпоинта необходимо аугментировать основной тип
    interface Endpoints {
        findPetsByStatus: Endpoint<FindPetsByStatusApiResponse>;
    }
}
```

:::note
Для того чтобы не дублировать определения `endpoint` можно вынести в отдельную функцию:

```ts
it('...', {
    arrange: setup()
});

function setup() {
    return endpoint('findPetsByStatus', {
        url: '/api/pet/findByStatus',
        handle: () => [],
    });
}

declare module '@storyshots/msw-externals' {
    // Помимо описания эндпоинта необходимо аугментировать основной тип
    interface Endpoints {
        findPetsByStatus: Endpoint<FindPetsByStatusApiResponse>;
    }
}
```

:::

## record

Делает переданные эндпоинты отслеживаемыми:

```ts
it('...', {
    arrange: arrange(
        setup(),
        // Вызовы findPetsByStatus теперь будут записаны в журнал
        record('findPetsByStatus'),
    )
});
```

## handle

Позволяет подменить поведение существующего эндпоинта:

```ts
it('...', {
    arrange: arrange(
        setup(),
        // Поведение findPetsByStatus теперь другое
        handle('findPetsByStatus', () => createFewPetsStub()),
    )
});
```

:::tip
`endpoint`, `record` и `handle` являются такими же утилитами arrangers что и описанные в `@storyshots/arrangers`.

Для них работают те же правила и их спокойно можно комбинировать между собой.
:::
