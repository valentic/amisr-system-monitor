import React from 'react'
import { StoreProvider } from 'easy-peasy'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { ColorSchemeProvider } from '@mantine/core'
import { useToggle } from '@mantine/hooks'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

import { GlobalStyles } from './styles'
import { MultiProvider } from '~/support/helpers'

import { store } from '~/store'
import { App, AuthProvider } from '~/app'

const Program = () => {

    const [ colorScheme, toggleColorScheme ] = useToggle(['light', 'dark'])

    const theme = {

        globalStyles: GlobalStyles,

        colors: {
         slate: [ '#e7f3ff', '#c9d7e9', '#aabdd5', '#89a2c3', '#6888b1',
                  '#4e6e97', '#3c5676', '#2a3d55', '#172536', '#040c18' ]
        },

        primaryColor: 'slate',
        colorScheme: colorScheme,

        headings: {
          color: 'red'
        }
    }

    const queryClient = new QueryClient()

    const providers = [
        <React.StrictMode />,
        <StoreProvider store={store} />,
        <BrowserRouter basename={import.meta.env.VITE_ROOT_URL} />,
        <ColorSchemeProvider 
            colorScheme={colorScheme} 
            toggleColorScheme={toggleColorScheme} 
        />,
        <MantineProvider withNormalizeCSS withGlobalStyles theme={theme} />,
        <ModalsProvider />,
        <QueryClientProvider client={queryClient} />,
        <AuthProvider />
    ]

    return (
      <MultiProvider providers={providers}>
        <Notifications />
        <App />
      </MultiProvider>
    )
}

export { Program }
