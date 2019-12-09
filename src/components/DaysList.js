import React, { useState } from "react";
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
  grid-gap: 2.5rem;
  overflow: auto;
`;

const DaysList = () => {
  // creating default days starting at 8 for comparison purposes
  const [days] = useState(
    Array.from({ length: 3 }, (_, i) =>
      moment()
        .add(i, "days")
        .hour(8)
        .minute(0)
    )
  );

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
