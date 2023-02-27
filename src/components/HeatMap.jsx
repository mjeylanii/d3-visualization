import React from "react";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function HeatMap({ fetchedData }) {
  const svgRef = useRef();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const width = 1200;
  const height = 600;
  const padding = 100;
  var barWidth = width / (data.length / 10);
  var barHeight = height / 17.5 - 1;
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

  const drawLegend = (svg, colorScale) => {
    const legenData = [-6 - 5, -4 - 3, -2 - 1, 0, 1, 2, 3, 4, 5, 6];
    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${width - 400}, 0)`);
    const legendScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d["variance"]),
        d3.max(data, (d) => d["variance"]),
      ])
      .range([0, 300]);

    const legendAxis = d3
      .axisBottom(legendScale)
      .tickSize(5)
      .tickPadding(10)
      .tickSizeInner(10)
      .tickSizeOuter(2)
      .tickFormat((d) => d);

    legend
      .append("g")
      .attr("transform", `translate(0, 50)`)
      .attr("id", "x-axis")
      .attr("fill", "black")
      .call(legendAxis)
      .selectAll("text")
      .style("font-size", "0.8rem");

    legend
      .selectAll("rect")
      .data(legenData)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 30)
      .attr("y", 30)
      .attr("width", 30)
      .attr("height", 20)
      .attr("fill", (d) => colorScale(d));

    legend
      .append("text")
      .attr("x", 0)
      .attr("y", 25)
      .text("Variance")
      .style("font-size", "0.8rem");
  };

  useEffect(() => {
    const formatYear = d3.timeFormat("%Y");
    if (loading === false) {
      data.map((d) => {
        d["year"] = formatYear(new Date(d["year"], 0, 1));
      });
      const minYear = d3.min(data, (d) => d["year"]);
      const maxYear = d3.max(data, (d) => d["year"]);
      const svg = d3.select(svgRef.current);
      const xScale = d3
        .scaleLinear()
        .domain([minYear, maxYear])
        .range([padding, width - padding]);

      const yScale = d3
        .scaleBand()
        .domain(months)
        .range([padding, height - padding])
        .padding(0.1);

      const colorScale = d3
        .scaleSequential()
        .domain([
          d3.min(data, (d) => d["variance"]),
          d3.max(data, (d) => d["variance"]),
        ])
        .interpolator(d3.interpolateMagma);

      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("data-month", (d) => d["month"] - 1)
        .attr("data-year", (d) => d["year"])
        .attr("data-temp", (d) => d["variance"])
        .attr("x", (d) => xScale(d["year"]))
        .attr("y", (d) => yScale(months[d["month"] - 1]))
        .attr("width", barWidth)
        .attr("height", barHeight)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .delay((d, i) => i)
        .attr("fill", (d) => colorScale(d["variance"]))
        .on("end", function (d) {
          d3.select(this)
            .on("mouseover", (e, d) => {
              const tooltip = d3.select("#tooltip");
              tooltip
                .style("opacity", 1)
                .style("left", e.pageX + 10 + "px")
                .style("top", e.pageY + 10 + "px")
                .attr("data-year", d["year"])
                .style("width", "fit-content")
                .style("height", "fit-content")
                .style("visibility", "visible")
                .html(
                  d["year"] +
                    " - " +
                    months[d["month"] - 1] +
                    "<br>" +
                    (d["variance"] + 8.66).toFixed(2) +
                    "°C" +
                    "<br>" +
                    d["variance"].toFixed(2) +
                    "°C"
                );
            })
            .on("mouseout", (e, d) => {
              const tooltip = d3.select("#tooltip");
              tooltip
                .style("opacity", 0)
                .style("visibility", "hidden")
                .attr("data-year", null);
            });
        });

      //X axis for years up to 2015 with tick values using min and max year
      const xAxis = d3
        .axisBottom(xScale)
        .tickSize(1)
        .tickSizeInner(10)
        .tickSizeOuter(2)
        .tickValues(d3.range(minYear, maxYear, 15))
        .tickFormat((d) => d)
        .tickPadding(10);

      //Y axis for months
      const yAxis = d3
        .axisLeft(yScale)
        .tickSize(1)
        .tickSizeInner(10)
        .tickSizeOuter(2)
        .tickFormat((d) => d);

      svg
        .append("g")
        .attr("transform", `translate(0, ${height - padding})`)
        .attr("id", "x-axis")
        .attr("fill", "black")
        .call(xAxis)
        .selectAll("text")

        .style("font-size", "0.8rem")
        .style("font-weight", "100")
        .attr("fill", "steelgrey");

      svg
        .append("g")
        .attr("transform", `translate(${padding - 5}, 0)`)
        .attr("id", "y-axis")
        .call(yAxis)
        .selectAll("text")
        .attr("transform", "rotate(45)")
        .style("font-size", "0.8rem")
        .style("font-weight", "100")
        .attr("fill", "steelgrey");

      drawLegend(svg, colorScale);
    }
  }, [data]);

  useEffect(() => {
    if (fetchedData["Response"] === "heat-map") {
      setData(fetchedData["Data"].monthlyVariance);
      setLoading(false);
    }
  }, [fetchedData]);

  return (
    <article className="chart-container" data-theme="light">
      <header>
        <h3 id="title">
          Monthly Global Land-Surface Temperature
          <br />
          <span id="description">1753 - 2015: base temperature 8.66℃</span>
        </h3>
      </header>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <svg ref={svgRef} width={width} height={height}></svg>
      )}
    </article>
  );
}
