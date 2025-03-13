# only

Делает историю доступной только для определённых устройств:

```ts
// userStories будут доступны для запуска только на desktop устройствах
only(['desktop'], userStories);
```

:::note
`only` можно накладывать друг на друга:

```ts
only(['mobile'], only(['desktop'], userStories));
```

Если в проекте определены только `mobile` и `desktop` устройства, то в таком случае `userStories` будут исключены
в принципе.
:::