import React, { PropsWithChildren, useContext } from 'react';
import { IWebDriver } from '../../reusables/types';

const Context = React.createContext<IWebDriver>(undefined as never);

type Props = PropsWithChildren<{
  driver: IWebDriver;
}>;

export const DriverProvider: React.FC<Props> = ({ driver, children }) => (
  <Context.Provider value={driver}>{children}</Context.Provider>
);

export const useDriver = () => useContext(Context);
