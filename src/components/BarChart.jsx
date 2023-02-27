import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BarChart = ({ fetchedData }) => {
  const svgRef = useRef();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const width = 1200;
  const height = 500;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (loading === false) {
      const svg = d3.select(svgRef.current);
      const padding = 60;
      const minDate = new Date(data.data[0][0]);
      const maxDate = new Date(data.data[274][0]);
      const barWidth = (width - 2 * padding) / data.data.length;
      const formatCurrency = d3.format("$,.1f");
      const formatYearAndMonth = d3.timeFormat("%Y");
      //Select tooltip div
      const tooltip = d3.select("#tooltip");
      const xScale = d3
        .scaleTime()
        .domain([minDate, maxDate])
        .range([padding, width - padding]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data.data, (d) => d[1])])
        .range([height - padding, padding]);

      svg
        .selectAll("rect")
        .data(data.data)
        .join("rect")
        .attr("x", (d) => xScale(new Date(d[0])))
        .attr("y", height - padding)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("fill", "steelblue")
        .transition()
        .duration(1000)
        .attr("y", (d) => yScale(d[1]))
        .attr("height", (d) => height - padding - yScale(d[1]))
        .delay((d, i) => i * 5)
        .ease(d3.easeLinear)
        .on("end", function (d) {
          d3.select(this)
            .on("mouseover", function (e, d) {
              d3.select(this).attr("opacity", 0.5);
              tooltip
                .html(
                  `${formatCurrency(d[1])} Billion <br/> 
                
                ${formatYearAndMonth(new Date(d[0]))}   ${
                    months[new Date(d[0]).getMonth()]
                  }`
                )
                .style("visibility", "visible")
                .style("opacity", 1)
                .style("left", e.pageX + "px")
                .style("top", e.pageY - 25 + "px")
                .style("transform", "translateX(20px)")
                .attr("data-date", d[0])
                .attr("data-gdp", d[1]);
            })
            .on("mouseout", function () {
              //Remove tooltip
              tooltip.style("visibility", "hidden");
              tooltip.style("opacity", 0);
              tooltip
                .style("left", 0)
                .attr("data-date", null)
                .attr("data-gdp", null);
              d3.select(this).attr("opacity", 1);
            });
        })
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .attr("class", "bar");

      const xAxis = d3
        .axisBottom(xScale)
        .ticks(d3.timeYear.every(5))
        .tickSizeOuter(0)
        .tickSizeInner(8);

      const yAxis = d3
        .axisLeft(yScale)
        .ticks(10)
        .tickSizeOuter(0)
        .tickSizeInner(8);

      svg
        .append("g")
        .attr("transform", `translate(0, ${height - padding})`)
        .attr("fill", "black")
        .attr("id", "x-axis")
        .call(xAxis)
        .selectAll("text")
        .attr("font-size", "0.8rem")
        .attr("fill", "black");

      svg
        .append("g")
        .attr("transform", `translate(${padding}, 0)`)
        .attr("fill", "black")
        .attr("id", "y-axis")
        .call(yAxis)
        .selectAll("text")
        .attr("font-size", "0.8rem")
        .attr("fill", "black");
    }
  }, [loading]);

  useEffect(() => {
    if (fetchedData["Response"] === "bar-chart") {
      setData(fetchedData["Data"]);
      setLoading(false);
    }
  }, [fetchedData]);

  return (
    <article data-theme="light">
      <header data-theme="light">
        <h3 id="title">US Gross Domestic Product</h3>
      </header>
      <svg ref={svgRef} width={width} height={height}></svg>
      <footer>
        <p>{data?.description}</p>
      </footer>
    </article>
  );
};

export default BarChart;
