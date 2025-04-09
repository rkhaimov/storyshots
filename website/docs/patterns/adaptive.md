---
sidebar_position: 8
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# Адаптивность

Современный UI зачастую является адаптивным. `storyshots` учитывает данный факт, предоставляя соответствующий API.

## Одной историей все устройства

<MetricsTip improves={[Metric.RegressionProtection, Metric.RefactoringAllowance, Metric.Maintainability]}
degrades={[Metric.Speed]} />

Это в частности означает что интерфейс может отличаться
в зависимости от того, на каком устройстве запущено приложение:

```ts
it('shows dismissible user removal notice', {
    act: (actor, config) =>
        actor.screenshot('Notice').click(
            /**
             * config содержит информацию об устройстве на котором сейчас исполняется тест
             */
            config.device.name === 'desktop'
                // На десктоп это иконка крестика
                ? finder.getByRole('image', { name: 'close-note' })
                // На мобилке это просто текст "Закрыть"
                : finder.getByRole('button', { name: 'Закрыть' }),
        ),
});
```

:::note
Функции `arrange` и `render` также ссылаются на текущее эмулируемое устройство.
:::

Чтобы избавиться от условия можно сделать верстку более семантической, тем самым закрыв истории от лишних деталей
реализации:

```ts
it('shows dismissible user removal notice', {
    act: (actor) =>
        actor
            .screenshot('Notice')
            .click(finder.getByRole('button', { name: 'Закрыть уведомление' })),
});
```

:::note
Одинаковая роль будет назначена разным по своей реализации элементам, тем самым истории будут более совместимы с
рефакторингом.
:::

## По истории на устройство

<MetricsTip improves={[Metric.RegressionProtection, Metric.Maintainability]} />

Интерфейс в приложении может отличаться в зависимости от устройства настолько, что простых условий и семантической
верстки может оказаться недостаточно.

Вместо этого такие сценарии можно селективно устанавливать лишь для определённых устройств:

```ts
const usersStories = describe('Users', [
    it('shows nothing when there is no users', {
        /* ... */
    }),
    it('shows users', {
        /* ... */
    }),
    only(
        ['mobile'],
        // В мобильной версии доступны новые действия
        it('allows to swipe users to delete them', { /* ... */ }),
    ),
]);
```

:::tip
Метод [`only`](/API/operators/only) используется для включения истории только для определённых устройств. Это может быть полезно во время
активной разработки, когда функционал был разработан только для одной версии устройств.
:::

:::warning Внимание
Если разница в интерфейсе слишком велика, в таком случае рекомендуется создавать разные точки входа `storyshots` для
разных устройств:

```ts title="preview/desktop.ts"
// desktopStories это отдельный узел историй, описанных отдельно для desktop
run(desktopStories);
```

```ts title="preview/mobile.ts"
// mobileStories это отдельный узел историй, описанных отдельно для mobile
run(mobileStories);
```

Менеджер для каждого из превью будет запускаться отдельно с установленным устройством, например для desktop:

```ts title="manager/desktop-ui.ts"
runUI({
    devices: [
        {
            name: 'desktop',
            width: 1480,
            height: 920
        },
    ],
    /* ... */
})
```
:::

## Сокращение устройств

<MetricsTip improves={[Metric.Maintainability, Metric.Speed]} degrades={[Metric.RegressionProtection]} />

Требования для UI интерфейсов растут, ровно также растет и разнообразие устройств на которых этот интерфейс может
отображаться.

Данное обстоятельство может привести к желанию тестировать приложение на трёх и более устройствах:

<p style={{ color: 'red' }}>Вместо этого:</p>

```ts
const config = {
    devices: [
        { name: 'desktopXL', /* ... */ },
        { name: 'desktopL', /* ... */ },
        { name: 'desktopS', /* ... */ },
        { name: 'mobileL', /* ... */ },
        { name: 'mobileS', /* ... */ },
        { name: 'tablet', /* ... */ },
    ],
    /* ... */
};
```

Такое большое количество устройств хоть и увеличит общее покрытие приложения, но взамен, потребует существенных
временных и ресурсных затрат. Вместо этого, можно выделить лишь пару основных устройств.

<p style={{ color: 'green' }}>Делать это:</p>

```ts
const config = {
    devices: [
        { name: 'desktop', /* ... */ },
        { name: 'mobile', /* ... */ },
        { name: 'tablet', /* ... */ },
    ],
    /* ... */
};
```

:::tip
Не рекомендуется использовать более двух устройств в `storyshots`.
:::

Ещё одним вариантом будет использование разных режимов выполнения:

**Быстрый, но поверхностный** - в нём выполняются истории исключительно в рамках пары устройств:

```ts
run(only(['desktop', 'mobile'], stories));
```

**Полный, но медленный** - выполняются все тестовые сценарии для всех из устройств:

```ts
run(stories);
```

:::tip
Быстрые тесты можно выполнять в рамках рабочего процесса, в то время как медленные запускать ночью.
:::
