async function fetchData(args) {
  switch (args) {
    case "bar-chart":
      var response = await fetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
      );
      var data = await response.json();
      return { Data: data, Response: "bar-chart" };
    case "scatter-plot":
      var response = await fetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
      );
      var data = await response.json();
      return {
        Data: data,
        Response: "scatter-plot",
      };
    case "heat-map":
      var response = await fetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
      );
      var data = await response.json();
      return { Data: data, Response: "heat-map" };
    case "tree-map":
      var response = await fetch(
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
      );
      var data = await response.json();
      return { Data: data, Response: "tree-map" };
    case "choropleth-map":
      //Fetch counties and education data
      var response = await fetch(
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
      );
      var counties = await response.json();
      var response = await fetch(
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
      );
      var education = await response.json();
      return {
        Data: { counties, education },
        Response: "choropleth-map",
      };
    default:
      return { Data: null, Response: null };
  }
}

export { fetchData };
