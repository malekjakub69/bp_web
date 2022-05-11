import "./style.scss";
import { Button, Col, Row } from "antd";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";

interface ILeader {
  id: number;
  name: string;
}

interface ICompetence {
  id: number;
  name: string;
  description: string;
}

interface IVerification {
  id: number;
  competence_id: number;
  leader_id: number;
}

//Change competences for selected leader

function SetCompetences({ leader }: any) {
  const [actualLeader, setActualLeader] = useState({} as ILeader);
  const [competences, setCompetences] = useState([] as ICompetence[]);

  const [verification, setVerification] = useState([] as ICompetence[]);
  const [noVerification, setNoVerification] = useState([] as ICompetence[]);

  useEffect(() => {
    const fetchData = async () => {
      if (competences.length === 0) {
        let data = await axios.get("/competences");
        setCompetences(data.data);
      }

      if (actualLeader.id !== leader.id) {
        let data = (await axios.get("/verifications/" + leader.id))
          .data as IVerification[];
        const ver: ICompetence[] = [];
        const noVer: ICompetence[] = [];
        competences.forEach((item: ICompetence) => {
          if (data.some((e: IVerification) => e.competence_id === item.id)) {
            ver.push(item);
          } else {
            noVer.push(item);
          }
        });
        setActualLeader(leader);
        setVerification(ver);
        setNoVerification(noVer);
      }
    };
    fetchData();
  }, [actualLeader, competences, leader, noVerification, verification]);

  if (!Object.keys(leader).length) {
    return (
      <>
        <div className={"SelectLeader"}>Vyberte vedoucího</div>
      </>
    );
  }

  async function removeData(id: number) {
    const competence: ICompetence | undefined = verification.find(
      (item) => item.id === id
    );
    if (competence) {
      const competences: ICompetence[] = noVerification;
      competences.push(competence);
      setNoVerification(competences);
      setVerification(
        verification.filter((item: ICompetence) => item !== competence)
      );
      await axios.post("/delete_verification", {
        leader_id: leader.id,
        competence_id: competence.id,
      });
    }
  }

  async function addData(id: number) {
    const competence: ICompetence | undefined = noVerification.find(
      (item) => item.id === id
    );
    if (competence) {
      const competences: ICompetence[] = verification;
      competences.push(competence);
      setVerification(competences);
      setNoVerification(
        noVerification.filter((item: ICompetence) => item !== competence)
      );
      await axios.post("/create_verification", {
        leader_id: leader.id,
        competence_id: competence.id,
      });
    }
  }

  return (
    <>
      <h1 className={"header"}>{leader.name}</h1>
      <Row>
        <Col className={"leftSide"} span={12}>
          <h2>Ověřuje</h2>
          {verification.map((item) => {
            return (
              <div className={"listItem"}>
                <div key={item.id} className={"oneItem left"}>
                  {item.name}
                  <Button
                    onClick={() => removeData(item.id)}
                    size={"large"}
                    className={"moveButton addButton"}
                  >
                    <CaretRightOutlined />
                  </Button>
                </div>
              </div>
            );
          })}
        </Col>
        <Col className={"rightSide"} span={12}>
          <h2>Neověřuje</h2>
          {noVerification.map((item) => {
            return (
              <div className={"listItem left"}>
                <div key={item.id} className={"oneItem"}>
                  <Button
                    onClick={() => addData(item.id)}
                    size={"large"}
                    className={"moveButton removeButton"}
                  >
                    <CaretLeftOutlined />
                  </Button>
                  {item.name}
                </div>
              </div>
            );
          })}
        </Col>
      </Row>
    </>
  );
}

export default SetCompetences;
