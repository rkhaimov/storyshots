import { body, native } from '@storyshots/msw-externals';
import { finder } from '@storyshots/core';
import { HttpResponse } from 'msw';
import { AddPetApiArg, Pet } from '../../src/externals/pets-api';
import { it } from '../preview/config';
import { arrange, handle, record } from './arrangers';
import { setup } from './setup';

export const stories = [
  it('renders empty list of pets', {
    arrange: arrange(setup(), withNoPets()),
  }),
  it('renders several pets', {
    arrange: arrange(setup(), withFewPets()),
  }),
  it('is able to add new pet', {
    arrange: arrange(setup(), withAddingPetsEmulated()),
    act: (actor) =>
      actor.click(finder.getByRole('button', { name: 'Add a pet' })),
  }),
  it('handles internal server error', {
    arrange: arrange(setup(), withRetrievalError()),
  }),
  it('handles adding error', {
    arrange: arrange(
      setup(),
      withNoPets(),
      withAddingError(),
      record('addPet'),
    ),
    act: (actor) =>
      actor
        .click(finder.getByRole('button', { name: 'Add a pet' }))
        .screenshot('Error')
        .click(finder.getByRole('button', { name: 'OK' })),
  }),
];

function withAddingError() {
  return handle('addPet', () =>
    native(new HttpResponse(null, { status: 406 })),
  );
}

function withRetrievalError() {
  return handle('findPetsByStatus', () =>
    native(new HttpResponse(null, { status: 500 })),
  );
}

function withAddingPetsEmulated() {
  let pets: Pet[] = [];

  return arrange(
    handle('findPetsByStatus', () => pets),
    handle('addPet', async (arg) => {
      const added: AddPetApiArg = await body(arg);

      pets = [...pets, added];
    }),
  );
}

function withNoPets() {
  return handle('findPetsByStatus', () => []);
}

function withFewPets() {
  return handle('findPetsByStatus', () => [
    { name: 'Izi', tags: [{ name: 'smart' }], photoUrls: [] },
    { name: 'Izya', tags: [{ name: 'cutie' }], photoUrls: [] },
  ]);
}
