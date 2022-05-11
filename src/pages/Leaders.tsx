import { Button, Input, Modal, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { AlignType } from "rc-table/lib/interface";
import axios from "../api/axios";
import "./style.scss";

interface ILeader {
  name: string;
  id: number;
  key: number;
}

//Edit, Create, Delete Leader

function Leaders() {
  const [leaders, setLeaders] = useState([] as ILeader[]);
  const [leader, setLeader] = useState({} as ILeader);
  const [isEditing, setIsEditing] = useState(false);
  const [create, setCreate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (leaders.length === 0) {
        let data = await axios.get("/leaders");
        setLeaders(data.data);
      }
    };
    fetchData();
  }, [leaders]);

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
      render: (record: ILeader) => {
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

  const onDeleteStudent = (leader: ILeader) => {
    Modal.confirm({
      title: "Opravdu chceš smazat tohoto vedoucího?\n" + leader.name,
      okText: "Ano",
      cancelText: "Ne",
      okType: "danger",
      onOk: () => {
        setLeaders((pre) => {
          axios.delete("delete_leader/" + leader.id);
          return pre.filter((item) => item.id !== leader.id);
        });
      },
    });
  };

  const onSaveModal = async () => {
    const myId = Math.floor(Math.random() * -10000);
    setLeaders([
      ...leaders,
      {
        name: leader.name,
        id: myId,
        key: myId,
      },
    ]);
    axios.post("create_leader", leader);
    setIsEditing(false);
    setLeader({} as ILeader);
  };

  const onSaveEditModal = () => {
    const index = leaders.findIndex((x) => x.id === leader.id);
    setLeaders([
      ...leaders.slice(0, index),
      leader,
      ...leaders.slice(index + 1),
    ]);
    axios.post("update_leader", leader);
    setIsEditing(false);
    setLeader({} as ILeader);
  };

  const onCancelModal = () => {
    setIsEditing(false);
    setLeader({} as ILeader);
  };

  const onAddLeader = () => {
    setCreate(true);
    setIsEditing(true);
    setLeader({} as ILeader);
  };

  const onEditStudent = (item: ILeader) => {
    setCreate(false);
    setIsEditing(true);
    setLeader(item);
  };

  return (
    <>
      <div className="Leaders">
        <Button className="myButton addLeader" onClick={() => onAddLeader()}>
          Přidat vedoucího
        </Button>
        <Table
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          className={"leaderTable"}
          columns={columns}
          dataSource={leaders}
          pagination={false}
        ></Table>
        <Modal
          title={create ? "Přidat vedoucího" : "Editovat vedoucího"}
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
            value={leader.name}
            onChange={(e) => {
              setLeader({
                ...leader,
                name: e.target.value,
              } as ILeader);
            }}
          />
        </Modal>
      </div>
    </>
  );
}

export default Leaders;
