---
sidebar_position: 3
---

import { MetricsTip, Metric } from '@site/src/MetricsTip';

# Актор

Описание актора - это важная сторона историй в `storyshots`. При правильном подходе, можно значительным образом
упросить тесты и рефакторинг на проекте.

## Семантические селекторы

<MetricsTip improves={[Metric.RefactoringAllowance, Metric.Maintainability]} />

Вторым узким местом после заглушек является функция `act`. Описывая инструкции взаимодействия с интерфейсом можно легко
увеличить связанность историй с деталями реализации программы, сделав тесты при этом более хрупкими:

<p style={{ color: 'red' }}>Вместо этого:</p>

```tsx
it('allows to delete product', {
    act: (actor) => actor.click(finder.locator('div.user-card div.button').getByText('Удалить')),
});
```

Тест в данном случае "знает" каким образом реализована кнопка удаления.

<p style={{ color: 'green' }}>Делать это:</p>

```tsx
it('allows to delete product', {
    act: (actor) => actor.click(finder.getByRole('button', { name: 'Удалить' })),
});
```

Семантическая маркировка интерфейса помогает инкапсулировать детали реализации интерфейса от историй. Можно легко
присвоить роль и дополнительные атрибуты к ней любому из заданных компонентов.

:::note
Исключение составляют компоненты из сторонних библиотек, которые не всегда поддаются достаточному расширению.
:::

Рекомендуется предпочитать селекторы, оперирующие видимыми пользователем атрибутами. В основном это отображаемый
текст и роли.

## Компонентный подход

<MetricsTip improves={[Metric.Maintainability]} />

Любой UI интерфейс можно разбить на компоненты.

:::tip
Компонент - это элемент страницы реализующий в себе представление, поведение и модель взаимодействия.
:::

Такие элементы являются особенно полезными в контексте программирования, ведь их можно повторно использовать на разных
страницах, не повышая при этом сложность проекта. `storyshots` дополнительно эксплуатирует данный факт предоставляя
методы расширения для [`actor`](/API/story-elements/actor) и [`finder`](/API/story-elements/finder):

<p style={{ color: 'red' }}>Вместо этого:</p>

```tsx
const stories = [
    it('allows to delete user', {
        /**
         * В UserPage используется обычная кнопка удаления <button>Удалить</button>
         */
        act: (actor) => actor.click(finder.getByRole('button', { name: 'Удалить' })),
        render: () => <UserPage />,
    }),
    it('allows to delete product', {
        /**
         * В ProductsPage используется та же кнопка, но разработчики реализовали её иначе,
         * по какой-то причине: <div className="button">Удалить</div>
         */
        act: (actor) => actor.click(finder.locator('div.button').getByText('Удалить')),
        render: () => <ProductsPage />,
    }),
];
```

Из-за того что одинаковые для пользователя элементы реализованы по-разному, сами инструкции взаимодействия в историях
также отличаются.

<p style={{ color: 'green' }}>Делать это:</p>

```tsx
/**
 * За счёт использования компонентного подхода, селекторы между тестами также могут быть унифицированы
 */
const button = (name: string): FinderTransformer => (finder) => finder.getByRole('button', { name });

const stories = [
    it('allows to delete user', {
        act: (actor) => actor.click(finder.get(button('Удалить'))),
        render: () => <UserPage />,
    }),
    it('allows to delete product', {
        act: (actor) => actor.click(finder.get(button('Удалить'))),
        render: () => <ProductsPage />,
    }),
];
```

Можно пойти дальше и реализовать отдельный объект с селекторами, основываясь на компонентной системе используемой в
приложении:

```ts title="selectors.ts"
declare const button: FinderTransformer;

declare const modal: FinderTransformer;

/* и другие */
```

Расширять можно не только сами селекторы, но и целые действия:

```ts title="actions.ts"
declare const upload: ActorTransformer;

declare const dismiss: ActorTransformer;

/* и другие */
```

При следовании компонентному подходу и использовании методов расширения, можно существенным образом упростить истории:

```ts
it('allows to remove a user from list', {
    act: (actor) => actor
        .do(trash('Vasiliy'))
        .screenshot('ConfirmationWindow')
        .do(confirm())
});
```
