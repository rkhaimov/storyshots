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
    console.log(error);

    if (error instanceof Error) {
      return { type: 'error', message: error.message };
    }

    return {
      type: 'error',
      message: 'Unknown exception occurred. Check terminal for more info',
    };
  }
}
