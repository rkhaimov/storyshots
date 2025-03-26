export function toManagerURL<T extends string | URL>(url: T): T {
  if (typeof url === 'string') {
    return (
      url.includes('?')
        ? `${url}&manager=${MANAGER_UNIQ_KEY}`
        : `${url}?manager=${MANAGER_UNIQ_KEY}`
    ) as T;
  }

  url.searchParams.set('manager', MANAGER_UNIQ_KEY);

  return url;
}

export const MANAGER_UNIQ_KEY = 'SECRET';
