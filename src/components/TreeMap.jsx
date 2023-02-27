import React from "react";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { transition } from "d3";

export default function TreeMap({ fetchedData, selectedData }) {
  const svgRef = useRef();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const width = 1200;
  const height = 1200;

  const drawLegend = (svg, colorScale, root, tooltip) => {
    //Draw legend at bottom of svg without axis
    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${width / 4 - 50}, ${height - 50})`);

    const categories = root.leaves().map((d) => d.data.category);
    const uniqueCategories = [...new Set(categories)];

    const legendScale = d3.scaleBand().domain(uniqueCategories).range([0, 200]);

    //Draw rects with empty space between them
    legend
      .selectAll("rect")
      .data(uniqueCategories)
      .join("rect")
      .attr("x", (d, i) => legendScale(d) * 4)
      .attr("y", 0)
      .attr("width", 30)
      .attr("height", 30)
      .attr("fill", (d) => colorScale(d))
      .attr("class", "legend-item")
      .on("mouseover", (e, d) => {
        tooltip
          .style("opacity", 1)
          .style("visibility", "visible")
          .style("left", `${e.pageX + 10}px`)
          .style("top", `${e.pageY - 28}px`)
          .html(`<p>${d}</p>`);
      })
      .on("mouseout", (e, d) => {
        tooltip.style("opacity", 0).style("visibility", "hidden");
      });

    //Append text to legend "Hover over square for more info"
    legend
      .append("text")
      .attr("x", width / 4 - 50)
      .attr("y", 30)
      .attr("dy", "1em")
      .attr("font-size", "1em")
      .text("Hover over square for more info");
  };

  useEffect(() => {
    if (loading === false) {
      const svg = d3.select(svgRef.current);
      const root = d3.hierarchy(data).sum((d) => d.value);
      const treeMap = d3.treemap().size([width, height - 100]);
      const maxLength = d3.max(root.leaves(), (d) => d.data.name.length);
      const tooltip = d3.select("#tooltip");
      const formatValue = d3.format("$,d");
      const categories = root.leaves().map((d) => d.data.category);

      treeMap(root);
      const color = d3.scaleOrdinal(d3.schemeCategory10);
      const leaf = svg
        .selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

      //Draw rectangles
      leaf
        .append("rect")
        .attr("class", "tile")
        .attr("data-name", (d) => d.data.name)
        .attr("data-category", (d) => d.data.category)
        .attr("data-value", (d) => d.data.value)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 10)
        .attr("fill", (d) => color(d.data.category))
        .on("end", function (d) {
          //Show tooltip on mouseover
          d3.select(this)
            .on("mouseover", (e, d) => {
              tooltip
                .style("opacity", 0.9)
                .attr("data-value", d.data.value)
                .html(
                  `Name: ${d.data.name}<br>Category: ${
                    d.data.category
                  }<br>Value: ${formatValue(d.data.value)}`
                )
                .style("left", e.pageX + 10 + "px")
                .style("top", e.pageY - 28 + "px");
            })
            .on("mouseout", (d) => {
              tooltip.style("opacity", 0).attr("data-value", null).html("");
            });
        });

      //Append text to leaf, truncate if too long
      leaf
        .append("text")
        .attr("class", "tile-text")
        .selectAll("tspan")
        .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .join("tspan")
        .attr("x", 4)
        .attr("y", (d, i) => 13 + i * 10)
        .text((d) => {
          if (d.length > maxLength / 2) {
            return d.substring(0, maxLength / 2) + "...";
          } else {
            return d;
          }
        })
        .attr("font-size", 10)
        .attr("fill", "black");

      drawLegend(svg, color, root, tooltip);
    }
  }, [loading]);

  useEffect(() => {
    if (fetchedData["Response"] === "tree-map") {
      setData(fetchedData["Data"]);
      setLoading(false);
    }
  }, [fetchedData]);

  return (
    <article data-theme="light">
      <header>
        <h3 id="title">
          {selectedData === "kickstarter-pledges"
            ? "Kickstarter Pledges"
            : selectedData === "movie-sales"
            ? "Movie Sales"
            : "Video Game Sales"}
          <br />
          {selectedData === "kickstarter-pledges" ? (
            <small id="description">Top 100 Most Prolific Inventors</small>
          ) : selectedData === "movie-sales" ? (
            <small id="description">
              Top 100 Most Profitable Movies Grouped By Genre
            </small>
          ) : (
            <small id="description">
              Top 100 Most Sold Video Games Grouped By Platform
            </small>
          )}
        </h3>
      </header>
      <svg ref={svgRef} width={width} height={height}></svg>
    </article>
  );
}
