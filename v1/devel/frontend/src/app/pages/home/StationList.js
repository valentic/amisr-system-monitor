import React from 'react'
import { Outlet } from 'react-router-dom'
import { ApplicationTable } from './ApplicationTable'
import { useApplicationsActive } from './ApplicationQuery'
import { useApplicationsTrash } from './ApplicationQuery'

import {
    Container,
    Title,
    LoadingOverlay
} from '@mantine/core'

const ApplicationListView = ({queryFunc, download }) => {

    const query = queryFunc() 

    if (query.isError) {
        return (
            <Container>
                <Title>Error</Title>
                <div>{query.error.message}</div>
            </Container>
        )
    }

    if (query.isLoading) {
        return <LoadingOverlay visible />
    }

    return (
        <>
          <ApplicationTable applications={query.data} />
          <Outlet />
        </>
    )
}

const Active = () => <ApplicationListView queryFunc={useApplicationsActive} download />
const Trash = () => <ApplicationListView queryFunc={useApplicationsTrash} />

const ApplicationList = { Active, Trash }

export { ApplicationList }
