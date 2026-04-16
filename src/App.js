import React, {useEffect, useState} from 'react';
import {Link, Routes, Route} from 'react-router-dom';

import './styles/index.scss';
import './App.scss';
import Nav from "./components/Nav/Nav";
import Intro from "./components/Intro/Intro";
import Stages from "./components/Stages/Stages";
import Stage from "./components/Stage/Stage";
import Acts from "./components/Acts/Acts";
import Act from "./components/Act/Act";
import Maps from "./components/Maps/Maps";
import Shared from "./components/Shared/Shared";
import OfflineIndicator from "./components/OfflineIndicator/OfflineIndicator";
import Footer from "./components/Footer/Footer";

// data provider for the app
// import defaultData from './public/g2024.json';

function App() {
  const year = new Date().getFullYear();
  let defaultData = {
    locations: []
  };

  const [data, setData] = useState(defaultData);

  const routeArray = [
    {
      path: '/',
      element: <Intro data={data} />,
      name: 'My schedule',
      inNav: true,
      isActive: true
    },
    {
      path: '/stages',
      element: <Stages data={data} />,
      name: 'Tracks',
      inNav: true,
      isActive: false
    },
    {
      path: '/stages/:name',
      element: <Stage data={data} />,
      name: 'Stage',
      inNav: false,
      isActive: false
    },
    {
      path: '/acts',
      element: <Acts data={data} />,
      name: 'Sessions',
      inNav: true,
      isActive: false
    },
    {
      path: '/acts/:name',
      element: <Act data={data} />,
      name: 'Act',
      inNav: false,
      isActive: false
    },
    {
      path: '/map',
      element: <Maps />,
      name: 'Venue',
      inNav: true,
      isActive: false
    },
    {
      path: '/shared/:lineup',
      element: <Shared data={data}/>,
      name: 'Shared',
      inNav: false,
      isActive: false
    },
  ];


  const day3DatePrefix = '2026-04-17';

  function getDay3OnlyData(scheduleData) {
    const day3Locations = scheduleData.locations
      .map((location) => ({
        ...location,
        events: location.events.filter((event) => event.start.startsWith(day3DatePrefix))
      }))
      .filter((location) => location.events.length > 0);

    return {
      ...scheduleData,
      locations: day3Locations
    };
  }

  // fetch data — CityJS London timetable (Day 3 only)
  useEffect(() => {
    fetch('/cityjs-london.json')
      .then(response => response.json())
      .then(scheduleData => setData(getDay3OnlyData(scheduleData)))
      .catch(error => {
        console.error('Failed to load CityJS schedule:', error);
      });
  }, []);

  return (
    <div className="App">
      <OfflineIndicator />
      <header className="App-header Header">
        <h3 className="Header-logo">
          <Link to={'/'}>
            <img src="/cityjs.svg" alt={`CityJS London ${year}`}/>
          </Link>
        </h3>
        <Nav routes={routeArray} />
      </header>
      <main className="App-main">
        <section className="Main">
          <Routes>
            {routeArray.map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              )
            })}
          </Routes>
        </section>
      </main>
      <Footer data={data} />
    </div>
  );
}

export default App;
