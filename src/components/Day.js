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
  background: #19ff0075;
  padding-left: 3rem;
  padding-right: 3rem;
  font-size: 1.4rem;
  .apagar {
    width: 2rem;
    height: 2rem;
    background: #737373;
    display: flex;
    align-items: center;
    color: white;
    justify-content: center;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    right: 0.5rem;
    transform: translateY(-50%);
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      background: red;
    }
  }
`;

const Day = ({ date, events, setEvents }) => {
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

  const deleteEvent = async id => {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || ""}/api/events/delete/${id}`
    );
    const data = await res.json();
    setEvents(data.events);
  };

  return (
    <DayStyled>
      <h2>{date.format("LL")}</h2>
      <ul className="day-blocks">
        {hourBlocks.map(hourBlock => (
          <Block key={hourBlock}>
            <div className="indicator">{hourBlock}</div>
            <div className="box"></div>
          </Block>
        ))}
        {eventsBlocks.map(eventBlock => (
          <EventBlock
            key={eventBlock.startPercentage}
            startPercentage={eventBlock.startPercentage}
            durationPercentage={eventBlock.durationPercentage}
          >
            <strong>{eventBlock.owner}</strong>
            <span>{eventBlock.title ? ` - ${eventBlock.title}` : ""}</span>
            <span
              className="apagar"
              onClick={() => deleteEvent(eventBlock._id)}
            >
              x
            </span>
          </EventBlock>
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
