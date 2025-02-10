import { generateEndpoints } from '@rtk-query/codegen-openapi';

void main();

async function main() {
  await generateEndpoints({
    apiFile: './src/externals/api.ts',
    outputFile: './src/externals/pets-api.ts',
    hooks: {
      queries: true,
      mutations: true,
      lazyQueries: false,
    },
    filterEndpoints: (operation) =>
      ['addPet', 'findPetsByStatus'].includes(operation),
    tag: true,
    flattenArg: true,
    schemaFile: 'https://petstore.swagger.io/v2/swagger.json',
  });
}
