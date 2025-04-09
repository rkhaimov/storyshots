# Actor

Актор представляет собой [пользователя](/specification/requirements/user). Осуществляет взаимодействие с приложением эмулируя действия на странице.

---

## hover

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-hover)

## click

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-click)

## fill

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-fill)

## wait

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-frame#frame-wait-for-timeout)

:::warning Внимание
Данный метод предназначен исключительно для отладки.
:::

## scrollTo

Использует оригинальный метод
[`playwright`](https://playwright.dev/docs/api/class-locator#locator-scroll-into-view-if-needed)

## select

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-select-option)

## press

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-keyboard#keyboard-press)

## down

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-keyboard#keyboard-down)

## up

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-keyboard#keyboard-up)

## clear

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-clear)

## highlight

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-highlight)

:::warning Внимание
Данный метод предназначен исключительно для отладки.
:::

## drag

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-drag-to)

## blur

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-blur)

## pressSequentially

Использует оригинальный метод [`playwright`](https://playwright.dev/docs/api/class-locator#locator-press-sequentially)

## screenshot

Осуществляет промежуточные снимки во время действий на странице.

:::note
Если вызывается последним в цепочке - переопределяет параметры последнего снимка создаваемого по умолчанию.
:::

:::warning Внимание
Наименование снимка должно содержать только латинские символы, так как оно используется в качестве наименований файлов в
эталоне. Использование специальных символов также запрещено.
:::

```ts
actor
    // Сделать снимок начального состояния формы
    .screenshot('Initial')
    .do(fillForm())
    // Назвать конечный снимок как Filled
    .screenshot('Filled')
```

### Маскирование

На снимках можно маскировать элементы, это может быть полезно при работе с динамически изменяемыми данными:

```ts
actor
    .do(fillForm())
    // Маскируем компонент отображающий время
    .screenshot('Filled', { mask: [finder.get(appClock())] })
```

:::warning Внимание
Данное свойство рекомендуется применять как можно реже, так как оно снижает защиту от регресса. Следует отдавать
предпочтение [иным методам](/patterns/replace) подмены [внешней среды](/specification/requirements/env).
:::

## uploadFile

Загружает один или несколько файлов в целевой элемент:

```ts
actor
    .uploadFile(finder.get(uploadTrigger()), 'path/to/file_0.ext', 'path/to/file_1.ext')
```

:::note
Первым аргументом `uploadFile` принимает элемент, по клику на который открывается проводник файлов для загрузки.
:::

:::tip
Путь к файлам считается относительно рабочей директории проекта. Поэтому рекомендуется для простоты располагать их в
одном месте:

```ts
function getPath(file: string) {
    return path.join(process.cwd(), 'src', 'storyshots', 'externals', 'stub-files', file);
}

actor
    .uploadFile(finder.get(uploadTrigger()), getPath('file_1.ext'), getPath('file_2.ext'))
```

:::

## do

Позволяет расширять действия пользователя используя специальные трансформеры:

```ts
function enterCredentials(): ActorTransformer {
    return (actor) => actor
        .fill(finder.getByRole('username'), 'user')
        .fill(finer.getByRole('password'), 'pass')
}

actor.do(enterCredentials())
```

## stop

Останавливает выполнение всех последующих действий:

```ts
actor
    .hover() // Выполнится
    .stop() // После данной точки, все последующие действия не будут выполнены
    .click()
    .fill()
```

:::warning Внимание
Данный метод предназначен исключительно для отладки.
:::

## exec

Вызывает переданную функцию в контексте страницы.

```ts
actor
    .do(submit())
    // Будет выполнен сразу после submit
    .exec(() => window.tick(5_000))
    .screenshot('Hidden')
```

:::note
Основная область применения - [перемотка времени](/modules/web-api).
:::

:::warning Внимание
Функции, передаваемые в `exec` не могут иметь [внешних зависимостей](/specification/requirements/env) за исключением объекта `window`.
:::
