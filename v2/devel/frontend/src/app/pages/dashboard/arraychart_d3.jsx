//////////////////////////////////////////////////////////////////////////
//
//  AMISR Array D3 component
//
//  Integration of D3 and ReactJS using hooks. Based on the article:
//
//       https://medium.com/@stopyransky/react-hooks-and-d3-39be1d900fb
//
//  2023-11-21  Todd Valentic
//              Initial implementation
//
//////////////////////////////////////////////////////////////////////////

import * as d3 from 'd3'

function ArrayChartD3(panels) {
    
    let margin = {top: 70, right: 40, bottom: 70, left: 80},
        width = 800,
        height = 300

    function chart(selection) {

        let svg = d3.select(this)
            .append('svg')
            .attr('viewBox',`0 0 ${width} ${height}`) 
            .attr('width','100%')
            .attr('height','100%')
            .attr('preserveAspectRatio','xMidYMid meet')
            .attr('font-family','Roboto Condensed')
            .style('position','absolute')
            .style('background-color', 'red')
            .append('g')
            .attr('transform',`translate(${margin.left},${margin.top})`)

        console.log("svg", svg)

        let row = svg.selectAll(".row")
            .data(panels)
            .enter().append("g")
            .attr("class", "row")

        let col = row.selectAll(".panel")
            .data(d => d)
            .enter().append("rect")
            .attr("class", "panel")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("width", d => d.width)
            .attr("height", d => d.height)
            .style("fill", "#fff")
            .style("stroke", "#222")
    }

    return chart
}

export default ArrayChartD3

