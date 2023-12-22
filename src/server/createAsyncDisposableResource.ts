import { Observable } from 'rxjs';

export function createAsyncDisposableResource<T>(
  create: () => Promise<[T, () => void]>,
): Observable<T> {
  return new Observable<T>((subscriber) => {
    let cleanup = () => {};

    create().then(([resource, teardown]) => {
      if (subscriber.closed) {
        teardown();
      } else {
        cleanup = teardown;

        subscriber.next(resource);
      }
    });

    return () => cleanup();
  });
}
