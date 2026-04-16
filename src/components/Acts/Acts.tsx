import React, {useEffect, useState, useRef} from "react";
import ActGrid from "../ActGrid";
import {Loader} from "../Loader";
import styles from "./Acts.module.scss";
import HidePastActsToggle from "../HidePastActsToggle/HidePastActsToggle";
import useHidePastActs from "../../hooks/useHidePastActs";
import { filterPastActs } from "../../utils/actFilters";

// import types
import {EventType, Data} from "../../../types/act";
import {useParams} from "react-router-dom";

interface ActsProps {
  data: Data;
}

const Acts: React.FC<ActsProps> = ({data}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [acts, setActs] = useState<EventType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>(useParams().search ?? '');
  const [errorMessage, setErrorMessage] = useState<string>('')
  const mainElement = useRef<HTMLElement>(null);
  const { hidePastActs, toggleHidePastActs } = useHidePastActs();

  let defaultPageAsString = useParams().page;
  let defaultPage: number;
  if (defaultPageAsString === undefined) {
    defaultPage = 1;
  } else {
    defaultPage = parseInt(defaultPageAsString);
  }
  const [page, setPage] = useState<number>(defaultPage);

  const take = 20;

  // This useEffect hook is used to update the page and search in the URL
  useEffect(() => {
    window.history.pushState({}, '', `?page=${page}&search=${search}`);
  }, [setPage, page, search, setSearch]);

  // This useEffect hook is used to filter the acts based on the search and page
  useEffect(() => {
    const dataActs: EventType[] = data.locations
      .map((location, locationIndex) => {
        const locationEvents: EventType[] = location.events;
        return locationEvents.map((act: EventType) => {
          // if start and end are not present, set them to the default values
          return {
            ...act,
            location: {
              name: location.name,
              id: locationIndex+1
            }
          };
        });
      })
      .flat();

    let allActs: EventType[] = dataActs
      .filter((act) => {
        if (search) {
          return act.name.toLowerCase().includes(search.toLowerCase());
        }
        return true;
      })
      .sort((a, b) => {
        const aStart = new Date(a.start).getTime();
        const bStart = new Date(b.start).getTime();
        return aStart - bStart;
      });

    // Filter past acts if the setting is enabled
    allActs = filterPastActs(allActs, hidePastActs);

    const totalPageCount = Math.ceil(allActs.length / take);

    if (totalPages === 0 || totalPages !== totalPageCount) {
      setTotalPages(totalPageCount);
    }

    if (page > totalPageCount && totalPages > 0) {
      setPage(totalPageCount);
      return;
    }

    // the first act should be 10 pages back
    const maxPagesToShow = 10;
    const firstActIndex = page > maxPagesToShow ? (page - 10) * take : 0;
    const lastActIndex = page * take;

    const updatedActs: EventType[] = allActs.slice(firstActIndex, lastActIndex);
    setActs(updatedActs);
    if (allActs.length === 0) {
      setErrorMessage('No results found');
    }
  }, [data, search, page, totalPages, hidePastActs]);

  // lazy load next page when scrolled to the bottom
  useEffect(() => {
    const handleScroll = () => {
      // get mainElement height
      if (!mainElement.current) {
        return;
      }

      if (
        document.documentElement.scrollTop >= mainElement.current.offsetHeight - window.innerHeight
      ) {
        if (page < totalPages) {
          setPage(page + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, mainElement, totalPages]);

  return <main ref={mainElement}>
    <div className={"Search"}>
      <input
        className={"Input"}
        type={"text"}
        id={"actSearch"}
        aria-label={"Search for a session"}
        placeholder={"Search for a session"}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          if (e.target.value.length === 0) {
            if (acts.length === 0){
              setIsLoading(true)
            }
          } else if (e.target.value.length >= 3) {
            // setIsLoading(true)
            setErrorMessage('');
          } else {
            setIsLoading(false)
            setErrorMessage('3 or more characters required to search');
            setActs([]);
          }
        }}
      />

      <button
        className={`Button ${styles.Acts_clearButton}`}
        onClick={() => {
          setSearch('');
        }}
      >
        &times;
      </button>

      <HidePastActsToggle 
        hidePastActs={hidePastActs} 
        onToggle={toggleHidePastActs} 
      />
    </div>

    <ActGrid
      events={acts}
      options={{showStages: true}} />

    <div className={styles.Acts_noResultsWrapper}>
      <div className={styles.Acts_noResultsInner}>
        {errorMessage && (
          <p
            className={styles.Acts_noResults_text}>
            {errorMessage}
          </p>
        )}
        {isLoading &&
          (
              <Loader size={"100px"} />
          )
        }
      </div>
    </div>
  </main>;
}

export default Acts;
