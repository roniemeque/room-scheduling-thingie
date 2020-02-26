import React from "react";
import styled, { css } from "styled-components";
import moment from "moment";
import PropTypes from "prop-types";

const convertMinutesToPercentage = (minutes, total = 720) =>
  (minutes * 100) / total;

const DayStyled = styled.li`
  ${props =>
    props.isWeekend &&
    css`
      background: #ffab91;
    `};
  ${props =>
    props.isToday &&
    css`
      background: #bce1ff;
      @media screen and (min-width: 800px) {
        position: sticky;
        top: 0;
        left: 0;
        z-index: 1;
      }
    `};
  padding: 1rem;
  border-radius: 3px;
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
  transition: all 0.2s;
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
  .sugestao {
    opacity: 0;
    transition: opacity 0.2s;
  }
  &:hover {
    cursor: pointer;
    background: #0074d9;
    color: white;
    .sugestao {
      opacity: 1;
    }
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

const Day = ({ date, events, setEvents, setLoading, setDate, setTime }) => {
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

  const deleteEvent = async ({ title, _id: id }) => {
    if (!window.confirm(`Apagar '${title}'?`)) {
      return;
    }

    setLoading(true);

    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || ""}/api/events/delete/${id}`
    );
    const data = await res.json();

    setLoading(false);
    setEvents(data.events);
  };

  const fillNewWithClicked = time => {
    setDate(date.toDate());

    const start = moment()
      .hour(time)
      .minutes(0);
    const end = moment()
      .hour(time + 1)
      .minutes(0);

    setTime([start.format("HH:mm"), end.format("HH:mm")]);

    document.querySelector(".quem-input").focus();

    //console.log(date, time, start, end);
  };

  const isWeekend = [0, 6].includes(date.day());
  const isToday = date.isSame(moment(), "day");

  return (
    <DayStyled isWeekend={isWeekend} isToday={isToday}>
      <h2>{date.format("ddd DD MMMM")}</h2>
      <ul className="day-blocks">
        {hourBlocks.map(hourBlock => (
          <Block key={hourBlock} onClick={() => fillNewWithClicked(hourBlock)}>
            <div className="indicator">{hourBlock}</div>
            <div className="box">
              <span className="sugestao">Criar aqui</span>
            </div>
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
            <span className="apagar" onClick={() => deleteEvent(eventBlock)}>
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
