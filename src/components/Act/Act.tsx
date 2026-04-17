import React, {useEffect} from 'react';
// import data from '../../data/g2023 2023-06-08.json';
import StageChip from '../StageChip/StageChip';
import ActGrid from "../ActGrid";
import SessionDetail from "../SessionDetail/SessionDetail";
import Url from "../../helpers/url";
import {useParams} from "react-router-dom";
import {Data, Location, ActType, EventType} from "../../../types/act";

function Act(props: { data: Data }) {
  const { name } = useParams();
  const url = name
  const data = props.data;

  const [act, setAct] = React.useState<EventType>();
  const [actWithEvents, setActWithEvents] = React.useState<EventType[]>();

  useEffect(() => {
    const locationEvents: EventType[] = data.locations.flatMap((location: Location, locationIndex: number) => {
        return location.events.map((event: ActType) => {
          return {
            location: {
              name: location.name,
              id: locationIndex+1
            },
            ...event
          }
        })
    });

    const acts: EventType[] = locationEvents
      .filter((event: EventType) =>
        Url.decodePathSlug(Url.safeName(event.name)) === Url.decodePathSlug(url)
      );

    if (acts.length > 0) {
      setAct(acts[0]);
      setActWithEvents(acts);
    }
  }, [data, url]);

  if (!act) {
    return <div>
      <h1 className="u-text-center">Session not found</h1>
    </div>
  }

  return <div>
      <h1 className="u-text-center">
        {act && <StageChip name={act.name} id={act.id} />}
      </h1>
      {act && <SessionDetail event={act} />}
      {actWithEvents &&
        <ActGrid events={actWithEvents} options={{showStages: true}} />
      }
    </div>
}

export default Act;
