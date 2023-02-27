import { useEffect, useState } from "react";
import "./App.css";
import BarChart from "./components/BarChart";
import ScatterPlot from "./components/ScatterPlot";
import { fetchData } from "./api/fetchData";
import Footer from "./components/Layout/Footer";
import HeatMap from "./components/HeatMap";
import ChoroplethMap from "./components/ChoroplethMap";
import NavBar from "./components/Layout/NavBar";
import NotSupported from "./components/NotSupported";
import TreeMap from "./components/TreeMap";
import DataSelection from "./components/DataSelection";

function App() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState("scatter-plot");
  const [selectedData, setSelectedData] = useState("kickstarter-pledges");

  useEffect(() => {
    const getData = async () => {
      switch (selectedChart) {
        case "bar-chart":
          var response = await fetchData("bar-chart");
          var data = response;
          setData(data);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          break;
        case "scatter-plot":
          var response = await fetchData("scatter-plot");
          var data = response;
          setData(data);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          break;
        case "heat-map":
          var response = await fetchData("heat-map");
          var data = response;
          setData(data);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          break;
        case "choropleth-map":
          var response = await fetchData("choropleth-map");
          var data = response;
          setData(data);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          break;
        case "tree-map":
          var response = await fetchData(selectedData);
          var data = response;
          setData(data);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          break;

        default:
          var response = await fetchData("bar-chart");
          var data = response;
          setData(data);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          break;
      }
    };
    getData();
  }, [selectedChart, selectedData, loading]);

  return (
    <div>
      <em>FreeCodeCamp - Data Visualization Projects</em>
      <NavBar
        selectedChart={selectedChart}
        setSelectedChart={setSelectedChart}
        loading={loading}
        setLoading={setLoading}
      />

      <article>
        <div className="not-supported">
          <NotSupported />
        </div>
        <div className="chart-container">
          {selectedChart === "tree-map" ? (
            <header id="data-selection-header">
              {" "}
              <DataSelection
                setSelectedData={setSelectedData}
                setLoading={setLoading}
              />{" "}
            </header>
          ) : null}
          {loading ? (
            <div className="loading">
              {/* Loop for dots after "Loading" string */}
              Loading
            </div>
          ) : (
            <div>
              {selectedChart === "bar-chart" ? (
                <BarChart fetchedData={data} />
              ) : selectedChart === "scatter-plot" ? (
                <ScatterPlot fetchedData={data} />
              ) : selectedChart === "heat-map" ? (
                <HeatMap fetchedData={data} />
              ) : selectedChart === "choropleth-map" ? (
                <ChoroplethMap fetchedData={data} />
              ) : selectedChart === "tree-map" ? (
                <TreeMap selectedData={selectedData} fetchedData={data} />
              ) : (
                <BarChart fetchedData={data} />
              )}
            </div>
          )}
        </div>
      </article>
      <div id="tooltip"></div>
      <Footer />
    </div>
  );
}

export default App;
