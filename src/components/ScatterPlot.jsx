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
      const minDate = d3.min(Object.values(data).map((d) => d["Year"])) - 1;
      const maxDate = d3.max(Object.values(data).map((d) => d["Year"]));
      const maxTime = d3.max(Object.values(data).map((d) => d["Time"]));
      const minTime = d3.min(Object.values(data).map((d) => d["Time"]));

      const xScale = d3
        .scaleTime()
        .domain([minDate, maxDate])
        .range([padding, width - padding]);

      // const yScale = d3
      //   .scaleTime()
      //   .domain([
      //     d3.timeSecond.offset(parseTime(minTime), -6),
      //     parseTime(maxTime),
      //   ])
      //   .range([height - padding, padding]);
      // const yScale = d3
      //   .scaleTime()
      //   .domain([
      //     d3.min(data, (d) => new Date(d.Time)),
      //     d3.max(data, (d) => new Date(d.Time)),
      //   ])
      //   .range([height - padding, padding]);
      // const yScale = d3
      //   .scaleTime()
      //   .domain(
      //     d3.extent(
      //       data.map((d) => {
      //         const date = new Date();
      //         const timeArr = d["Time"].split(":");
      //         date.setMinutes(parseInt(timeArr[0]), parseInt(timeArr[1]));
      //         return date;
      //       })
      //     )
      //   )
      //   .range([yScale(new Date("2022-01-01T00:36:00")), padding]);
      const yScale = d3
        .scaleTime()
        .domain([
          new Date("2022-01-01T00:36:00"),
          new Date("2022-01-01T00:40:00"),
        ])
        .range([height - padding, padding]);

      svg
        .selectAll("circle")
        .data(Object.values(data))
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("data-xvalue", (d) => d["Year"])
        .attr("data-yvalue", (d) => {
          return new Date(`2022-01-01T00:${d["Time"]}`);
        })
        .attr("cx", (d) => xScale(d["Year"]))
        .attr("cy", (d) => {
          return yScale(new Date(`2022-01-01T00:${d["Time"]}`));
        })
        .attr("r", 0)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 10)
        .ease(d3.easeLinear)
        .attr("r", 8)
        .attr("fill", (d) => {
          if (d["Doping"] === "") {
            return "green";
          } else {
            return "red";
          }
        })
        .on("end", function (e, d) {
          d3.select(this)
            .on("mouseover", (e, d) => {
              var date = new Date(`2022-01-01T00:${d["Time"]}`);
              tooltip
                .style("visibility", "visible")
                .style("opacity", 1)
                .attr("data-yvalue", (d) => {
                  return yScale(date);
                })
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
                );
            })
            .on("mouseout", (e, d) => {
              tooltip
                .style("visibility", "hidden")
                .style("opacity", 0)
                .attr("data-year", null)
                .attr("data-yvalue", null);
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
        .ticks(12)
        .tickSize(1)
        .tickSizeInner(10)
        .tickSizeOuter(1)
        .tickPadding(10);

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
