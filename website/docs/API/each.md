# each

Часть семейства фабрик тестов. Генерирует истории исходя из переданного списка значений.

```ts
export const statusStories = each(
    ['Online', 'Offline', 'Busy'],
    (status) => it(`shows user status as ${status}`),
);
```