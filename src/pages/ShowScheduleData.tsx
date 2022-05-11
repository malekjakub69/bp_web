import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import "./style.scss";

interface IScheduleData {
  id: number;
  leader_name: string;
  participant_name: string;
  competence_name: string;
  leader_id: number;
  participant_id: number;
  timeblock_id: number;
  color: string;
}

interface ILeader {
  id: number;
  name: string;
  nickname: string;
  surname: string;
}

interface ISelectedItems {
  time_id: number;
  leader_id: number;
  item_id: number;
}

//Show selected schedules

function ShowScheduleData({ scheduleId, updateFitness }: any) {
  const [leaders, setLeaders] = useState([] as ILeader[]);
  const [tableData, setTableData] = useState([] as IScheduleData[]);

  const [selectedItems, setSelectedItems] = useState([] as ISelectedItems[]);

  const [timeBlocks] = useState([] as number[]);
  const [actualScheduleId, setActualScheduleId] = useState(-1);

  const selectedColor = "#4f71ff";

  useEffect(() => {
    const fetchData = async () => {
      if (leaders.length === 0) {
        let data = await axios.get("/leaders");
        setLeaders(data.data);
      }

      if (actualScheduleId !== scheduleId) {
        let response = await axios.get("get_schedule/" + scheduleId);
        setTableData(response.data);
        setActualScheduleId(scheduleId);
        setSelectedItems([] as ISelectedItems[]);
      }
    };
    fetchData();
  }, [actualScheduleId, leaders.length, scheduleId, tableData]);

  if (tableData) {
    tableData.forEach((item: IScheduleData) => {
      if (!timeBlocks.some((arr) => arr === item.timeblock_id)) {
        timeBlocks.push(item.timeblock_id);
      }
    });
  }

  function selectItem(time: number, leader_id: number, item_id: number) {
    let item2: ISelectedItems;
    if (selectedItems[0]) {
      setSelectedItems([
        {
          time_id: time,
          leader_id: leader_id,
          item_id: item_id,
        },
        selectedItems[0],
      ]);
    } else {
      setSelectedItems([
        {
          time_id: time,
          leader_id: leader_id,
          item_id: item_id,
        },
      ]);
    }

    console.log(selectedItems);
  }

  async function switchItems() {
    await axios.post("change_schedule", {
      item_1: selectedItems[0],
      item_2: selectedItems[1],
      schedule_id: scheduleId,
    });
    let response = await axios.get("get_schedule/" + scheduleId);
    setTableData(response.data);
    setSelectedItems([]);
    updateFitness();
  }

  return (
    <>
      <div className={"scrollingBox"}>
        <table className={"scheduleTable"}>
          <thead>
            <tr>
              {leaders.map((leader: ILeader) => {
                return <th>{leader.name}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {timeBlocks.map((time: number) => {
              return (
                <tr>
                  {leaders.map((leader: ILeader) => {
                    const item = tableData.find(
                      (e) =>
                        e.timeblock_id === time && e.leader_id === leader.id
                    );
                    const selected = selectedItems.some(
                      (e) => e.leader_id === leader.id && e.time_id === time
                    );
                    if (item) {
                      console.log(selected);
                      return (
                        <td
                          style={{
                            background: item.color,
                          }}
                          className={selected ? "selectedItem" : ""}
                          onClick={() => selectItem(time, leader.id, item.id)}
                        >
                          {item.participant_name}
                          <br />
                          - - - - - - - - - - - - - - - - - - - - - -
                          <br />
                          {item.competence_name}
                        </td>
                      );
                    } else
                      return (
                        <td
                          className={selected ? "selectedItem" : ""}
                          onClick={() => selectItem(time, leader.id, -1)}
                        ></td>
                      );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Button
        disabled={selectedItems.length < 2}
        className={"myButton switchButton"}
        onClick={switchItems}
      >
        Vyměnit
      </Button>
    </>
  );
}

export default ShowScheduleData;
