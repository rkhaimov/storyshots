import { test } from '../reusables/test';
import { preview } from '../reusables/preview';
import { openScreenshot, runStoryOrGroup, screenshot } from './actors';
import { FinderTransformer } from '@storyshots/core';

test('allows for role selector', {
  preview: preview().stories(({ it, createElement, finder, useState }) => [
    it('pets are great', {
      act: (actor) =>
        actor
          .click(finder.getByRole('checkbox', { name: 'Subscribe' }))
          .screenshot('Checkbox')
          .click(finder.getByRole('button', { name: 'Submit' }))
          .screenshot('Button'),
      render: () => {
        const [submitted, setSubmitted] = useState(false);

        if (submitted) {
          return createElement('h3', {}, 'Submitted');
        }

        return createElement(
          'div',
          {},
          createElement('h3', {}, 'Sign up'),
          createElement(
            'label',
            {},
            createElement('input', { type: 'checkbox' }),
            'Subscribe',
          ),
          createElement('br', {}),
          createElement(
            'button',
            { onClick: () => setSubmitted(true) },
            'Submit',
          ),
        );
      },
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'Checkbox');
    await screenshot(page);

    await openScreenshot(page, 'Button');
    await screenshot(page);
  },
});

test('allows for label selector', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) =>
        actor
          .fill(finder.getByLabel('Username'), 'Username')
          .fill(finder.getByLabel('Password'), 'Password')
          .fill(finder.getByRole('textbox', { name: 'Age' }), 'Age'),
      render: () =>
        createElement(
          'div',
          {},
          createElement('input', { 'aria-label': 'Username' }),
          createElement('label', { for: 'password-input' }, 'Password:'),
          createElement('input', { id: 'password-input' }),
          createElement('span', { id: 'age' }, 'Age'),
          createElement('input', { 'aria-labelledby': 'age' }),
        ),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');
    await screenshot(page);
  },
});

test('allows for placeholder selector', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) =>
        actor.fill(
          finder.getByPlaceholder('name@example.com'),
          'example@email.com',
        ),
      render: () =>
        createElement('input', {
          type: 'email',
          placeholder: 'name@example.com',
        }),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');
    await screenshot(page);
  },
});

