import React from "react";

export default function NavBar({
  selectedChart,
  setSelectedChart,
  loading,
  setLoading,
}) {
  const chartSwitch = (e) => {
    if (loading === false) setLoading(true);
    switch (e.target.innerText) {
      case "Bar Chart":
        setSelectedChart("bar-chart");
        break;
      case "Scatter Plot":
        setSelectedChart("scatter-plot");
        break;
      case "Heat Map":
        setSelectedChart("heat-map");
        break;
      case "Choropleth Map":
        setSelectedChart("choropleth-map");
        break;
      case "Tree Map":
        setSelectedChart("tree-map");
        break;
      default:
        setSelectedChart("bar-chart");
        break;
    }
  };
  return (
    <nav>
      <ul>
        <li>
          <button
            className={selectedChart === "bar-chart" ? "btn-active" : ""}
            role="button"
            onClick={chartSwitch}
          >
            Bar Chart
          </button>
        </li>
        <li>
          <button
            className={selectedChart === "scatter-plot" ? "btn-active" : ""}
            role="button"
            onClick={chartSwitch}
          >
            Scatter Plot
          </button>
        </li>
        <li>
          <button
            className={selectedChart === "heat-map" ? "btn-active" : ""}
            role="button"
            onClick={chartSwitch}
          >
            Heat Map
          </button>
        </li>
        <li>
          <button
            className={selectedChart === "choropleth-map" ? "btn-active" : ""}
            role="button"
            onClick={chartSwitch}
          >
            Choropleth Map
          </button>
        </li>
        <li>
          <button
            className={selectedChart === "tree-map" ? "btn-active" : ""}
            role="button"
            onClick={chartSwitch}
          >
            Tree Map
          </button>
        </li>
      </ul>
    </nav>
  );
}
