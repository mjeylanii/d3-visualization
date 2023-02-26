import React from "react";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function TreeMap({ fetchData }) {
  const svgRef = useRef();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const width = 1200;
  const height = 500;

  useEffect(() => {
    if (fetchData["Response"] === "tree-map") {
      setData(fetchData["Data"]);
      setLoading(false);
    }
  }, [fetchData]);

  return <div>TreeMap</div>;
}
