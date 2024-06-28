import React from 'react'
import { createPalette } from 'hue-map'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from 'dayjs'
import { 
    Group,
    Layer,
    Line,
    Rect,
    Stage,
    Text,
} from 'react-konva'

dayjs.extend(utc)
dayjs.extend(customParseFormat)

const AEU_SIZE = 12  
const AEU_SPACING = 15
const PANEL_ROWS = 8
const PANEL_COLS = 4
const PANEL_MARGIN = 2
const PANEL_PADDING = 10

const PANEL_HEIGHT = 2*PANEL_PADDING + 2*PANEL_MARGIN + ((PANEL_ROWS-1) * AEU_SPACING)
const PANEL_WIDTH = 2*PANEL_PADDING + 2*PANEL_MARGIN + ((PANEL_COLS-1) * AEU_SPACING)

const ARRAY_PADDING = 2
const ARRAY_ROWS = 8 
const ARRAY_COLS = 16
const ARRAY_HEIGHT = ARRAY_PADDING + ARRAY_ROWS*PANEL_HEIGHT + ARRAY_PADDING
const ARRAY_WIDTH = ARRAY_PADDING + ARRAY_COLS*PANEL_WIDTH + ARRAY_PADDING

const CHART_PADDING_TOP = 220
const CHART_PADDING_LEFT = 75 
const CHART_PADDING_RIGHT = 75 
const CHART_PADDING_BOTTOM = 75 

const CHART_WIDTH = CHART_PADDING_LEFT + ARRAY_WIDTH + CHART_PADDING_RIGHT
const CHART_HEIGHT = CHART_PADDING_TOP + ARRAY_HEIGHT + CHART_PADDING_BOTTOM

const LEGEND_WIDTH = CHART_WIDTH/2
const LEGEND_HEIGHT = 45
const LEGEND_X = CHART_WIDTH/2 - LEGEND_WIDTH/2 
const LEGEND_Y= 5*CHART_PADDING_TOP/8

const colorscale = createPalette({ map: 'jet', steps: 128 }).format("cssHex")

const Panel = ({x, y, data}) => {
    const width = PANEL_WIDTH - 2*PANEL_MARGIN
    const height = PANEL_HEIGHT - 2*PANEL_MARGIN

    const aeus = []
    
    for (let row=0; row<PANEL_ROWS; row++) {
        for (let col=0; col<PANEL_COLS; col++) {
            const ax = PANEL_PADDING + ((PANEL_COLS-col-1)*AEU_SPACING) - AEU_SIZE/2
            const ay = PANEL_PADDING + (row*AEU_SPACING) - AEU_SIZE/2
            const key = `aeu-${x*y}-${row}-${col}`
            const index = (col*PANEL_ROWS)+row+1
            let fill = "white"

            if (data) {
                const pwatts = data[index].pwatts

                if (data[index].pfwd) {
                    const value = Math.round(Math.min(pwatts,600) / 600 * 127)
                    fill = colorscale[value]
                }
            }

            aeus.push(<Rect 
                x={ax} 
                y={ay} 
                width={AEU_SIZE} 
                height={AEU_SIZE} 
                fill={fill} key={key} 
            />)
        }
    }

    return (
      <Group x={x} y={y}>
        <Group x={PANEL_MARGIN} y={PANEL_MARGIN}>
          <Rect width={width} height={height} fill="lightgrey" stroke="white"/>
          { aeus } 
        </Group>
      </Group>
    )
}

const ColorScaleLegend = ({x, y, width, height, scale, minValue, maxValue, stepValue, units}) => {

    const stops = []
    const labels = []
    const ticks = [] 

    for (let k=0; k<colorscale.length; k++) {
        stops.push(k/colorscale.length)
        stops.push(colorscale[k])
    }

    const xscale = width / (maxValue - minValue)

    for (let value=minValue; value<=maxValue; value+=stepValue) {
        const x = value * xscale 
        const y1 = height/2+8 
        const y2 = height/2
        labels.push(<Text
            key={`label-${value}`}
            text={`${value}${units}`}
            x={x-50}
            width={100}
            y={height/2+14}
            align="center"
            fontSize={26}
            fontFamily="'Roboto Condensed'"
        />)
        ticks.push(<Line
            key={`tick-${value}`}
            points={[x, y1, x, y2]}
            stroke="black"
            strokeWidth={1}
        />)
    } 

    return (
      <Group x={x} y={y} width={width} height={height}> 
        <Rect 
          width={width} 
          height={height/2} 
          stroke="black" 
          fillLinearGradientStartPointX={0}
          fillLinearGradientEndPointX={width}
          fillLinearGradientColorStops={stops}
          strokeWidth={1}
        />
        { labels }
        { ticks }
      </Group>
    )
}

