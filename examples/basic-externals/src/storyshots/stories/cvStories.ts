import { finder } from '@storyshots/core';
import { describe, it } from '../preview/config';
import { open } from './utils/actors';

export const cvStories = describe('CV', [
  it('renders all fields as empty by default', {
    act: (actor, device) => {
      if (device.name === 'mobile') {
        return actor
          .do(open('CV'))
          .screenshot('Top')
          .scrollTo(finder.getByRole('button', { name: 'Register' }));
      }

      return actor.do(open('CV'));
    },
  }),
  it('lets all of its fields to be filled', {
    act: (actor) =>
      actor
        .do(open('CV'))
        .fill(finder.getByPlaceholder('example@site.com'), 'hello@world.com')
        .fill(finder.getByLabel('Password', { exact: true }), '123pppq@33p')
        .fill(finder.getByLabel('Confirm Password'), '123pppq@33p')
        .fill(finder.getByLabel('Nickname'), 'ha4ker')
        .click(finder.getByRole('combobox', { name: 'Residence' }))
        .click(finder.getByText('Zhejiang'))
        .click(finder.getByText('Hangzhou'))
        .click(finder.getByText('West Lake'))
        .click(finder.getByRole('combobox', { name: 'Country code' }))
        .click(finder.getByText('+86'))
        .fill(finder.getByLabel('Phone Number'), '(800) 555-35-35')
        .fill(finder.getByLabel('Donation'), '300')
        .click(finder.getByRole('combobox', { name: 'Currency' }))
        .click(finder.getByText('$'))
        .fill(finder.getByLabel('Website'), 'hello')
        .click(finder.getByText('hello.com').nth(1))
        .clear(finder.getByLabel('Intro'))
        .fill(finder.getByLabel('Intro'), 'A little about myself')
        .click(finder.getByRole('combobox', { name: 'Gender' }))
        .click(finder.getByText('Other'))
        .fill(finder.getByLabel('Captcha'), 'not a robot')
        .click(finder.getByText('I have read the'))
        .screenshot('Filled')
        .click(finder.getByRole('button', { name: 'Register' }))
        .screenshot('Popup')
        .click(
          finder
            .getByRole('dialog')
            .filter({ has: finder.getByText('notification message') })
            .getByRole('button', { name: 'OK' }),
        ),
  }),
  it('checks validity of an email that was entered', {
    act: (actor) =>
      actor
        .do(open('CV'))
        .fill(finder.getByPlaceholder('example@site.com'), 'hello@')
        .screenshot('NoDomain')
        .fill(finder.getByPlaceholder('example@site.com'), 'world')
        .screenshot('NoLang'),
  }),
  it('ensures entered passwords match', {
    act: (actor) =>
      actor
        .do(open('CV'))
        .fill(finder.getByLabel('Password', { exact: true }), '123pppq@33p')
        .fill(finder.getByLabel('Confirm Password'), '123pppq@'),
  }),
  it('lets to select residence', {
    act: (actor) =>
      actor
        .do(open('CV'))
        .click(finder.getByRole('combobox', { name: 'Residence' }))
        .click(finder.getByText('Zhejiang'))
        .click(finder.getByText('Hangzhou'))
        .screenshot('Prefilled')
        .click(finder.getByText('West Lake'))
        .click(finder.getByRole('combobox', { name: 'Residence' }), {
          force: true,
        }),
  }),
  it('provides certain tips', {
    act: (actor) =>
      actor
        .do(open('CV'))
        .hover(finder.getByRole('img', { name: 'question-circle' }))
        .wait(100),
  }),
]);
