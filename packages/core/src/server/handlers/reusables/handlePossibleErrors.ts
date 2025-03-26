import { WithPossibleError } from '../../../reusables/types';

export async function handlePossibleErrors<T>(
  func: () => Promise<T>,
): Promise<WithPossibleError<T>> {
  try {
    return {
      type: 'success',
      data: await func(),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { type: 'error', message: error.message };
    }

    console.log(error);

    return {
      type: 'error',
      message:
        'Unknown kind of exception has occurred. Check your terminal for more info',
    };
  }
}
