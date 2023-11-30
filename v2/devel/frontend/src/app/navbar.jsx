import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { 
    Stack,
    Tooltip, 
} from '@mantine/core'

import classes from './navbar.module.css'

function NavbarLink({icon: Icon, label, link, active, onClick }) {
    return (
      <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
        <NavLink 
            to={link}
            replace 
            className={classes.link} 
            data-active={active || undefined} 
            onClick={onClick}
        >
          <Icon className={classes.icon} />
        </NavLink>
      </Tooltip>
    )
}

const Navbar = ({links}) => {

    const [ active, setActive ] = useState(0)

    const navlinks = links.map((link, index) => (
        <NavbarLink
          {...link}
          key={link.label}
          active={index === active}
          onClick={() => setActive(index)}
        />
    ))

    return (
        <Stack justify="center" align="center" gap={0}>
            { navlinks }
        </Stack>
    )
}

export { Navbar }
