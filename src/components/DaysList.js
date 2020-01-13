import React, { useState, useEffect } from "react";
import moment from "moment";
import styled from "styled-components";
import CreateEvent from "./CreateEvent";

import Day from "./Day";

const List = styled.ul`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 3.5rem;
  overflow: auto;
  grid-template-columns: repeat(60, 20rem);
`;

const DaysList = () => {
  // creating default days starting at 8 for comparison purposes
  const [days] = useState(
    Array.from({ length: 60 }, (_, i) =>
      moment()
        .add(i, "days")
        .hour(8)
        .minute(0)
    )
  );
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    console.log("Buscando...");

    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || ""}/api/events/week`
    );
    const data = await res.json();
    setEvents(data.events);
  };

  useEffect(() => {
    fetchEvents();
    window.refreshInterval = window.setInterval(() => {
      if (!document.hidden) {
        fetchEvents();
      }
    }, 10000);
    return () => {
      clearInterval(window.refreshInterval);
    };
  }, []);

  return (
    <div>
      <CreateEvent setEvents={setEvents}></CreateEvent>
      <List>
        {days.map(day => {
          const dayEvents = events.filter(
            ({ startTime }) => day.format("L") === moment(startTime).format("L")
          );

          return (
            <Day
              setEvents={setEvents}
              events={dayEvents}
              key={day.unix()}
              date={day}
            ></Day>
          );
        })}
      </List>
    </div>
  );
};

export default DaysList;
