# map

Трансформирует аттрибуты [истории](/specification/requirements/borders):

```ts
map(stories, (story) => ({
    ...story,
    // Добавить начальное действие для каждой из историй
    act: (actor, config) => story.act(actor.do(login()), config),
}));
```

Можно изменить любое свойство историй:

```ts
map(stories, (story) => ({
    ...story,
    // Донастроить внешнюю среду
    arrange: (externals, config) => withDarkTheme(story.arrange(externals, config)),
}));
```

:::tip
`map` также используется для установки [render функции по умолчанию](/patterns/stories#универсальный-render).
:::
