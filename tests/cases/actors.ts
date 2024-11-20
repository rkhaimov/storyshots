import { Page } from 'playwright';
import { expect } from '@playwright/test';

export function toggleConfigPane(page: Page) {
  return page.getByLabel('Toggle config pane').click();
}

export function openStoryOrGroup(page: Page, title: string) {
  return page.getByText(title).click();
}

export async function runStoryOrGroup(page: Page, story: string) {
  await page.getByLabel(story).hover();

  await page.getByLabel(story).getByLabel('Run', { exact: true }).click();

  await page
    .getByLabel('Status')
    .getByLabel('loading')
    .waitFor({ state: 'detached' });
}

export async function runAll(page: Page) {
  await page.getByRole('button', { name: 'Run', exact: true }).click();

  await page
    .getByLabel('Status')
    .getByLabel('loading')
    .waitFor({ state: 'hidden' });
}

export async function runStoryOrGroupComplete(page: Page, story: string) {
  await page.getByLabel(story).hover();

  await page.getByLabel(story).getByLabel('Run complete').click();

  await page
    .getByLabel('Status')
    .getByLabel('loading')
    .waitFor({ state: 'hidden' });
}

export function screenshot(page: Page) {
  return expect(page).toHaveScreenshot();
}

export function openRecords(page: Page, at = 0) {
  return page.getByText('Records').nth(at).click();
}

export function openScreenshot(page: Page, label: string, at = 0) {
  return page.getByText(label).nth(at).click();
}

export function acceptActiveSnapshot(page: Page) {
  return page.getByRole('button').getByText('Accept').click();
}

export async function acceptStoryOrGroup(page: Page, story: string) {
  await page.getByLabel(story, { exact: true }).hover();

  await page.getByRole('button', { name: 'Accept all' }).click();

  await page
    .getByTitle(story, { exact: true })
    .getByLabel('check')
    .waitFor({ state: 'visible' });
}
