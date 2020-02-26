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
  grid-template-columns: repeat(60, 25rem);
  margin-top: 2rem;
`;

const DaysList = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(["10:00", "11:00"]);

  // creating default days starting at 8 for comparison purposes
  const [days] = useState(
    Array.from({ length: 60 }, (_, i) =>
      moment()
        .add(i - 1, "days")
        .hour(8)
        .minute(0)
    )
  );
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    console.log("buscando...");

    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || ""}/api/events/week`
    );
    const data = await res.json();
    setEvents(data.events);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
    window.refreshInterval = window.setInterval(() => {
      if (!document.hidden) {
        fetchEvents();
      }
    }, 120000);
    return () => {
      clearInterval(window.refreshInterval);
    };
  }, []);

  return (
    <div>
      <CreateEvent
        date={date}
        setDate={setDate}
        time={time}
        setTime={setTime}
        setEvents={setEvents}
        setLoading={setLoading}
      ></CreateEvent>
      <div className={`loading ${loading && "ativo"}`}>
        <p>carregando...</p>
      </div>
      <List>
        {days.map(day => {
          const dayEvents = events.filter(
            ({ startTime }) => day.format("L") === moment(startTime).format("L")
          );

          return (
            <Day
              setEvents={setEvents}
              setLoading={setLoading}
              events={dayEvents}
              key={day.unix()}
              date={day}
              setDate={setDate}
              setTime={setTime}
            ></Day>
          );
        })}
      </List>
    </div>
  );
};

export default DaysList;
