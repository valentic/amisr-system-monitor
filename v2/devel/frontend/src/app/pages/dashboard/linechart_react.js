import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'
import * as d3 from 'd3'

import LineChartD3 from './linechart_d3'

const ReactComponent = ({data,y_key,...props}) => {

    const refElement = useRef(null)
    const classnames = classNames('plot-wrapper',props.style_name)

    useEffect(initChart,[data,refElement])

    function initChart() {

        const chart = LineChartD3()
                .x(function(d) { return d3.isoParse(d.timestamp_utc); })
                .y(function(d) { return d[y_key]; })
                .yDomain(props.y_domain)
                .yAreaAxis(props.y_area_axis)
                .yUnits(props.y_units)
                .yTickValues(props.y_tick_values)
                .yTickLabels(props.y_tick_labels)
                .title(props.title)
                .xTitle(props.x_title)

        d3.select(refElement.current).select('svg').remove()

        d3.select(refElement.current)   
            .data([data])
            .call(chart)
    }

    return (
        <div ref={refElement} className={classnames} {...props} />
    )
}

export default ReactComponent

