import { UnknownArrangers } from '../arrangers-types';

export const arrange: UnknownArrangers['arrange'] = (...arrangers) =>
  arrangers.reduce(
    (arrange, curr) => (externals, config) =>
      curr(arrange(externals, config), config),
    (externals) => externals,
  );
