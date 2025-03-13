# Finder

Специальный объект для конструирования селекторов.

---

## getByRole

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-role)

## getByText

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-text)

## getByLabel

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-label)

## getByPlaceholder

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-placeholder)

## getByAltText

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-alt-text)

## getByTitle

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-get-by-title)

## locator

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-locator)

## filter

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-filter)

## nth

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-nth)

## first

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-first)

## last

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-last)

## and

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-and)

## get

Позволяет расширять селекторы используя специальные трансформеры:

```ts
function byButtonSeverity(severity: string): FinderTransformer {
  return (finder) => finder.get('button').filter({ hasText: severity })
}

finder.get(byButtonSeverity('error')) // <button class="error">Error</button>
```
