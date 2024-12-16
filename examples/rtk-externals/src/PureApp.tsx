import { configureStore } from '@reduxjs/toolkit';
import { App, ConfigProvider, ThemeConfig } from 'antd';
import React from 'react';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { api } from './externals/api';
import { Main } from './pages/main';

type Props = { theme?: ThemeConfig };

export const PureApp: React.FC<Props> = (props) => (
  <App>
    <ConfigProvider theme={props.theme}>
      <GlobalStyle />
      <Provider store={store}>
        <Main />
      </Provider>
    </ConfigProvider>
  </App>
);

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
    }

    body, html, #root, .ant-app {
        height: 100%;
    }
`;
