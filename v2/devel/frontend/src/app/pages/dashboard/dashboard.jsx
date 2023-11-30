import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '~/services'
import { ArrayChart } from './arraychart'
import { useElementSize } from '@mantine/hooks'
import { useResizeObserver } from '@mantine/hooks'
import { 
    Container, 
    SimpleGrid,
    Title,
    LoadingOverlay,
    Progress,
    Table,
    } from '@mantine/core'

const ShowError = (msg) => (
    <Container>
      <Title>Error</Title>
      <div>{msg}</div>
    </Container>
)

const Dashboard = () => {

    const pfisr_device_id = 17
    const risrn_device_id = 18

    const [ ref, rect ] = useResizeObserver()

    const summaryQuery = useQuery({
        queryKey: ["array_summary"],
        queryFn: () => apiService.getLatest("array_summary")
    })

    const arrayQuery = useQuery({
        queryKey: ["array_data"],
        queryFn: () => apiService.getLatest("array_data")
    })

    const descriptorsQuery = useQuery({
        queryKey: ["descriptors"],
        queryFn: () => apiService.getDescriptors()
    })

    if (summaryQuery.isError) {
        return <ShowError msg={summaryQuery.error.message} />
    }

    if (arrayQuery.isError) {
        return <ShowError msg={arrayQuery.error.message} />
    }

    if (descriptorsQuery.isError) {
        return <ShowError msg={descriptorsQuery.error.message} />
    }

    const isLoading = descriptorsQuery.isLoading || summaryQuery.isLoading || arrayQuery.isLoading

    let rows = null
    let bars = null
    let pfisr_data = null
    let risrn_data = null
    const desc = descriptorsQuery.data

    if (!isLoading) {
        rows = summaryQuery.data?.map((row, index) => {
            const device = desc.device[row.device_id]
            const system = desc.system[device.system_id]
            return (
              <tr key={row.device_id}>
                <td>{system.label}</td>
                <td>{row.good}</td>
                <td>{row.bad}</td>
                <td>{row.ugly}</td>
                <td>{row.total}</td>
                <td>{row.peak_power/1e3} kW</td>
                <td>{row.rf_enabled ? "On" : "Off"}</td>
              </tr>
            )
        })

        bars = summaryQuery.data?.map((row, index) => {
            const total = Math.max(1, row.total)
            return (
              <Progress.Root size={30} key={row.device_id}>
                <Progress.Section value={row.good/total*100} color="green">
                  <Progress.Label>Good</Progress.Label>
                </Progress.Section>
                <Progress.Section value={row.bad/total*100} color="yellow">
                  <Progress.Label>Bad</Progress.Label>
                </Progress.Section>
                <Progress.Section value={row.ugly/total*100} color="red">
                  <Progress.Label>Ugly</Progress.Label>
                </Progress.Section>
              </Progress.Root>
            )
        })

        pfisr_data = arrayQuery.data[pfisr_device_id]
        risrn_data = arrayQuery.data[risrn_device_id]
    }

    const width = Math.max(0, Math.floor(rect.width/2))

    return (
        <div>
            <LoadingOverlay visible={isLoading} />
            <Title>Dashboard</Title>

            <div>
            {bars}
            </div>

            <Table striped>
              <thead>
                <tr>
                  <th>System</th>
                  <th>Good</th>
                  <th>Bad</th>
                  <th>Ugly</th>
                  <th>Total</th>
                  <th>Power</th>
                  <th>RF</th>
                </tr>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </Table>

            <SimpleGrid cols={2} ref={ref}>
              <ArrayChart data={pfisr_data} width={width} height={width} />
              <ArrayChart data={risrn_data} width={width} height={width} />
            </SimpleGrid>
        </div>
    )

}

export { Dashboard }
