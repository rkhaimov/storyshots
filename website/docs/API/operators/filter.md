# filter

Отсеивает [истории](/specification/requirements/borders) не удовлетворяющие предикату:

```ts
// Оставляем истории в тексте которых упоминается user
filter(stories, (story) => story.title.includes('user'));
```

:::note
`filter` также отсеивает пустые группы.
:::

:::tip
Основная область применения `filter` - это отсеивание историй по [пользовательским аттрибутам](/patterns/stories#приоритеты-историй).
:::
