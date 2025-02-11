import { Frame } from 'playwright';

export function getActualRecords(preview: Frame) {
  return preview.evaluate(() => window.getJournalRecords());
}
