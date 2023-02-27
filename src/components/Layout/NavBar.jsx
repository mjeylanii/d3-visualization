import React from "react";

export default function NavBar({
  selectedChart,
  setSelectedChart,
  loading,
  setLoading,
}) {
  const chartSwitch = (e) => {
    if (loading === false) setLoading(true);
    switch (e.target.value) {
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
            value={"Bar Chart"}
            className={selectedChart === "bar-chart" ? "btn-active" : ""}
            role="button"
            onClick={chartSwitch}
          >
            Bar Chart
          </button>
        </li>
        <li>
          <button
            value={"Scatter Plot"}
            className={selectedChart === "scatter-plot" ? "btn-active" : ""}
            role="button"
            onClick={chartSwitch}
          >
            Scatter Plot
          </button>
        </li>
        <li>
          <button
            value={"Heat Map"}
            className={selectedChart === "heat-map" ? "btn-active" : ""}
            role="button"
            onClick={chartSwitch}
          >
            Heat Map
          </button>
        </li>
        <li>
          <button
            value={"Choropleth Map"}
            className={selectedChart === "choropleth-map" ? "btn-active" : ""}
            role="button"
            onClick={chartSwitch}
          >
            Choropleth Map
          </button>
        </li>
        <li>
          <button
            value={"Tree Map"}
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
