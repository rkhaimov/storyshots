import { finder, notImplemented } from '@storyshots/core';
import {
  body,
  Endpoint,
  endpoint,
  handle,
  map,
  native,
  override,
  record,
} from '@storyshots/msw-externals';
import { HttpResponse } from 'msw';
import {
  AddPetApiArg,
  AddPetApiResponse,
  FindPetsByStatusApiResponse,
  Pet,
} from '../../src/externals/pets-api';
import { arrange } from '../externals';
import { it } from '../preview/config';

export const stories = [
  it('renders empty list of pets', {
    arrange: arrange(setup(), withNoPets()),
  }),
  it('renders several pets', {
    arrange: arrange(setup(), withFewPets()),
  }),
  it('is able to add new pet', {
    arrange: arrange(setup(), withFewPets(), withAddingPetsEmulated()),
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
  return override({
    addPet: handle(() => native(new HttpResponse(null, { status: 406 }))),
  });
}

function withRetrievalError() {
  return override({
    findPetsByStatus: handle(() =>
      native(new HttpResponse(null, { status: 500 })),
    ),
  });
}

function withAddingPetsEmulated() {
  let transform = (pets: Pet[]) => pets;

  return override({
    findPetsByStatus: map((it) => transform(it)),
    addPet: handle(async (arg) => {
      const added: AddPetApiArg = await body(arg);

      transform = (pets) => [...pets, added];
    }),
  });
}

function withNoPets() {
  return override({ findPetsByStatus: handle(() => []) });
}

function withFewPets() {
  return override({
    findPetsByStatus: handle(() => [
      { name: 'Izi', tags: [{ name: 'smart' }], photoUrls: [] },
      { name: 'Izya', tags: [{ name: 'cutie' }], photoUrls: [] },
    ]),
  });
}

function setup() {
  return arrange(
    endpoint('findPetsByStatus', {
      url: '/api/pet/findByStatus',
      handle: () => notImplemented('findPetsByStatus'),
    }),
    endpoint('addPet', {
      url: '/api/pet',
      method: 'POST',
      handle: () => notImplemented('addPet'),
    }),
  );
}

declare module '@storyshots/msw-externals' {
  interface Endpoints {
    findPetsByStatus: Endpoint<FindPetsByStatusApiResponse>;
    addPet: Endpoint<AddPetApiResponse>;
  }
}
