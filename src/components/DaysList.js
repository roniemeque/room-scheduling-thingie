import React, { useState } from "react";
import moment from "moment";
import styled from "styled-components";

import Day from "./Day";

const List = styled.ul`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 2.5rem;
  overflow: auto;
`;

const DaysList = () => {
  // creating default days starting at 8 for comparison purposes
  const [days] = useState(
    Array.from({ length: 3 }, (_, i) => moment().add(i, "days"))
      .hour(8)
      .minute(0)
  );

  return (
    <List>
      {days.map(day => (
        <Day key={day.unix()} date={day}></Day>
      ))}
    </List>
  );
};

export default DaysList;
