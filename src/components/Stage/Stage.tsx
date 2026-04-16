import React, {useEffect} from 'react';
// import data from '../../data/g2023 2023-06-08.json';
import StageChip from '../StageChip/StageChip';
import ActGrid from "../ActGrid";
import Url from "../../helpers/url";
import {useParams} from "react-router-dom";
import {Data, Location} from "../../../types/act";
import HidePastActsToggle from "../HidePastActsToggle/HidePastActsToggle";
import useHidePastActs from "../../hooks/useHidePastActs";
import { filterPastActs } from "../../utils/actFilters";

function Stage(props: {data: Data}) {
  const { name } = useParams();
  const url = name
  const data = props.data;
  const { hidePastActs, toggleHidePastActs } = useHidePastActs();

  const [stage, setStage] = React.useState<Location | null>(null);

  useEffect(() => {
    const stages: Location[] = data.locations.map((location, index) => {
      return {
        id: index+1,
        name: location.name,
        events: location.events
      }
    });

    const matchingStage: Location = stages.filter((stage, index) => {
      if (Url.safeName(stage.name) === url) {
        return {
          id: stage.id,
          url: url,
          name: stage.name,
          events: stage.events
        }
      }
      return null;
    })[0];

    setStage(matchingStage);
  }, [data, url]);

  if (!stage) {
    return <div>
      <h1 className="u-text-center">Track not found</h1>
    </div>
  }

  // Filter past acts if the setting is enabled
  const filteredEvents = filterPastActs(stage.events, hidePastActs);

  return <div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto 1fr', 
        alignItems: 'center', 
        marginBottom: '1rem',
        gap: '1rem'
      }}>
        <div></div>
        <h1 className="u-text-center" style={{ margin: 0 }}>
          <StageChip name={stage.name} id={stage.id} />
        </h1>
        <div style={{ justifySelf: 'end' }}>
          <HidePastActsToggle 
            hidePastActs={hidePastActs} 
            onToggle={toggleHidePastActs} 
          />
        </div>
      </div>
      <ActGrid events={filteredEvents}/>
    </div>
}

export default Stage;