const ArrayChart = ({data, width, height}) => {

    if (!data || !width || !height) {
        return null
    }

    const panels = [] 
    const row_labels = []
    const col_labels = []
    const face = data.metadata.face

    for (let row=1; row<=ARRAY_ROWS; row++) {
        for (let col=1; col<=ARRAY_COLS; col++) {
            const r = row.toString().padStart(2, "0")
            const c = col.toString().padStart(2, "0")
            const key = `panel-R${r}-C${c}.${face}`
            const x = ARRAY_PADDING + (ARRAY_COLS - col)*PANEL_WIDTH
            const y = ARRAY_PADDING + (row-1)*PANEL_HEIGHT
            panels.push(<Panel x={x} y={y} data={data.panels[key]} key={key} />) 
        }
    }

    for (let row=1; row<=ARRAY_ROWS; row++) {
        const label = 'R'+row.toString().padStart(2, "0")
        const y = CHART_PADDING_TOP + (row-1)*PANEL_HEIGHT + PANEL_HEIGHT/2
        row_labels.push(<Text
            key={label}
            text={label}
            y={y}
            x={0}
            width={CHART_PADDING_LEFT}
            height={PANEL_HEIGHT}
            align="center"
            verticalAlign="center"
            fontSize={30}
            fontFamily="'Roboto Condensed'"
        />)
    }

    for (let col=1; col<=ARRAY_COLS; col++) {
        const label = 'C'+col.toString().padStart(2, "0")
        const x = CHART_PADDING_LEFT + (ARRAY_COLS - col)*PANEL_WIDTH 
        col_labels.push(<Text
            key={label}
            text={label}
            x={x}
            y={CHART_PADDING_TOP + ARRAY_HEIGHT + CHART_PADDING_BOTTOM/4}
            height={CHART_PADDING_BOTTOM}
            width={PANEL_WIDTH}
            align="center"
            verticalAlign="center"
            fontSize={30}
            fontFamily="'Roboto Condensed'"
        />)
    }


    const aspect = CHART_HEIGHT / CHART_WIDTH

    if (aspect > 1) {
        width = Math.floor(width / aspect)
    }

    height = Math.floor(width * aspect)

    const scaleX = width / CHART_WIDTH 
    const scaleY = height / CHART_HEIGHT 

    const peak_power = Math.round(data.summary.peak_power / 1000)
    const timestamp = dayjs.utc(data.metadata.timestamp, "YYYY-MM-DD HH:mm:ss.SSSZ")

    return (
        <Stage width={width} height={height} scaleX={scaleX} scaleY={scaleY}>
          <Layer>
            <Rect width={CHART_WIDTH} height={CHART_HEIGHT} /> 
            <Text text={`${face.toUpperCase()} Peak Power ${peak_power} kW`}
                y={30} 
                width={CHART_WIDTH}
                align="center"
                fontSize={50}
                fontFamily="'Roboto Condensed'"
            />
            <Text text={`${timestamp.format("YYYY-MM-DD HH:mm")} UTC`}
                y={90} 
                width={CHART_WIDTH}
                fontSize={26}
                align="center"
                fontFamily="'Roboto Condensed'"
            />
            <ColorScaleLegend
                x={LEGEND_X}
                y={LEGEND_Y}
                width={LEGEND_WIDTH}
                height={LEGEND_HEIGHT}
                minValue={0}
                maxValue={600}
                stepValue={100}
                units="W"
                colorscale={colorscale}
            />
            <Group x={CHART_PADDING_LEFT} y={CHART_PADDING_TOP}>
                <Rect width={ARRAY_WIDTH} height={ARRAY_HEIGHT} fill="grey" />
                { panels } 
            </Group>
            { row_labels }
            { col_labels }
          </Layer>
        </Stage>
    )
}

export { 
    ArrayChart
}
