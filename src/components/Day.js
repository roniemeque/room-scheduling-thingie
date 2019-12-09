import React from "react";
import styled from "styled-components";
import moment from "moment";
import PropTypes from "prop-types";

const convertMinutesToPercentage = (minutes, total = 720) =>
  (minutes * 100) / total;

const DayStyled = styled.li`
  h2 {
    margin-bottom: 1.5rem;
  }
  .day-blocks {
    position: relative;
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

const EventBlock = styled.div`
  position: absolute;
  height: ${props => `${props.durationPercentage}%`};
  top: ${props => `${props.startPercentage}%`};
  width: 100%;
  opacity: 0.5;
  background: red;
`;

const Day = ({ date, events }) => {
  // generating 8 blocks for counting from 8h to 20h
  // since we are starting from 8, just add it
  const hourBlocks = Array.from({ length: 12 }, (_, i) => i + 8);

  const eventsBlocks = events.map(event => {
    const startPosMinutesPast = moment(event.startTime).diff(date, "minutes");
    const eventDuration = moment(event.endTime).diff(
      moment(event.startTime),
      "minutes"
    );

    const startPercentage = convertMinutesToPercentage(startPosMinutesPast);
    const durationPercentage = convertMinutesToPercentage(eventDuration);

    return {
      startPosMinutesPast,
      eventDuration,
      startPercentage,
      durationPercentage,
      ...event
    };
  });

  console.log(eventsBlocks);

  return (
    <DayStyled>
      <h2>{date.format("LL")}</h2>
      <ul className="day-blocks">
        {hourBlocks.map(hourBlock => (
          <Block>
            <div className="indicator">{hourBlock}</div>
            <div className="box"></div>
          </Block>
        ))}
        {eventsBlocks.map(eventBlock => (
          <EventBlock
            startPercentage={eventBlock.startPercentage}
            durationPercentage={eventBlock.durationPercentage}
          ></EventBlock>
        ))}
      </ul>
    </DayStyled>
  );
};

Day.propTypes = {
  date: PropTypes.object.isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired
    })
  )
};

export default Day;
