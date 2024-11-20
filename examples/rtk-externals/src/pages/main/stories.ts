import { finder } from '@storyshots/core';
import { createErrorHTTPResponse } from '@storyshots/rtk-externals';
import { Pet } from '../../externals/pets-api';
import { it } from '../../storyshots/preview/config';

export const stories = [
  it('renders empty list of pets', {}),
  it('renders several pets', {
    arrange: (externals) => ({
      ...externals,
      findPetsByStatus: async () => [
        { name: 'Izi', tags: [{ name: 'smart' }], photoUrls: [] },
        { name: 'Izya', tags: [{ name: 'cutie' }], photoUrls: [] },
      ],
    }),
  }),
  it('is able to add new pet', {
    arrange: (externals) => {
      let transform = (pets: Pet[]) => pets;

      return {
        ...externals,
        addPet: async (payload) => {
          transform = (pets) => [...pets, payload];
        },
        findPetsByStatus: async () =>
          transform([
            { name: 'Izi', tags: [{ name: 'smart' }], photoUrls: [] },
            { name: 'Izya', tags: [{ name: 'cutie' }], photoUrls: [] },
          ]),
      };
    },
    act: (actor) =>
      actor.click(finder.getByRole('button', { name: 'Add a pet' })),
  }),
  it('handles internal server error', {
    arrange: (externals) => ({
      ...externals,
      findPetsByStatus: async () => createErrorHTTPResponse({ status: 500 }),
    }),
  }),
  it('handles adding error', {
    arrange: (externals) => ({
      ...externals,
      addPet: async () => createErrorHTTPResponse({ status: 406 }),
    }),
    act: (actor) =>
      actor
        .click(finder.getByRole('button', { name: 'Add a pet' }))
        .screenshot('Error')
        .click(finder.getByRole('button', { name: 'OK' })),
  }),
];
