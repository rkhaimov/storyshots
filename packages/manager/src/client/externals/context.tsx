import React, { PropsWithChildren, useContext } from 'react';
import { IExternals } from './types';

const Context = React.createContext<IExternals>(undefined as never);

type Props = PropsWithChildren<{
  externals: IExternals;
}>;

export const ExternalsProvider: React.FC<Props> = ({ externals, children }) => (
  <Context.Provider value={externals}>{children}</Context.Provider>
);

export const useExternals = () => useContext(Context);
