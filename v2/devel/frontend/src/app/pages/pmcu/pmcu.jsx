import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '~/services'
import { 
    Container, 
    Title,
    LoadingOverlay,
    Table
} from '@mantine/core'

const ShowError = (msg) => ( 
    <Container>
      <Title>Error</Title>
      <div>{msg}</div>
    </Container>
)

const format_cpdu = (data, units) => {
    return data.map((cpdu, index) => {
        return cpdu.map((value, phase) => {
            const key = `${index}-${phase}`
            return <td key={key}>{value} {units}</td>
        })
    }).flat()
}

const PMCUPower = () => {

    const dataQuery = useQuery({
        queryKey: ["pmcu_data"], 
        queryFn: () => apiService.getLatest("pmcu_data")
    })

    const descriptorsQuery = useQuery({
        queryKey: ["descriptors"], 
        queryFn: () => apiService.getDescriptors()
    })

    if (dataQuery.isError) {
        return <ShowError msg={dataQuery.error.message} />
    }

    if (descriptorsQuery.isError) {
        return <ShowError msg={descriptorsQuery.error.message} />
    }

    const isLoading = descriptorsQuery.isLoading || dataQuery.isLoading

    let rows = null
    const desc = descriptorsQuery.data

    if (!isLoading) {
        rows = dataQuery.data?.map((pmcu, index) => {
            const device = desc.device[pmcu.device_id]
            const system = desc.system[device.system_id]
            const status_ = desc.status[pmcu.status_id]
            const voltage = format_cpdu(pmcu.cpdu_voltage, 'V')
            const current = format_cpdu(pmcu.cpdu_current, 'A')
            return (
              <tr key={pmcu.device_id}>
                <td>{system.label}</td>
                <td>{device.label}</td>
                <td>{status_.label}</td>
                {voltage}
                {current}
              </tr>
            )
        })
    }
    
    return (
      <div>
        <LoadingOverlay visible={isLoading} />

        <Table striped>
            <thead>
                <tr>
                    <th>System</th>
                    <th>Device</th>
                    <th>Status</th>
                    <th>Voltage C1 PA</th>
                    <th>Voltage C1 PB</th>
                    <th>Voltage C1 PC</th>
                    <th>Voltage C2 PA</th>
                    <th>Voltage C2 PB</th>
                    <th>Voltage C2 PC</th>
                    <th>Current C1 PA</th>
                    <th>Current C1 PB</th>
                    <th>Current C1 PC</th>
                    <th>Current C2 PA</th>
                    <th>Current C2 PB</th>
                    <th>Current C2 PC</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
      </div>
    )

}

export { PMCUPower }
