import React from 'react'
import { 
    Container, 
    Title
} from '@mantine/core'

const Contacts = () => {

    return (
        <Container size="md" mt="1em">
          <Title 
            sx={(theme) => ({ color: theme.colors.blue })}
          >Contact Us</Title>
       
          <p>
          For more information, please contact:{" "}
          <a href="mailto:nobody@localhost">nobody@localhost</a>.
          </p>
         
        </Container>
    )
}

export { Contacts } 
