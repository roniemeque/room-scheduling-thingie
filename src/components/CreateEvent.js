import React, { useState } from "react";
import DatePicker from "react-date-picker";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import moment from "moment";
import axios from "axios";
import styled from "styled-components";

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

const CreateEvent = ({ setEvents }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(["10:00", "11:00"]);
  const [owner, setOwner] = useState("");
  const [title, setTitle] = useState("");

  const createEvent = async e => {
    e.preventDefault();

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

    setEvents(data.events);
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
        />
        <input
          type="text"
          onChange={e => setTitle(e.currentTarget.value)}
          placeholder="Motivo (opcional)"
          className="input-text"
        />
        <DatePicker
          onChange={newDate => setDate(newDate)}
          value={date}
          minDate={new Date()}
          maxDate={moment()
            .add("6", "days")
            .toDate()}
        ></DatePicker>
        <TimeRangePicker
          value={time}
          onChange={newTime => setTime(newTime)}
          minTime="08:00"
          maxTime="20:00"
          format="HH:mm"
        />
        <ButtonCreate>Ok</ButtonCreate>
      </form>
    </CreateStyled>
  );
};

export default CreateEvent;
