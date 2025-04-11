---
sidebar_position: 5
---

# @storyshots/arrangers

Функции для работы с `externals` в `arrange` фазе истории.

## createArrangers

Создаёт основные утилиты и привязывает их к базовому типу `externals`:

```ts
import { createArrangers } from '@storyshots/arrangers';

interface IExternals {
    analytics: {
        log(event: string): void;
    };
    business: {
        getBalanceAt(date: number): Promise<number>;
        applyCV(form: unknown): Promise<void>;
    };
    route: string;
}

const utils = createArrangers<IExternals>();
```

## set

Устанавливает значение для описанного ключа:

```ts
it('...', {
    // Метод getBalanceAt теперь имеет другую реализацию
    arrange: set('business.getBalanceAt', async () => 100_000),
});
```

## record

Делает переданные методы отслеживаемыми:

```ts
it('...', {
    // Вызовы getBalanceAt теперь будут записаны в журнал
    arrange: record('business.getBalanceAt'),
});
```

## compose

Устанавливает новое значение на базе текущего:

```ts
it('...', {
    arrange: compose(
        'business.getBalanceAt',
        (getBalanceAt) => () => getBalanceAt().then(balance => balance * 2)
    ),
});
```

Может использоваться и для обычных свойств:

```ts
it('...', {
    arrange: compose('route', (path) => path === '/login' ? '/' : path),
});
```

## focus

Фокусирует `arrangers` на вложенном свойстве:

```ts
import { createArrangers } from '@storyshots/arrangers';

interface IExternals {
    repositories: {
        UserRepository: {
            getUser(): Promise<void>;
        },
    };
    route: string;
}

const utils = createArrangers<IExternals>();

// Создаём arrangers сфокусированные на repositories.
export const repository = utils.focus('repositories');
```

Далее созданные утилиты можно использовать в историях следующим образом:

```ts
it('...', {
    // Путь до свойства теперь сокращён
    arrange: repository.set('UserRepository.getUser', async () => createAdminUserStub()),
});
```

## arrange

Функция объединяющая несколько `arrangers` в один:

```ts
it('...', {
    arrange: arrange(
        set('business.getBalanceAt', () => 100_000),
        record('analytics.log'),
    ),
});
```

`arrange` можно вкладывать один в другой:

```ts
it('...', {
    arrange: arrange(
        withZeroBalance(),
        withApplyCVSuccess(),
    ),
});

function withZeroBalance() {
    return set('business.getBalanceAt', () => 0);
}

function withApplyCVSuccess() {
    return arrange(
        set('business.applyCV', async () => 'success'),
        record('business.applyCV')
    );
}
```

Можно описывать inline arrange:

```ts
it('...', {
    arrange: arrange(
        set('business.getBalanceAt', () => 0),
        // Можно вынести в отдельную функцию
        (externals) => {
            clock.set(new Date(/* ... */))

            return externals;
        }
    ),
});
```

## iterated

Позволяет реализовать локальное состояние:

```ts
it('...', {
    arrange: iterated(
        ['failure #0', 'failure #1', 'success'],
        (next) => set('business.applyCV', async () => next())
        // applyCV() -> failure #0;
        // applyCV() -> failure #1;
        // applyCV() -> success;
    ),
});
```

:::warning Важно
Методы `arrange` и `iterated` являются общими. Arranger утилиты, такие как `set`, `focus`, `record` и так далее, зависят
от контекста задаваемого `focus`.
:::

## transform

Преобразует возвращаемое значение метода, используется в связке с `compose`:

```ts
it('...', {
  arrange: compose(
    'business.getBalanceAt',
    transform(balance => balance * 2),
  ),
});
```

## resolves

Создаёт функцию возвращающую `Promise.resolve` с переданным значением:

```ts
it('...', {
  arrange: set('business.getBalanceAt', resolves(0)),
});
```

## rejects

Создаёт функцию возвращающую `Promise.reject` с переданным значением:

```ts
it('...', {
  arrange: set('business.getBalanceAt', rejects('Balance not found')),
});
```
