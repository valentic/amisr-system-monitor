/*************************************************************************
 *
 *  LineChart D3 component
 *
 *  Integration of D3 and ReactJS using hooks. Based on the article:
 *
 *       https://medium.com/@stopyransky/react-hooks-and-d3-39be1d900fb
 *
 *  2020-06-12  Todd Valentic
 *              Initial implementation
 *
 *************************************************************************/

import * as d3 from 'd3'
import moment from 'moment'
import 'moment-timezone'

function LineChartD3() {

    var margin = {top: 70, right: 40, bottom: 70, left: 80},
        width = 800,
        height = 300,
        xValue = function(d) { return d[0] },
        yValue = function(d) { return d[1] },
        xScale = d3.scaleTime(),
        yScale = d3.scaleLinear(),
        yTickFormat = d => d+yUnits,
        xAxis = d3.axisBottom().scale(xScale),
        yAxis = d3.axisLeft().scale(yScale).ticks(5).tickFormat(yTickFormat),
        area = d3.area().x(X).y1(Y).defined(d => !isNaN(d[1])),
        line = d3.line().x(X).y(Y).defined(d => !isNaN(d[1])),
        title = '',
        yTitle = '',
        xTitle = '',
        yDomain = undefined,
        yAreaAxis = 0,
        yUnits = '',
        yTickValues = undefined,
        yTickLabels = undefined

    function chart(selection) {

        selection.each(function(data) {

            var innerHeight = height - margin.bottom - margin.top
            var innerWidth = width - margin.left - margin.right

            const xAxisGrid = d3.axisBottom()
                                .scale(xScale)
                                .tickSize(-innerHeight)
                                .tickFormat('')

            const yAxisGrid = d3.axisLeft()
                                .scale(yScale)
                                .ticks(5)
                                .tickSize(-innerWidth)
                                .tickFormat('')

            data = data.map(function(d,i) {
                return [xValue.call(data,d,i),yValue.call(data,d,i)]
            })

            xScale
                .domain(d3.extent(data,function(d) { return d[0] }))
                .range([0,innerWidth])

            yScale.range([innerHeight,0])

            if (yDomain === undefined) {
                yScale.domain(d3.extent(data,function(d) { return d[1] }))
            } else {
                yScale.domain(yDomain)
            }

            if (yTickValues) {
                yAxis.tickValues(yTickValues)
            }

            if (yTickLabels) {
                yAxis.tickFormat((d,k) => yTickLabels[k])
            }

            var svg = d3.select(this)
                .append('svg')
                .attr('viewBox',`0 0 ${width} ${height}`) 
                .attr('width','100%')
                .attr('height','100%')
                .attr('preserveAspectRatio','xMidYMid meet')
                .attr('font-family','Roboto Condensed')
                .style('position','absolute')
                .append('g')
                .attr('transform',`translate(${margin.left},${margin.top})`)

            svg.append('g')
                .attr('class','x axis-grid')
                .attr('transform',`translate(0,${innerHeight})`)
                .attr('shape-rendering','auto')
                .call(xAxisGrid)

            svg.append('g')
                .attr('class','y axis-grid')
                .call(yAxisGrid)

            svg.append('g')
                .attr('transform',`translate(0,${innerHeight})`)
                .call(xAxis.tickPadding(15)
                    .tickFormat(d => moment(d).tz('America/Nuuk').format('hh A'))
                    )

            svg.append('g')
                .attr('transform',`translate(0,0)`)
                .call(d3.axisTop().scale(xScale).tickPadding(10)
                    .tickFormat(d => moment(d).tz('UTC').format('HH')+' UTC')
                    )
                .call(g => g.select('.domain')
                    .remove())

            svg.append('g')
                .call(yAxis.tickPadding(10))

            svg.append('path')
                .datum(data)
                .attr('fill','steelblue')
                .attr('opacity','80%')
                .attr('d',area.y0(yScale.range()[yAreaAxis]))

            svg.append('path')
                .datum(data)
                .attr('fill','none')
                .attr('stroke','lightblue')
                .attr('stroke-width',2.5)
                .attr('d',line)

            svg.selectAll('text')
                .attr('font-size','20px')

            svg.append('text')
                .attr('font-size','30px')
                .attr('fill','#CCC')
                .attr('x',innerWidth/2)
                .attr('y',yScale.range()[1]-margin.top/2)
                .attr('dy','-0.3em')
                .attr('text-anchor','middle')
                .text(title)

            svg.append('text')
                .attr('font-size','25px')
                .attr('fill','#CCC')
                .attr('x',innerWidth/2)
                .attr('y',yScale.range()[0]+margin.bottom)
                .attr('dy','-0.3em')
                .attr('text-anchor','middle')
                .text(xTitle)

            svg.append('text')
                .attr('font-size','25px')
                .attr('fill','#CCC')
                .attr('transform',`translate(${-margin.left+15},${innerHeight/2}) rotate(-90)`)
                .attr('text-anchor','middle')
                .text(yTitle)

        })
    }

    function X(d) {
        return xScale(d[0])
    }

    function Y(d) {
        return yScale(d[1])
    }
    
    chart.margin = function(v) {
        if (!arguments.length) return margin
        margin = v
        return chart
    }
 
    chart.width = function(v) {
        if (!arguments.length) return width
        width = v
        return chart
    }
 
    chart.height = function(v) {
        if (!arguments.length) return height
        height = v
        return chart
    }
 
    chart.x = function(v) {
        if (!arguments.length) return xValue
        xValue = v
        return chart
    }
 
    chart.y = function(v) {
        if (!arguments.length) return yValue
        yValue = v
        return chart
    }

    chart.title = function(v) {
        if (!arguments.length) return title
        title = v
        return chart
    }

    chart.xTitle = function(v) {
        if (!arguments.length) return xTitle
        xTitle = v
        return chart
    }

    chart.yTitle = function(v) {
        if (!arguments.length) return yTitle
        yTitle = v
        return chart
    }

    chart.yDomain = function(v) {
        if (!arguments.length) return yDomain
        if (v === undefined) return chart
        yDomain = v
        return chart
    }

    chart.yAreaAxis = function(v) {
        if (!arguments.length) return yAreaAxis
        if (v === undefined) return chart
        yAreaAxis = v 
        return chart
    }

    chart.yUnits = function(v) {
        if (!arguments.length) return yUnits
        if (v === undefined) return chart
        yUnits = v 
        return chart
    }

    chart.yTickValues = function(v) {
        if (!arguments.length) return yTickValues
        if (v === undefined) return chart
        yTickValues = v 
        return chart
    }

    chart.yTickLabels = function(v) {
        if (!arguments.length) return yTickLabels
        if (v === undefined) return chart
        yTickLabels = v 
        return chart
    }

    chart.yTickFormat = function(v) {
        if (!arguments.length) return yTickFormat
        if (v === undefined) return chart
        yTickFormat = v 
        return chart
    }



    return chart
}

export default LineChartD3

