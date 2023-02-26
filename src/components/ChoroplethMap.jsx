import React from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { useEffect, useRef, useState } from "react";

export default function ChoroplethMap({ fetchedData }) {
  const svgRef = useRef();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const width = 960;
  const height = 600;

  // Draw legend for the map
  const drawLegend = (svg, colorScale) => {
    const legendData = [0, 10, 20, 30, 40, 50, 60, 70, 80];
    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${width - 400}, -10)`);

    const legendScale = d3
      .scaleLinear()
      .domain([d3.min(data.education, (d) => d.bachelorsOrHigher), 80])
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
    //Add multiple color rectangles to the legend
    legend
      .selectAll("rect")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 30)
      .attr("y", 30)
      .attr("width", 60)
      .attr("height", 20)
      .attr("fill", (d) => colorScale(d));

    legend
      .append("text")
      .attr("x", 0)
      .attr("y", 25)
      .text("Education level (%)")
      .style("font-size", "0.8rem")
      .style("font-family", "sans-serif")
      .style("text-anchor", "start");

    //Bottom text source
    legend
      .append("text")
      .attr("x", 0)
      .attr("y", height - 10)
      .text("Source: U.S. Census Bureau")
      .style("font-size", "0.8rem")
      .style("font-family", "sans-serif")
      .style("text-anchor", "start");
  };

  useEffect(() => {
    if (loading === false) {
      const svg = d3.select(svgRef.current);
      const tooltip = d3.select("#tooltip");
      const path = d3.geoPath();
      const topoData = data.counties;
      const counties = topojson.feature(topoData, topoData.objects.counties);
      const educationData = data.education;
      const minEdu = d3.min(educationData, (d) => d.bachelorsOrHigher);
      const maxEdu = d3.max(educationData, (d) => d.bachelorsOrHigher);
      const colorScale = d3
        .scaleThreshold()
        .domain(d3.range(minEdu, maxEdu, (maxEdu - minEdu) / 8))
        .range(d3.schemeGnBu[9]);
      svg
        .append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(counties.features)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("data-fips", (d) => d.id)
        .attr("data-education", (d) => {
          const result = educationData.filter((obj) => obj.fips === d.id)[0];
          return result.bachelorsOrHigher;
        })
        .transition()
        .duration(1000)
        .delay((d, i) => i)
        .ease(d3.easeElasticInOut)
        .attr("fill", (d) => {
          const result = educationData.filter((obj) => obj.fips === d.id)[0];
          return colorScale(result.bachelorsOrHigher);
        })
        .attr("d", path)
        .on("end", function (d) {
          d3.select(this)
            .on("mouseover", (e, d) => {
              tooltip
                .style("opacity", 0.9)
                .attr("data-education", () => {
                  const result = educationData.filter(
                    (obj) => obj.fips === d.id
                  )[0];
                  return result.bachelorsOrHigher;
                })
                .html(() => {
                  const result = educationData.filter(
                    (obj) => obj.fips === d.id
                  )[0];
                  return `${result.area_name}, ${result.state}: ${result.bachelorsOrHigher}%`;
                })
                .style("left", e.pageX + 10 + "px")
                .style("top", e.pageY - 28 + "px");
            })
            .on("mouseout", () => {
              tooltip.style("opacity", 0);
            });
        });

      drawLegend(svg, colorScale);
    }
  }, [loading]);

  useEffect(() => {
    if (fetchedData["Response"] === "choropleth-map") {
      setData(fetchedData["Data"]);
      setLoading(false);
    }
  }, [fetchedData]);

  return (
    <article className="chart-container" data-theme="light">
      <header data-theme="light">
        <h3 id="title">
          United States Educational Attainment <br />
          <small id="description" className="subtitle">
            {" "}
            Percentage of adults age 25 and older with a bachelor's degree or
            higher (2010-2014)
          </small>
        </h3>
      </header>
      <svg ref={svgRef} width={width} height={height}></svg>
    </article>
  );
}
