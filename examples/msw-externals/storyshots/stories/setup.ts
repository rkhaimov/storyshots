import { Endpoint } from '@storyshots/msw-externals';
import { arrange, endpoint } from './arrangers';

import {
  AddPetApiResponse,
  FindPetsByStatusApiResponse,
} from '../../src/externals/pets-api';

export function setup() {
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

function notImplemented(method: string): never {
  throw new Error(`${method} is not implemented`);
}
