import React from 'react'
import * as d3 from 'd3'

const ExChart = ({ data, dimensions }) => {

    const svgRef = useRef(null)
    const { width, height, margin } = dimensions
    const svgWidth = width + margin.left + margin.right
    const svgHeight = height + margin.top + margin.bottom

    React.useEffect() => {

        const xScale = d3.scaleTime()
            .domain(d3.extent(data[0].items, (d) => d.date))
            .range([0, width])

        const yScale = d3.scaleLinear()
            .domain([
                d3.min(data[0].items, (d) => d.value) - 50,
                d3.max(data[0].items, (d) => d.value) + 50
            ])
            .range([height, 0])

        const svgEl = d3.select(svgRef.current)

        svgEl.selectAll("*").remove()

        const svg = svgEl
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin,top})`)

        const xAxis = d3.axisBottom(xScale)
            .ticks(5)
            .tickSize(-height + margin.bottom)

        const xAxisGroup = svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis)

        xAxisGroup.select(".domain").remove()
        xAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)")
        xAxisGroup.selectAll("text")
            .attr("opacity", 0.5)
            .attr("color", "white")
            .attr("font-siez", "0.75rem")

