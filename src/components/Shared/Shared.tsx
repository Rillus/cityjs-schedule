import ActGrid from "../ActGrid";
import {Data, EventType, Location} from "../../../types/act";
import {useParams} from "react-router-dom";

function Shared(props: {data: Data}) {

  // read url
  const { lineup } = useParams();

  const lineupFromUrl = lineup ? lineup : '';

  let savedActData: EventType[] = [];

  // get data of saved acts from cookie
  props.data.locations.forEach((location: Location, index: number) => {
    const filteredEvents: EventType[] = location.events.filter((act: EventType) => {
      // split lineup string into array
      const lineupArray = lineupFromUrl.split('-');
      const currentAct = `act_${act.short}`;
      return lineupArray.includes(currentAct);
    });

    if(filteredEvents.length > 0) {
      filteredEvents.forEach((act: EventType) => {
        savedActData.push({
          ...act,
          location: {
            id: index + 1,
            name: location.name
          }
        });
      });
    }
  });

  // reorder saved acts by start time
  savedActData = savedActData.sort((a: EventType, b: EventType) => {
    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });

  return <div>
    <h1 className="u-text-center">Shared schedule</h1>
    <p className="u-text-center">Sessions from the link you opened</p>
    {savedActData.length === 0 ? (
      <p style={{textAlign: 'center'}}>
        No sessions in this link. <br />
        Open &quot;Sessions&quot; or &quot;Tracks&quot; and save talks with the &#9734; button, then share again.
      </p>
    ) : (
      <ActGrid events={savedActData} options={{showStages: true}}></ActGrid>
    )}
  </div>
}

export default Shared;
