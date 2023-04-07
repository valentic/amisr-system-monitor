import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box, createStyles } from '@mantine/core'

import { AppHeader } from './header'
import { AppFooter } from './footer'
import { useAuth } from '~/app'

const useStyles = createStyles((theme) => {

    return {

        page: {
            height: '100vh',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto 1fr auto',
            gridTemplateAreas: "'header' 'main' 'footer'",
        },

        header: {
            gridArea: 'header'
        },

        main: {
            gridArea: 'main',
            overflow: 'auto',
            boxShadow: '0px 1px 10px rgba(0,0,0,0.25)',
            zIndex: '5',
        },

        footer: {
            gridArea: 'footer'
        }
    }
})

const Layout = () => {

    const { classes } = useStyles()
    const auth = useAuth()

    let links = [
        { link: '/',            label: 'Home'           },
        { link: '/contacts',    label: 'Contact Us'     }
        ]

    if (auth.loggedIn()) {
        links.push({link: '/admin',     label: 'Dashboard'  })
        links.push({link: '/logout',    label: 'Sign out' })
    }
    
    return (
        <Box className={classes.page}> 
          <AppHeader className={classes.header} links={links} /> 
          <main className={classes.main}> 
            <section className={classes.section} > 
              <Outlet />
            </section>
          </main>
          <AppFooter className={classes.footer}/> 
        </Box>
    )
}

export { Layout }
