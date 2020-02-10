import React, { useState } from "react";
import DatePicker from "react-date-picker";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import moment from "moment";
import axios from "axios";
import styled from "styled-components";
import {
  getOwnerLocalstorage,
  setOwnerLocalstorage
} from "../helpers/localStorage";

const splitTime = time => time.split(":");

const comparableMoment = time => {
  const [hours, minutes] = splitTime(time);
  return moment()
    .hour(hours)
    .minute(minutes);
};

const ButtonCreate = styled.button`
  margin-left: 1rem;
  background-color: black;
  color: white;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 10px;
  align-items: initial;
  font-size: 1.6rem;
  border-radius: 7px;
  padding: 0.6rem 2rem;
  transition: all 0.2s ease 0s;
`;

const CreateStyled = styled.div`
  form {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .input-text {
    min-height: 3rem;
    border: 1px solid black;
    margin: 0 0.5rem;
  }
  .react-date-picker {
    margin: 0 0.5rem;
  }
`;

const CreateEvent = ({ setEvents, setLoading }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(["10:00", "11:00"]);
  const [owner, setOwner] = useState(getOwnerLocalstorage());
  const [title, setTitle] = useState("");

  const createEvent = async e => {
    e.preventDefault();

    setLoading(true);

    const [start, end] = time;
    const startTime = `${moment(date).format("YYYY-MM-DD")} ${start}`;
    const endTime = `${moment(date).format("YYYY-MM-DD")} ${end}`;

    const { data } = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL || ""}/api/events/create`,
      {
        params: {
          owner,
          title,
          startTime,
          endTime
        }
      }
    );

    setOwnerLocalstorage(owner);
    setEvents(data.events);
    setLoading(false);
  };

  const onRangeUpdate = newTime => {
    const [newStart] = newTime;
    const [currentStart] = time;

    if (currentStart !== newStart) {
      const startTimeMoment = comparableMoment(newStart);

      return setTime([
        newStart,
        startTimeMoment.add(1, "hours").format("HH:mm")
      ]);
    }

    setTime(newTime);
  };

  return (
    <CreateStyled>
      Adicionar
      <form onSubmit={createEvent} action="">
        <input
          type="text"
          onChange={e => setOwner(e.currentTarget.value)}
          placeholder="Quem reserva?"
          className="input-text"
          value={owner}
        />
        <input
          type="text"
          onChange={e => setTitle(e.currentTarget.value)}
          placeholder="Motivo (opcional)"
          className="input-text"
          value={title}
        />
        <DatePicker
          onChange={newDate => setDate(newDate)}
          value={date}
          minDate={new Date()}
          maxDate={moment()
            .add("59", "days")
            .toDate()}
        ></DatePicker>
        <TimeRangePicker
          value={time}
          onChange={onRangeUpdate}
          minTime="08:00"
          maxTime="20:00"
          format="HH:mm"
          disableClock
        />
        <ButtonCreate>Ok</ButtonCreate>
      </form>
    </CreateStyled>
  );
};

export default CreateEvent;
