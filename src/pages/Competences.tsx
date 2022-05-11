import "./style.scss";
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Col, List, Row } from "antd";
import SetCompetences from "./SetComeptences";
import { DeleteOutlined } from "@ant-design/icons";

interface ILeader {
  id: number;
  name: string;
}

//Page for change competences

function Competences() {
  const [leaders, setLeaders] = useState([] as ILeader[]);
  const [selected, setSelected] = useState({} as ILeader);

  useEffect(() => {
    const fetchData = async () => {
      if (leaders.length === 0) {
        let data = await axios.get("/leaders");
        setLeaders(data.data);
      }
    };
    fetchData();
  }, [leaders]);

  return (
    <>
      <div className={"competences"}>
        <Row>
          <Col span={4} className={"leftSide"}>
            <List
              itemLayout="horizontal"
              className={"leaderList"}
              dataSource={leaders}
              renderItem={(item) => (
                <List.Item
                  className={"leaderListItem"}
                  onClick={() => setSelected(item)}
                  style={selected.id === item.id ? { background: "#DDD" } : {}}
                >
                  <List.Item.Meta title={item.name} />
                </List.Item>
              )}
            />
          </Col>
          <Col span={20}>
            {/*Change competences for selected leader*/}
            <SetCompetences leader={selected} />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Competences;
