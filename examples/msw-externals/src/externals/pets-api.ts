import { api } from './api';

export const addTagTypes = ['pet'] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      addPet: build.mutation<AddPetApiResponse, AddPetApiArg>({
        query: (queryArg) => ({ url: `/pet`, method: 'POST', body: queryArg }),
        invalidatesTags: ['pet'],
      }),
      findPetsByStatus: build.query<
        FindPetsByStatusApiResponse,
        FindPetsByStatusApiArg
      >({
        query: (queryArg) => ({
          url: `/pet/findByStatus`,
          params: {
            status: queryArg,
          },
        }),
        providesTags: ['pet'],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type AddPetApiResponse = unknown;
export type AddPetApiArg =
  /** Pet object that needs to be added to the store */ Pet;
export type FindPetsByStatusApiResponse =
  /** status 200 successful operation */ Pet[];
export type FindPetsByStatusApiArg =
  /** Status values that need to be considered for filter */ (
    | 'available'
    | 'pending'
    | 'sold'
  )[];
export type Category = {
  id?: number;
  name?: string;
};
export type Tag = {
  id?: number;
  name?: string;
};
export type Pet = {
  id?: number;
  category?: Category;
  name: string;
  photoUrls: string[];
  tags?: Tag[];
  /** pet status in the store */
  status?: 'available' | 'pending' | 'sold';
};
export const { useAddPetMutation, useFindPetsByStatusQuery } = injectedRtkApi;
