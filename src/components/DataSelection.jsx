import React, { useEffect } from "react";
import { useState } from "react";

export default function DataSelection({
  selectedData,
  setSelectedData,
  setLoading,
}) {
  const [selectedRadio, setSelectedRadio] = useState("kickstarter-pledges");

  useEffect(() => {
    setSelectedData(selectedRadio);
  }, [selectedRadio]);

  const handleChange = (e) => {
    setSelectedData(e.target.value);
    setSelectedRadio(e.target.value);
    setLoading(true);
  };
  return (
    <div className="dataset-radios" data-theme="dark">
      <div>
        <input
          type="radio"
          id="kickstarter-pledges"
          name="dataset"
          value="kickstarter-pledges"
          onChange={handleChange}
          checked={selectedRadio === "kickstarter-pledges"}
        />
        <label htmlFor="kickstarter-pledges">Kickstarter Pledges</label>
      </div>
      <div>
        <input
          type="radio"
          id="movie-sales"
          name="dataset"
          value="movie-sales"
          onChange={handleChange}
          checked={selectedRadio === "movie-sales"}
        />
        <label htmlFor="movie-sales">Movie Sales</label>
      </div>
      <div>
        <input
          type="radio"
          id="video-game-sales"
          name="dataset"
          value="video-game-sales"
          onChange={handleChange}
          checked={selectedRadio === "video-game-sales"}
        />
        <label htmlFor="video-game-sales">Video Game Sales</label>
      </div>
    </div>
  );
}
