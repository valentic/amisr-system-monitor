import React from 'react'
import { Link } from 'react-router-dom'
import { 
    Text,
    createStyles 
} from '@mantine/core'

const useStyles = createStyles((theme) => {
    
    return {
        footer: {
            padding: '0.5em',
            backgroundColor: theme.colors.gray[2], 
            color: '#888',
            textAlign: 'center',
            fontSize: 'smaller',
            fontWeight: 'bold'
        }
    }
})

const AppFooter = ({className, props}) => {

    const release = import.meta.env.VITE_RELEASE
    const { classes, cx } = useStyles()

    return (
        <footer className={cx(classes.footer, className)} {...props}>
          <Text size="xs" color="dimmer">
            Release {release} &nbsp; <Link to='/admin/'>Admin</Link>
          </Text>
        </footer>
    )
}

export { AppFooter }
