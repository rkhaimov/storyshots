# describe

Часть семейства фабрик тестов. Оборачивает истории в семантическую группу.

```ts
export const loginStories = describe('Login', [
    it('renders login form', /* ... */),
    it('displays error on invalid credentials', /* ... */),
    describe('Authentication Flow', [
        it('successfully logs in with valid credentials', /* ... */),
        it('displays loading spinner during authentication', /* ... */),
    ]),
]);
```
