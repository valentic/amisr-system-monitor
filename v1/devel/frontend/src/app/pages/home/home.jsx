import React from 'react'
import { LoremIpsum } from 'react-lorem-ipsum'
import { 
    Container, 
    } from '@mantine/core'

const Home = () => {

    return (
        <Container>
            Home page.
            <LoremIpsum p={5} avgSentencesPerParagraph={12} />
        </Container>
    )
}

export { Home }