test('allows for text selector', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) =>
        actor
          .fill(finder.getByText('world').getByRole('textbox'), 'world')
          .fill(
            finder.getByText('Hello world').getByRole('textbox'),
            'Hello world',
          )
          .fill(finder.getByText('Hello').at(1).getByRole('textbox'), 'Hello'),
      render: () =>
        createElement(
          'div',
          {},
          createElement('input', {}),
          createElement(
            'div',
            {},
            createElement('input', {}),
            'Hello ',
            createElement('div', {}, createElement('input', {}), 'world'),
          ),
          createElement('div', {}, createElement('input', {}), 'Hello'),
        ),
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('allows for alt selector', {
  preview: preview().stories(({ it, createElement, finder, useState }) => [
    it('pets are great', {
      act: (actor) => actor.click(finder.getByRole('image', { name: 'logo' })),
      render: () => {
        const [submitted, setSubmitted] = useState(false);

        if (submitted) {
          return createElement('h3', {}, 'Submitted');
        }

        return createElement('img', {
          alt: 'logo',
          onClick: () => setSubmitted(true),
        });
      },
    }),
  ]),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('allows for title selector', {
  preview: preview().stories(({ it, createElement, finder, useState }) => [
    it('pets are great', {
      act: (actor) => actor.click(finder.getByTitle('Issues count')),
      render: () => {
        const [submitted, setSubmitted] = useState(false);

        if (submitted) {
          return createElement('h3', {}, 'Submitted');
        }

        return createElement(
          'span',
          {
            title: 'Issues count',
            onClick: () => setSubmitted(true),
          },
          '25 issues',
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

test('allows for xpath or css selector', {
  preview: preview().stories(({ it, createElement, finder }) => {
    function byXPath(xpath: string): FinderTransformer {
      return (finder) => finder.getBySelector(`::-p-xpath(${xpath})`);
    }

    return [
      it('pets are great', {
        act: (actor) =>
          actor
            .fill(
              finder.getBySelector('#root > div > input:nth-child(1)'),
              'css',
            )
            .fill(
              finder.get(
                byXPath(
                  './/*[@id="root"]/div/input[(count(preceding-sibling::*)+1) = 2]',
                ),
              ),
              'xpath',
            ),
        render: () =>
          createElement(
            'div',
            {},
            createElement('input', {}),
            createElement('input', {}),
          ),
      }),
    ];
  }),
  test: async (page) => {
    await runStoryOrGroup(page, 'pets are great');

    await openScreenshot(page, 'FINAL');

    await screenshot(page);
  },
});

test('allows for filters', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) =>
        actor.fill(
          finder
            .getByRole('listitem')
            .has(finder.getByText('Product 2'))
            .getByRole('textbox'),
          'Product 2',
        ),
      render: () =>
        createElement(
          'ul',
          {},
          createElement(
            'li',
            {},
            createElement('h3', {}, 'Product 1'),
            createElement('input', {}),
          ),
          createElement(
            'li',
            {},
            createElement('h3', {}, 'Product 2'),
            createElement('input', {}),
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

test('allows for matching role with text content', {
  preview: preview().stories(({ it, createElement, finder, useState }) => [
    it('pets are great', {
      act: (actor) =>
        actor.click(
          finder.getByRole('listitem').has(finder.getByText('Product 2')),
        ),
      render: () => {
        const [submitted, setSubmitted] = useState(false);

        if (submitted) {
          return createElement('h3', {}, 'Submitted');
        }

        return createElement(
          'ul',
          {},
          createElement('li', {}, 'Product 1', createElement('input', {})),
          createElement(
            'li',
            { onClick: () => setSubmitted(true) },
            'Product 2',
            createElement('input', {}),
          ),
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

test('allows for matching inside locator', {
  preview: preview().stories(({ it, createElement, finder }) => [
    it('pets are great', {
      act: (actor) => {
        const form = finder
          .getByRole('listitem')
          .has(finder.getByText('Product 2'));

        return actor
          .fill(form.getByRole('textbox', { name: 'Name' }), 'Name')
          .fill(form.getByRole('textbox', { name: 'Age' }), 'Age');
      },
      render: () =>
        createElement(
          'ul',
          {},
          createElement('li', {}, 'Product 1', createElement('input', {})),
          createElement(
            'li',
            {},
            'Product 2',
            createElement('input', { 'aria-label': 'Name' }),
            createElement('input', { 'aria-label': 'Age' }),
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

test('allows for using multiple selectors by AND rule', {
  preview: preview().stories(({ it, createElement, finder, useState }) => [
    it('pets are great', {
      act: (actor) =>
        actor.click(
          finder
            .getByRole('button')
            .and(finder.getByTitle('Title of a button')),
        ),
      render: () => {
        const [submitted, setSubmitted] = useState(false);

        if (submitted) {
          return createElement('h3', {}, 'Submitted');
        }

        return createElement(
          'button',
          { title: 'Title of a button', onClick: () => setSubmitted(true) },
          'Create a project',
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

test('allows for chaining filters', {
  preview: preview().stories(({ it, createElement, finder, useState }) => [
    it('pets are great', {
      act: (actor) =>
        actor.click(
          finder
            .getByRole('listitem')
            .has(finder.getByText('Mary'))
            .has(finder.getByText('Say goodbye'))
            .getByRole('button'),
        ),
      render: () => {
        const [submitted, setSubmitted] = useState(false);

        if (submitted) {
          return createElement('h3', {}, 'Submitted');
        }

        return createElement(
          'ul',
          {},
          createElement(
            'li',
            {},
            'John',
            createElement('button', {}, 'Say goodbye'),
          ),
          createElement(
            'li',
            {},
            'Mary',
            createElement('button', {}, 'Say hello'),
          ),
          createElement(
            'li',
            {},
            'Mary',
            createElement(
              'button',
              { onClick: () => setSubmitted(true) },
              'Say goodbye',
            ),
          ),
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
