import { finder } from '../../../src/client';
import { describe, it } from '../../storyshots/preview/config';

export const cvStories = describe('CV', [
  it('renders all fields as empty by default', {
    act: (actor) =>
      actor.click(finder.getByRole('button', { name: 'Navigate' }).at(1)),
  }),
  it('lets all of its fields to be filled', {
    act: (actor) =>
      actor
        .click(finder.getByRole('button', { name: 'Navigate' }).at(1))
        .fill(finder.getByPlaceholder('example@site.com'), 'hello@world.com')
        .fill(finder.getByLabel('Password'), '123pppq@33p')
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
        .click(finder.getByText('hello.com').at(1))
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
            .has(finder.getByText('notification message'))
            .getByRole('button', { name: 'OK' }),
        ),
  }),
  it('checks validity of an email that was entered', {
    act: (actor) =>
      actor
        .click(finder.getByRole('button', { name: 'Navigate' }).at(1))
        .fill(finder.getByPlaceholder('example@site.com'), 'hello@'),
  }),
  it('ensures entered passwords match', {
    act: (actor) =>
      actor
        .click(finder.getByRole('button', { name: 'Navigate' }).at(1))
        .fill(finder.getByLabel('Password'), '123pppq@33p')
        .fill(finder.getByLabel('Confirm Password'), '123pppq@'),
  }),
  it('lets to select residence', {
    act: (actor) =>
      actor
        .click(finder.getByRole('button', { name: 'Navigate' }).at(1))
        .click(finder.getByRole('combobox', { name: 'Residence' }))
        .click(finder.getByText('Zhejiang'))
        .click(finder.getByText('Hangzhou'))
        .screenshot('Prefilled')
        .click(finder.getByText('West Lake'))
        .click(finder.getByRole('combobox', { name: 'Residence' })),
  }),
  it('provides certain tips', {
    act: (actor) =>
      actor
        .click(finder.getByRole('button', { name: 'Navigate' }).at(1))
        .hover(finder.getByRole('image', { name: 'question-circle' }))
        .wait(100),
  }),
]);
