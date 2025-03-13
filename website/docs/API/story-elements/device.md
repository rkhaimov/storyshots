# Device

Устройство, в рамках которого запускается тест.

Пример `desktop` устройства:

```ts
const desktop: Device = {
  name: 'desktop',
  width: 1480,
  height: 920,
};
```

Пример `mobile` устройства:

```ts
const mobile: Device = {
  name: 'mobile',
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
  width: 414,
  height: 896,
  deviceScaleFactor: 3,
};
```

:::tip
Список возможных устройств можно найти [здесь](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json).
:::
