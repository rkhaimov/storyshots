import { Frame } from 'playwright';

export function getActualRecords(preview: Frame) {
  return preview.page().evaluate(() => window.getJournalRecords());
}
