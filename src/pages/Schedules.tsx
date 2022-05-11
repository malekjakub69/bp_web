import React, { useEffect, useState } from "react";
import { Button, Col, List, message, Modal, Row } from "antd";
import axios from "../api/axios";
import "./style.scss";
import { DeleteOutlined } from "@ant-design/icons";
import ShowScheduleData from "./ShowScheduleData";

interface ISchedule {
  name: string;
  id: number;
  fitness: number;
  state: string;
}

//Show schedules

function Schedules() {
  const [schedules, setSchedules] = useState([] as ISchedule[]);
  const [selected, setSelected] = useState(-1);
  const [timeCount, setTimeCount] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      let url = "get_schedule_names";
      let response = await axios.get(url);
      setSchedules(response.data);
    };
    fetchData();
  }, []);

  const selectSchedule = (id: number) => {
    setSelected(id);
  };

  const changeTimeCount = (newTime: number) => {
    if (newTime > 40 || newTime < 2) return;
    setTimeCount(newTime);
  };

  const generateSchedule = () => {
    axios.post("/generate_schedule", { time: timeCount });
    message.success("Vytváření rozvrhu úspěšně zahájeno. ");
    setSchedules([
      ...schedules,
      {
        name: "schedule",
        id: Math.floor(Math.random() * -10000),
        fitness: 0,
        state: "Připravuje se",
      },
    ]);
  };

  const deleteSchedule = (schedule: ISchedule) => {
    Modal.confirm({
      title: "Opravdu chceš smazat tento rozvrh? \n " + schedule.name,
      okText: "Ano",
      cancelText: "Ne",
      okType: "danger",
      onOk: () => {
        setSchedules((tmpSchedules) => {
          axios.delete("delete_schedule/" + schedule.id);
          return tmpSchedules.filter((item) => item.id !== schedule.id);
        });
      },
    });
  };

  const fitnessUpdated = async () => {
    let url = "get_schedule_names";
    let response = await axios.get(url);
    setSchedules(response.data);
  };

  return (
    <div className="schedules">
      <Row>
        <Col span={4} className={"leftSide"}>
          <div className={"generateNew"}>
            <Button
              onClick={generateSchedule}
              style={{ width: "90%" }}
              className={"myButton"}
            >
              Generovat nový
            </Button>
            <span className={"timeSpan"}>Čas</span>
            <div className={"timeCount"}>
              <Button
                disabled={timeCount === 2}
                onClick={() => changeTimeCount(timeCount - 1)}
              >
                -
              </Button>
              <span className={"number"}>{timeCount}</span>
              <Button
                disabled={timeCount === 40}
                onClick={() => changeTimeCount(timeCount + 1)}
              >
                +
              </Button>
            </div>
          </div>
          <hr />
          <List
            itemLayout="horizontal"
            className={"scheduleList"}
            dataSource={schedules}
            renderItem={(item) => (
              <List.Item
                className={"scheduleListItem"}
                onClick={() => selectSchedule(item.id)}
                style={selected === item.id ? { background: "#DDD" } : {}}
              >
                <List.Item.Meta
                  title={
                    <table style={{ width: "100%" }}>
                      <tr>
                        {selected === item.id && item.id > 0 && (
                          <td rowSpan={2} style={{ width: "40px" }}>
                            <DeleteOutlined
                              className={"icon"}
                              onClick={() => {
                                deleteSchedule(item);
                              }}
                              style={{ color: "red", marginLeft: 12 }}
                            />
                          </td>
                        )}
                        <td>{item.name}</td>
                        <td
                          rowSpan={2}
                          style={{ fontSize: "25px", textAlign: "right" }}
                        >
                          {(item.fitness * 100).toFixed(1) + "%"}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ color: "#888" }}>({item.state})</td>
                      </tr>
                    </table>
                  }
                />
              </List.Item>
            )}
          />
        </Col>
        <Col span={20}>
          {/*Show selected schedules*/}
          <ShowScheduleData
            scheduleId={selected}
            updateFitness={fitnessUpdated}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Schedules;
