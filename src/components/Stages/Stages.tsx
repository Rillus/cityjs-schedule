import React, {useEffect, useState} from 'react';
import StageChip from '../StageChip/StageChip';

import {Data, Location} from '../../../types/act';

import './_Stages.scss';

function Stages({data}: {data: Data}) {
  const [search, setSearch] = useState('');
  const [stages, setStages]: [Location[], any] = useState([]);

  function getStages() {
    return data.locations.map((location, index) => {
      return {
        id: index+1,
        name: location.name,
      }
    })
  }

  useEffect(() => {
    setStages(
      data.locations.map((location, index) => ({
        id: index + 1,
        name: location.name,
      }))
    );
  }, [data]);

  return <div className="Stages">
      <h1 className="Stages-heading u-text-center">
        Tracks &amp; rooms
      </h1>

      <div className={"Search"}>
        <input
          className={"Input"}
          type={"text"}
          data-testid={"Search"}
          aria-label={"Search for a track or room"}
          placeholder={"Search for a track or room"}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            if (e.target.value.length === 0) {
              setStages(getStages());
            } else {
              setStages(getStages().filter((stage: Location) => stage.name.toLowerCase().includes(e.target.value.toLowerCase())));
            }
          }}
        />
      </div>

      <div className="Stages-list">
        {stages.map((stage, index) => (
          <StageChip
            key={index}
            name={stage.name}
            id={stage.id}
          />
        ))}
      </div>
    </div>
}

export default Stages;
