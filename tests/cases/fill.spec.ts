import { test } from '../reusables/test';
import { preview } from '../reusables/preview';
import { runStoryOrGroup, screenshot } from './actors';

test('does not allow to fill disabled fields', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) =>
        actor
          .fill(finder.getByPlaceholder('Пароль'), '1234')
          .fill(
            finder.getByPlaceholder('Повторите пароль'),
            'mysuperstrongpassword',
          ),
      render: () =>
        createElement(
          'div',
          {},
          createElement('input', { type: 'password', placeholder: 'Пароль' }),
          createElement('input', {
            type: 'password',
            placeholder: 'Повторите пароль',
            disabled: true,
          }),
        ),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');
    await page.getByLabel('Progress').click();
    await screenshot(page);
  },
});
