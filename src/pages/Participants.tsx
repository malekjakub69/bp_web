import { Button, Input, Modal, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { AlignType } from "rc-table/lib/interface";
import axios from "../api/axios";
import "./style.scss";

interface IParticipant {
  name: string;
  id: number;
  key: number;
}

//Edit, Create, Delete Participant

function Participants() {
  const [participants, setParticipants] = useState([] as IParticipant[]);
  const [participant, setParticipant] = useState({} as IParticipant);
  const [isEditing, setIsEditing] = useState(false);
  const [create, setCreate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (participants.length === 0) {
        let data = await axios.get("/participants");
        setParticipants(data.data);
      }
    };
    fetchData();
  }, [participants]);

  const columns = [
    {
      key: "2",
      title: "Name",
      dataIndex: "name",
      align: "center" as AlignType,
    },
    {
      key: "3",
      title: "Actions",
      align: "center" as AlignType,
      render: (record: IParticipant) => {
        return (
          record.id > 0 && (
            <>
              <EditOutlined
                className={"icon"}
                onClick={() => {
                  onEditStudent(record);
                }}
              />
              <DeleteOutlined
                className={"icon"}
                onClick={() => {
                  onDeleteStudent(record);
                }}
                style={{ color: "red", marginLeft: 12 }}
              />
            </>
          )
        );
      },
    },
  ];

  const onDeleteStudent = (participant: IParticipant) => {
    Modal.confirm({
      title: "Opravdu chceš smazat tohoto účastnéíka? \n" + participant.name,
      okText: "Ano",
      cancelText: "Ne",
      okType: "danger",
      onOk: () => {
        setParticipants((pre) => {
          axios.delete("delete_participant/" + participant.id);
          return pre.filter((item) => item.id !== participant.id);
        });
      },
    });
  };

  const onSaveModal = async () => {
    const myId = Math.floor(Math.random() * -10000);
    setParticipants([
      ...participants,
      {
        name: participant.name,
        id: myId,
        key: myId,
      },
    ]);
    axios.post("create_participant", participant);
    setIsEditing(false);
    setParticipant({} as IParticipant);
  };

  const onSaveEditModal = () => {
    const index = participants.findIndex((x) => x.id === participant.id);
    setParticipants([
      ...participants.slice(0, index),
      participant,
      ...participants.slice(index + 1),
    ]);
    axios.post("update_participant", participant);
    setIsEditing(false);
    setParticipant({} as IParticipant);
  };

  const onCancelModal = () => {
    setIsEditing(false);
    setParticipant({} as IParticipant);
  };

  const onAddParticipant = () => {
    setCreate(true);
    setIsEditing(true);
    setParticipant({} as IParticipant);
  };

  const onEditStudent = (item: IParticipant) => {
    setCreate(false);
    setIsEditing(true);
    setParticipant(item);
  };

  return (
    <>
      <div className="Participants">
        <Button
          className="myButton addParticipant"
          onClick={() => onAddParticipant()}
        >
          Přidat účastníka
        </Button>
        <Table
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          className={"participantTable"}
          columns={columns}
          dataSource={participants}
          pagination={false}
        ></Table>
        <Modal
          title={create ? "Přidat účastníka" : "Editovat účastníka"}
          visible={isEditing}
          okText="Uložit"
          cancelText={"Zrušit"}
          onCancel={() => {
            onCancelModal();
          }}
          onOk={() => {
            create ? onSaveModal() : onSaveEditModal();
          }}
        >
          Jméno :
          <Input
            value={participant.name}
            onChange={(e) => {
              setParticipant({
                ...participant,
                name: e.target.value,
              } as IParticipant);
            }}
          />
        </Modal>
      </div>
    </>
  );
}

export default Participants;
