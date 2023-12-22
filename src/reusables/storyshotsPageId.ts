// Page ID received from client
export type StoryshotsPageId = number & {
  __StoryshotsPageId: 'StoryshotsPageId';
};

export function generateStoryshotsPageId() {
  return new Date().getTime() as StoryshotsPageId;
}

export function parseStoryshotsPageId(input: string) {
  return parseInt(input) as StoryshotsPageId;
}
