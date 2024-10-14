import { PreviewBuilder } from '../reusables/preview';

export function withMobileDevice<T>(pb: PreviewBuilder<T>) {
  return pb
    .devices(() => [
      {
        type: 'size-only',
        name: 'desktop',
        config: { width: 1480, height: 920 },
      },
      {
        type: 'emulated',
        name: 'mobile',
        config: {
          userAgent: 'iphone',
          width: 414,
          height: 896,
        },
      },
    ])
    .externals(() => ({
      createExternals: ({ device }) => ({
        isMobile: () => device.name === 'mobile',
      }),
      createJournalExternals: ({ isMobile }) => ({ isMobile }),
    }));
}

export function withCommandSample<T>(pb: PreviewBuilder<T>) {
  return pb.externals<{ pet(name: string): void }>(() => ({
    createExternals: () => ({
      pet: () => {},
    }),
    createJournalExternals: ({ pet }, { journal }) => ({
      pet: journal.record('pet', pet),
    }),
  }));
}

export function withLotsOfStories<T>(pb: PreviewBuilder<T>) {
  return pb.stories(({ it, describe, createElement }) => [
    it('pets are great', {
      render: () => createElement('p', {}, 'Some facts proving this statement'),
    }),
    describe('Cats', [
      it('in general are small', {
        render: () =>
          createElement('h1', {}, 'Image showing that cats are small'),
      }),
      describe('Daily', [
        it('during day cats love to play around', {
          render: () => createElement('h1', {}, 'Cats playground'),
        }),
      ]),
      describe('Nightly', []),
    ]),
    describe('Dogs', [
      it('loves to play with toys', {
        render: () => createElement('h1', {}, 'Dogs playground'),
      }),
    ]),
  ]);
}
