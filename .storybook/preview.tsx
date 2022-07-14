import '../src/styles/globals.scss'
import { theme } from '../src/styles/theme';
import { ThemeProvider } from '@emotion/react';
import LazyLoad from 'vanilla-lazyload';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  nextRouter: {
    query: {
      foo: 'this-is-a-global-override',
    },
  },
}

const Context = React.createContext<any>({});

export const decorators = [
  (Story) => (
    <Context.Provider value={{lazyImage: typeof window === 'undefined' ? null : new LazyLoad({ 'elements_selector': '.aplus-lazy',  unobserve_entered: true, })}}>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={new QueryClient}>
        <Story />
      </QueryClientProvider>
    </ThemeProvider>
    </Context.Provider>
  ),
]