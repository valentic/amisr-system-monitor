import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '~/services'
import { ArrayChart } from './arraychart'
import { useResizeObserver } from '@mantine/hooks'
import classes from './dashboard.module.css'
import { 
    Box,
    Center,
    Container, 
    Grid, 
    Group,
    SimpleGrid,
    Title,
    LoadingOverlay,
    Paper,
    Progress,
    RingProgress,
    Stack,
    Text
    } from '@mantine/core'

const ShowError = (msg) => (
    <Container>
      <Title>Error</Title>
      <div>{msg}</div>
    </Container>
)

const Description = ({label, color, count, total}) => {
    const pct = Math.round((count/total)*100)
    return (
      <Box style={{ borderBottomColor: color}} className={classes.stat}>
        <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
          {label}
        </Text>
        <Group grow gap="xl">
          <Text fw={700}>{count}</Text>
          <Text c={color} fw={700} size="sm" className={classes.statCount}>{pct}%</Text> 
        </Group>
      </Box>
    )
}

const ArrayHealth = ({data}) => {

    if (!data) {
        return null
    }

    const rf = data.summary.rf_enabled

    const aeu_summary = [
        {   label: "good", 
            count: rf ? data.summary.good : 0, 
            total: data.summary.total, 
            color: "#47d6ab" 
        }, 
        {   label: "bad", 
            count: rf ? data.summary.bad : 0,
            total: data.summary.total, 
            color: "#4fcdf7" 
        }, 
        {   label: "ugly", 
            count: rf ? data.summary.ugly : 0,
            total: data.summary.total, 
            color: "red" 
        } 
    ]

    const stats = aeu_summary.map((stat) => (
        <Description key={stat.label} {...stat} /> 
    ))

    const segments = aeu_summary.map((stat) => (
        <Progress.Section value={stat.count/stat.total*100} color={stat.color} key={stat.label} />
    ))

    const total_power = data.summary.total * 500 // Watts
    const power_pct = data.summary.peak_power / total_power * 100
    const power_kw = Math.round(data.summary.peak_power/1000)
    const panel_pct = Object.keys(data.panels).length / 128 * 100 

    let power_color = 'lightgrey'

    if (power_pct > 60) {
        power_color = "green"
    } else if (power_pct > 30) {
        power_color = "yellow"
    } else if (power_pct > 0) {
        power_color = "red"
    }

    let panel_color = 'lightgrey'

    if (panel_pct > 80) {
        panel_color = "green"
    } else if (panel_pct > 30) {
        panel_color = "yellow"
    } else if (power_pct > 0) {
        panel_color = "red"
    }

    return (
        <Paper withBorder p="md" radius="md">
          <Grid>
            <Grid.Col span={{ base: 12, sm: 4}}>
              <Stack justify="flex-start" align="center">
                  <Text c="dimmed" fz="sm">
                    Peak Power
                  </Text>
                  <RingProgress
                    size={80}
                    roundCaps
                    thickness={6}
                    sections={[{ value: power_pct, color: power_color}]}
                    label={
                      <Center>
                        <Text>{Math.round(power_pct)}%</Text>
                      </Center>
                    }
                  />
                  <Text fw={700}><span>{power_kw} kW</span></Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 8}}>
              <Stack justify="flex-start" align="left">
                  <Text c="dimmed" fz="sm">Panel Health</Text>
                  <Progress value={panel_pct} color={panel_color} />
                  <Text c="dimmed" fz="sm">AEU Health</Text>
                  <Progress.Root w="100%"> {segments} </Progress.Root>
                  <SimpleGrid cols={{ base: 1, xs: 3}}>
                    {stats}
                  </SimpleGrid>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
    )
}
     
const Dashboard = () => {

    const pfisr_device_id = 17
    const risrn_device_id = 18

    const [ ref, rect ] = useResizeObserver()

    const arrayQuery = useQuery({
        queryKey: ["array_data"],
        queryFn: () => apiService.getLatest("array_data")
    })

    const descriptorsQuery = useQuery({
        queryKey: ["descriptors"],
        queryFn: () => apiService.getDescriptors()
    })

    if (arrayQuery.isError) {
        return <ShowError msg={arrayQuery.error.message} />
    }

    if (descriptorsQuery.isError) {
        return <ShowError msg={descriptorsQuery.error.message} />
    }

    const isLoading = descriptorsQuery.isLoading || arrayQuery.isLoading 

    let pfisr_data = null
    let risrn_data = null

    if (!isLoading) {
        //const desc = descriptorsQuery.data
        
        pfisr_data = arrayQuery.data[pfisr_device_id]
        risrn_data = arrayQuery.data[risrn_device_id]

        console.log(risrn_data)
    }

    const width = Math.max(0, Math.floor(rect.width/2))

    return (
        <div>
            <LoadingOverlay visible={isLoading} />
            
            <SimpleGrid cols={2} ref={ref}>
              <Stack align="center" justify="flex-start">
                <ArrayChart data={pfisr_data} width={width} height={width} />
                <ArrayHealth data={pfisr_data} />
              </Stack>
              <Stack align="center" justify="flex-start">
                <ArrayChart data={risrn_data} width={width} height={width} />
                <ArrayHealth data={risrn_data} />
              </Stack>
            </SimpleGrid>

        </div>
    )

}

export { Dashboard }
