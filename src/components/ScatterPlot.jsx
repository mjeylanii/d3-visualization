import React from "react";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function ScatterPlot({ fetchedData }) {
  const svgRef = useRef();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const width = 1200;
  const height = 500;
  const padding = 60;

  useEffect(() => {
    if (loading === false) {
      const svg = d3.select(svgRef.current);
      const tooltip = d3.select("#tooltip");
      const parseTime = d3.timeParse("%M:%S");
      const minDate = d3.min(Object.values(data).map((d) => d["Year"])) - 1;
      const maxDate = d3.max(Object.values(data).map((d) => d["Year"]));
      const maxTime = d3.max(Object.values(data).map((d) => d["Time"]));
      const minTime = d3.min(Object.values(data).map((d) => d["Time"]));

      const xScale = d3
        .scaleLinear()
        .domain([minDate, maxDate])
        .range([padding, width - padding]);

      const yScale = d3
        .scaleTime()
        .domain([
          d3.timeSecond.offset(parseTime(minTime), -6),
          parseTime(maxTime),
        ])
        .range([height - padding, padding]);

      //Make xAxis start from 0 then 1994
      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat(d3.format("d"))
        .ticks(12)
        .tickSize(1)
        .tickSizeInner(10)
        .tickSizeOuter(1)
        .tickPadding(10);

      const yAxis = d3
        .axisLeft(yScale)
        .tickFormat(d3.timeFormat("%M:%S"))
        .tickSize(1)
        .tickSizeInner(10)
        .tickSizeOuter(1)
        .tickValues(yScale.ticks().filter((d) => +d !== 0));

      svg
        .append("g")
        .attr("transform", `translate(0, ${height - padding} )`)
        .attr("fill", "black")
        .attr("id", "x-axis")
        .call(xAxis)
        .selectAll("text")
        .attr("font-size", "0.6rem")
        .attr("fill", "black");

      //Set interval to 1 minute
      svg
        .append("g")
        .attr("transform", `translate(${padding}, 0)`)
        .attr("fill", "black")
        .attr("id", "y-axis")
        .call(yAxis)
        .selectAll("text")
        .attr("font-size", "0.6rem")
        .attr("fill", "black");

      svg
        .selectAll("circle")
        .data(Object.values(data))
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("data-xvalue", (d) => d["Year"])
        .attr("data-yvalue", (d) => parseTime(d["Time"]))
        .attr("cx", (d) => xScale(d["Year"]))
        .attr("cy", (d) => yScale(parseTime(d["Time"])))
        .attr("r", 0)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 10)
        .ease(d3.easeElasticInOut)
        .attr("r", 8)
        .attr("fill", (d) => {
          if (d["Doping"] === "") {
            return "green";
          } else {
            return "red";
          }
        })
        .on("end", function (d) {
          d3.select(this)
            .on("mouseover", (e, d) => {
              tooltip
                .style("visibility", "visible")
                .style("opacity", 1)
                .attr("data-year", d["Year"])
                .style("left", e.pageX + 20 + "px")
                .style("top", e.pageY - 28 + "px")
                .html(
                  d["Name"] +
                    ": " +
                    d["Nationality"] +
                    "<br/>" +
                    "Year: " +
                    d["Year"] +
                    ", Time: " +
                    d["Time"] +
                    "<br/>" +
                    d["Doping"]
                )
                .attr("data-year", (d) => d["Year"])
                .attr("data-yvalue", (d) => parseTime(d["Time"]));
            })
            .on("mouseout", (e, d) => {
              tooltip.style("visibility", "hidden").style("opacity", 0);
            });
        });
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", padding + 10 / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Time in Minutes")
        .attr("font-size", "1rem");

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height - padding / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Year")
        .attr("font-size", "1rem");

      //Legend
      const legend = svg
        .append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${width - 200}, ${height - 100})`);

      legend
        .append("rect")
        .attr("x", -40)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "green");

      legend
        .append("text")
        .attr("x", -20)
        .attr("y", 10)
        .attr("dy", "0.1em")
        .text("No doping allegations")
        .attr("font-size", "0.8rem");

      legend
        .append("rect")
        .attr("x", -40)
        .attr("y", 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "red");

      legend
        .append("text")
        .attr("x", -20)
        .attr("y", 30)
        .attr("dy", "0.1em")
        .text("Riders with doping allegations")
        .attr("font-size", "0.8rem");
    }
  }, [data]);

  useEffect(() => {
    if (fetchedData["Response"] === "scatter-plot") {
      setData(fetchedData["Data"]);
      setLoading(false);
    }
  }, [fetchedData]);

  return (
    <article className="chart-container" data-theme="light">
      <header data-theme="light">
        <h3 id="title">
          Doping in Professional Bicycle Racing <br />
          <small id="subtitle">35 Fastest times up Alpe d'Huez</small>
        </h3>
      </header>
      <svg ref={svgRef} width={width} height={height}></svg>
      <footer>
        <p>For more details click on the dots</p>
      </footer>
    </article>
  );
}
