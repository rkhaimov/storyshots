export function shouldNeverBeCalled(): never {
    throw new Error('Should not be called');
}