import React from 'react'
import { useDisclosure } from '@mantine/hooks'
import { NavLink } from 'react-router-dom'
import leftLogo from '~/support/assets/logoipsum-logo-59.svg'
import rightLogo from '~/support/assets/logoipsum-logo-64.svg'

import { 
    Box,
    Burger, 
    Group, 
    Header,
    Paper, 
    Text,
    Transition,
    createStyles
    } from '@mantine/core'

const HEADER_HEIGHT = 60

const useStyles = createStyles((theme) => ({

    root: {
        postition: 'relative',
        zIndex: 1
    },

    header: {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gridTemplateAreas: '"logoLeft titleBox logoRight"',

        color: '#ccc',
        background: 'linear-gradient(0deg, #17375e, #152235)',

        borderBottom: '1px solid cyan',
        boxShadow: '0px 2px 10px rgba(0,0,0,0.5)',

        height: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        zIndex: 11,
        position: 'relative',

        [theme.fn.smallerThan('sm')]: {
            height: HEADER_HEIGHT, 
        },
    },

    dropdown: {
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: 'hidden',

        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    links: {
        justifyContent: 'center',
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    titleBox: {
        gridArea: 'titleBox'
    },

    title: {
        fontFamily: 'Roboto Condensed, Helvetica, Arial, sens-serif',
        fontWeight: 700,
        fontSize: 34,
        textTransform: 'uppercase',
        color: theme.colors[theme.primaryColor][0],
        margin: 0,
        marginTop: 10,
        [theme.fn.smallerThan('sm')]: {
            alignSelf: 'center',
            fontSize: 18
        },
    },

    burger: {
        alignSelf: 'center',
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    logoLeft: {
        gridArea: 'logoLeft',

        placeSelf: 'center start',
        height: '60px',
        opacity: 0.75,
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    logoRight: {
        gridArea: 'logoRight',
        
        placeSelf: 'center end',
        height: '60px',
        opacity: 1,
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        textTransform: 'uppercase',
        fontSize: theme.fontSizes.sm,
        color: theme.white,
        padding: `7px ${theme.spacing.sm}px`,
        fontWeight: 700,
        transition: 'border-color 100ms ease, opacity 100ms ease',
        opacity: 0.9,
        borderTopRightRadius: theme.radius.sm,
        borderTopLeftRadius: theme.radius.sm,
        textDecoration: 'none',
        display: 'block',

        '&:hover': {
            opacity: 1,
        },

        [theme.fn.smallerThan('sm')]: {
            borderRadius: 0,
            padding: theme.spacing.md,
            color: theme.colors[theme.primaryColor][5],
            '&:hover': {
                backgroundColor: theme.colors[theme.primaryColor][2],
                color: theme.colors[theme.primaryColor][7],
            },
        },
        
        '&.active, &.active:hover': {
            color: theme.white,
            opacity: 1,
            backgroundColor: '#344a66',
        },
    },

}))

const AppHeader = ({ links, className }) => {

    const [opened, { toggle } ] = useDisclosure(false)
    const { classes, cx } = useStyles()

    const items = links.map((link) => (
        <NavLink
            key={link.label}
            to={link.link}
            replace
            className={classes.link}
            onClick={(event) => { toggle(false) }}
        >
          {link.label}
        </NavLink>
    ))

    return (
      <Header className={cx(classes.header, className)}>
        <img className={classes.logoLeft} src={leftLogo} alt="Left Logo" />
        <Box className={classes.titleBox}>
          <Text className={classes.title} > 
            {import.meta.env.VITE_TITLE}
          </Text>
          <Group className={classes.links} spacing={5} >
            {items}
          </Group>
        </Box>
        <img className={classes.logoRight} src={rightLogo} alt="Right Logo" />

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
          color="white"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Header>
    )
}

export { AppHeader }
