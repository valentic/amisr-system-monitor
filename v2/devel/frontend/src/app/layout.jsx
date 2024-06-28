import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import classNames from 'classnames/bind'

import { 
    rem,
    AppShell, 
    Box,
    Burger, 
    Group,
    Text
} from '@mantine/core'

import {
    IconBorderNone,
    IconSquareRoundedLetterA,
    IconServerBolt
} from '@tabler/icons-react'

import { useAuth } from '~/app'

//import { Header } from './header'
//import { Footer } from './footer'
import classes from './layout.module.css'

import { Navbar } from './navbar'

const Layout = () => {

    const auth = useAuth()
    const [ opened, { toggle } ] = useDisclosure()

    const heartbeat = useQuery({
        queryKey: ["heartbeat"],
        queryFn: async () => { return "Unknown" },
        refetchInterval: 60*1000,
        refetchIntervalInBackground: true
    })

    const socket = useQuery({
        queryKey: ["socket"],
        queryFn: async () => { return "Unknown" }
    })

    const submenu = [
        { label: 'Home',        link: '/'           },
        { label: 'Contacts',    link: '/contacts'   }
    ]

    let links = [
        { label: 'Home',        link: '/'           },
        { label: 'Features',    links: submenu      },
        { label: 'Contact Us',  link: '/contacts'   },
    ]

    if (auth.loggedIn()) {
        links.push({link: '/admin',     label: 'Dashboard'  })
        links.push({link: '/logout',    label: 'Sign out' })
    }

    const navlinks = [
        { icon: IconBorderNone, label: 'Dashboard', link: '/' },
        { icon: IconServerBolt, label: 'PMCU', link: '/pmcu' },
    ]
   
    /*
    return (
        <Box className={classes.page}> 
          <Header links={links} /> 
          <main className={classes.main}> 
            <section className={classes.section} > 
              <Outlet />
            </section>
          </main>
          <Footer /> 
        </Box>
    )*/

    let state = "unknown" 

    if (socket.data === undefined || socket.data === "Unknown") {
        state = "unknown" 
    } else if (socket.data === false) {
        state = "offline"
    } else if (socket.data === true) {

        if (heartbeat.data === undefined || heartbeat.data === "Unknown") {
            state = "warning"
        } else if ((Date.now() - heartbeat.data) <= 60*1000) {
            state = "online"
        } else {
            state = "warning"
        }
    }

    const cx = classNames.bind(classes)
    const logoStyle = cx(["logo", state])

    return (
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 60, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Box visibleFrom="sm" className={logoStyle} w={rem(60)}>
              <IconSquareRoundedLetterA size={rem(50)}/> 
            </Box>
            <Text size="lg" fw={700}>{import.meta.env.VITE_TITLE}</Text>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar><Navbar links={navlinks}/></AppShell.Navbar>

        <AppShell.Main><Outlet /></AppShell.Main>

      </AppShell>
    )
}

export { Layout }
