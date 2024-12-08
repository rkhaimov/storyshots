import { it } from './it';
import { createAPI } from './createAPI';

void tests();

async function tests() {
  await it('generates no args get request', async (u) => {
    using api = await createAPI(u, './no-args-get.json', {
      getApiUssBusinessDirections: (input) => {
        u.toMatchSnapshot('Input', input);

        return [];
      },
    });

    u.toMatchSnapshot('Output', await api.fetch('/api/uss/BusinessDirections'));
  });
}
