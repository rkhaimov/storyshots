---
sidebar_position: 4
---

# @storyshots/web-api-externals

Подменяет `WebAPI` на их [тестируемые аналоги](/specification/requirements/env)
через [инвазивный метод](/patterns/replace#подмена-через-сайд-эффекты).

## install

Функция выполняющая подмену браузерного API.

:::warning
Для корректной работы должна вызываться до выполнения любого другого кода на странице.
:::

```ts
import { install } from '@storyshots/web-api-externals';

// Замораживает время на странице на отметке 13.01.2024 12:00
export const clock = install({ date: new Date(2024, 0, 13, 12) });
```

`@storyshots/web-api-externals` также подменяет локальные хранилища на те, что хранят свои данные во временной памяти.

```ts
// Данная запись будет автоматически стёрта при запуске новой истории
localStorage.setItem('token', '...');
```

:::note
`IndexedDB` не заменяется данным модулем.
:::

## clock

Функция `install` возвращает специальный объект `clock`, через который изменять дату по умолчанию в отдельно взятых
историях:

```ts
it('...', {
    arrange: (externals) => {
        clock.set(new Date(/*...*/));
        
        return externals;
    },
});
```

## tick

Модуль также корректирует поведение `setTimeout` таким образом, что задержкой можно управлять извне:

```ts
// Уведомление закрывается через 5 секунд
setTimeout(() => closeNotification(), 5_000);
```

Для того чтобы не ждать в истории так долго, можно воспользоваться специальным методом `tick`:

```ts
it('closes notification', {
    act: (actor) => actor
        .screenshot('NotificationShown')
        // Перемотать на 5 секунд вперёд
        .exec(() => window.tick(5_000))
        .screenshot('NotificationHidden')
});
```

## Важно

Модуль позволяет облегчить тестирование программы, однако стоит учитывать и следующие особенности:

* `setTimeout` будет работать в обычном режиме по умолчанию.
* `tick` позволяет перемотать время вперёд, вызывая `setTimeout` раньше.
* Поведение остальных таймеров остаётся нетронутым (`setInterval`, `requestAnimationFrame` и другие).
* Изменение даты никак не влияет на срабатывание таймеров.

:::note
Поведение по умолчанию можно редактировать через [конфигурацию](https://github.com/sinonjs/fake-timers?tab=readme-ov-file#var-clock--faketimersinstallconfig) `install`.
:::
