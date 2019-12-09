import React from "react";
import styled from "styled-components";
import moment from "moment";

const testEvents = [
  {
    startTime: "2019-12-09 10:00",
    endTime: "2019-12-09 11:00"
  }
];

const DayStyled = styled.li`
  h2 {
    margin-bottom: 1.5rem;
  }
`;

const Block = styled.li`
  min-height: 4rem;
  display: flex;
  .indicator {
    width: 3rem;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  .box {
    border-bottom: 1px solid grey;
    flex: 1;
  }
`;

const Day = ({ date }) => {
  // generating 8 blocks for counting from 8h to 20h
  // since we are starting from 8, just add it
  const hourBlocks = Array.from({ length: 12 }, (_, i) => i + 8);

  const eventBlocks = testEvents.map(testEvent => {
    const dayStart = date.clone().hour(8);
    console.log(dayStart.format("LLL"));

    return { ...testEvent };
  });

  return (
    <DayStyled>
      <h2>{date.format("LL")}</h2>
      <ul>
        {hourBlocks.map(hourBlock => (
          <Block>
            <div className="indicator">{hourBlock}</div>
            <div className="box"></div>
          </Block>
        ))}
      </ul>
    </DayStyled>
  );
};

export default Day;
