export function createManagerRequest(url: string) {
  return url.includes('?') ? `${url}&manager=SECRET` : `${url}?manager=SECRET`;
}
