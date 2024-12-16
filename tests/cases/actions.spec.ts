import { test } from '../reusables/test';
import { preview } from '../reusables/preview';
import { openScreenshot, runStoryOrGroup, screenshot } from './actors';

test('can fill inputs from scratch', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) => actor.fill(finder.getByRole('textbox'), 'Entered value'),
      render: () => createElement('input', {}),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('can clear input value and refills it from scratch', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) =>
        actor
          .fill(finder.getByRole('textbox'), 'Old value')
          .clear(finder.getByRole('textbox'))
          .fill(finder.getByRole('textbox'), 'New value'),
      render: () => createElement('input', {}),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

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

test('able to fill dates', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) => actor.fill(finder.getByRole('Date'), '14-10-2024'),
      render: () => createElement('input', { type: 'date' }),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('able to click on checkboxes', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) => actor.click(finder.getByLabel('I agree with everything')),
      render: () =>
        createElement(
          'label',
          {},
          'I agree with everything',
          createElement('input', { type: 'checkbox' }),
        ),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('able to click on radios', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) => actor.click(finder.getByLabel('Male')),
      render: () =>
        createElement(
          'div',
          {},
          'Select your gender:',
          createElement(
            'label',
            {},
            'Female',
            createElement('input', { type: 'radio' }),
          ),
          createElement(
            'label',
            {},
            'Male',
            createElement('input', { type: 'radio' }),
          ),
        ),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('able to select an option', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) => actor.select(finder.getByRole('combobox'), 'both'),
      render: () =>
        createElement(
          'select',
          {},
          createElement('option', { value: 'dog' }, 'dog'),
          createElement('option', { value: 'cat' }, 'cat'),
          createElement('option', { value: 'both' }, 'both'),
        ),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('able to select multiple options', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) => actor.select(finder.getByRole('listbox'), 'dog', 'cat'),
      render: () =>
        createElement(
          'select',
          { multiple: true },
          createElement('option', { value: 'dog' }, 'dog'),
          createElement('option', { value: 'cat' }, 'cat'),
          createElement('option', { value: 'alien' }, 'alien'),
        ),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('can do single click', {
  preview: preview().stories(({ it, createElement, finder, useState }) => [
    it('pets are great', {
      act: (actor) => actor.click(finder.getByRole('button')),
      render: () => {
        const [submitted, setSubmitted] = useState(false);

        if (submitted) {
          return createElement('h3', {}, 'Submitted');
        }

        return createElement(
          'button',
          { onClick: () => setSubmitted(true) },
          'Submit',
        );
      },
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('can do double click', {
  preview: preview().stories(({ it, createElement, finder, useState }) => [
    it('pets are great', {
      act: (actor) => actor.click(finder.getByRole('button'), { count: 2 }),
      render: () => {
        const [submitted, setSubmitted] = useState(false);

        if (submitted) {
          return createElement('h3', {}, 'Submitted');
        }

        return createElement(
          'button',
          { onDoubleClick: () => setSubmitted(true) },
          'Submit',
        );
      },
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('can do right mouse button click', {
  preview: preview().stories(({ it, createElement, finder, useState }) => [
    it('pets are great', {
      act: (actor) =>
        actor.click(finder.getByRole('button'), { button: 'right' }),
      render: () => {
        const [submitted, setSubmitted] = useState(false);

        if (submitted) {
          return createElement('h3', {}, 'Submitted');
        }

        return createElement(
          'button',
          {
            onContextMenu: (e: MouseEvent) => {
              e.preventDefault();

              setSubmitted(true);
            },
          },
          'Submit',
        );
      },
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('can hover an element', {
  preview: preview().stories(({ it, createElement, finder, useState }) => [
    it('pets are great', {
      act: (actor) => actor.hover(finder.getBySelector('span')),
      render: () => {
        const [submitted, setSubmitted] = useState(false);

        if (submitted) {
          return createElement('h3', {}, 'Submitted');
        }

        return createElement(
          'span',
          { onMouseOver: () => setSubmitted(true) },
          'Example text',
        );
      },
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('allows to upload files', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) =>
        actor.uploadFile(finder.getByRole('button'), '/stub-files/PI.png'),
      render: () => createElement('input', { type: 'file' }),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('allows to upload multiple files', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) =>
        actor.uploadFile(
          finder.getByRole('button'),
          '/stub-files/PI.png',
          '/stub-files/tree.jpg',
        ),
      render: () => createElement('input', { type: 'file', multiple: true }),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('allows to scroll an element into view', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) => actor.scrollTo(finder.getByText('World')),
      render: () =>
        new Array(100)
          .fill(null)
          .map((_, index, all) =>
            index === all.length - 1
              ? createElement('h1', {}, 'World')
              : createElement('h1', {}, 'Hello'),
          ),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});
