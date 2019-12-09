import React, { useState, useEffect } from "react";
import moment from "moment";
import styled from "styled-components";

import Day from "./Day";

const events = [
  {
    startTime: "2019-12-09 10:00",
    endTime: "2019-12-09 11:30",
    title: "Reunião legal",
    owner: "Ronie"
  },
  {
    startTime: "2019-12-09 15:00",
    endTime: "2019-12-09 16:00",
    title: "Reunião legal",
    owner: "Ronie"
  },
  {
    startTime: "2019-12-10 12:00",
    endTime: "2019-12-10 13:00",
    title: "Reunião legal",
    owner: "Ronie"
  }
];

const List = styled.ul`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 3.5rem;
  overflow: auto;
  grid-template-columns: repeat(7, 20rem);
`;

const DaysList = () => {
  // creating default days starting at 8 for comparison purposes
  const [days] = useState(
    Array.from({ length: 7 }, (_, i) =>
      moment()
        .add(i, "days")
        .hour(8)
        .minute(0)
    )
  );

  const fetchEvents = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || ""}/api/hello`
    );
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    fetchEvents();
  }, [""]);

  return (
    <List>
      {days.map(day => {
        const dayEvents = events.filter(
          ({ startTime }) => day.format("L") === moment(startTime).format("L")
        );

        return <Day events={dayEvents} key={day.unix()} date={day}></Day>;
      })}
    </List>
  );
};

export default DaysList;
