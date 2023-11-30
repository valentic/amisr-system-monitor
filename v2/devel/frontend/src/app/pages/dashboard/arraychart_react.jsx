//////////////////////////////////////////////////////////////////////////
//
//  AMISR Array component for React
//
//  2023-11-21  Todd Valentic
//              Initial implementation
//
//////////////////////////////////////////////////////////////////////////

import React from 'react'
import classNames from 'classnames'
import * as d3 from 'd3'

import ArrayChartD3 from './arraychart_d3'
import AMISRToolkit from './amisr_toolkit'

const ReactComponent = ({data, y_key, ...props}) => {

    const refElement = React.useRef(null)
    const classnames = classNames('plot-wrapper', props.style_name)

    React.useEffect(initChart, [data, refElement, props])

    function initChart() {

        const panels = AMISRToolkit.make_array({rows: 8, cols: 16}) 

        const chart = ArrayChartD3(panels)

        d3.select(refElement.current)
            .select('svg')
            .remove()

        d3.select(refElement.current)   
            .call(chart)
    }

    return (
        <div ref={refElement} className={classnames} {...props} />
    )
}

export default ReactComponent

