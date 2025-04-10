# it

Часть семейства фабрик тестов. Создаёт пользовательскую историю, позволяя описать стадии инициализации, взаимодействия и
вызова AUT.

---

## retries

Определяет количество повторных попыток при неудаче для отдельно взятой истории. Принимает [StoryConfig](/API/story-elements/story-config).

:::note
Неудачей считается наличие разницы с текущим эталоном. В случае критической ошибки (например, отсутствия искомого
элемента), повторения не выполняются.
:::

```ts
it('...', {
    // Повторить тест до 3-х раз в случае неудачи. Только на мобильных устройствах.
    retries: (config) => config.device.name === 'mobile' ? 3 : 0,
});
```

## arrange

Подготавливает [внешние зависимости](/specification/requirements/env) для истории. Эта функция используется для подготовки необходимых данных или окружения
перед запуском истории.

```ts
it('...', {
    arrange: (externals) => ({
        ...externals,
        // Для текущей истории установить определённое поведение метода.
        getUser: async () => ({ name: 'John Doe', age: 25 }),
    })
});
```

Функция `arrange` также может использоваться для разметки методов для логирования с помощью [Journal](/API/story-elements/journal).

```ts
it('...', {
    arrange: (externals, { journal }) => ({
        ...externals,
        getUser: journal.asRecordable('getUser', externals.getUser)
    })
});
```

Также может использоваться для хранения временного состояния в контексте истории:

```ts
it('...', {
    arrange: (externals, { journal }) => {
        // count сохранится в контексте работающей истории.
        const count = 0;

        return {
            increment: () => count += 1,
            get: () => count,
        };
    }
});
```

:::note
В функции `arrange` не должно происходить никаких [сайд-эффектов](/specification/requirements/storage#сайд-эффект), это позволяет:

* Автоматически сбрасывать и повторно инициализировать состояние при перезапуске истории.
* Полностью изолировать состояние от других историй.
  :::

## act

Описывает действия, выполняемые в истории с помощью [актора](/API/story-elements/actor). Данная функция эмулирует действия пользователя, такие
как нажатие на кнопки, отправка форм и так далее.

```ts
it('...', {
    act: (actor) => actor.click(finder.getByText('Войти'))
});
```

## render

Данная функция и есть AUT. Для `react`-приложения представляет собой функцию, возвращающую корневой элемент.

```tsx
it('...', {
    // Рендерит компонент UserProfile, используя подготовленные данные из externals.
    render: (externals) => <UserProfile externals={externals} />
});
```

:::note
Метод актуален для модуля [`@storyshots/react`](/modules/react).
:::
