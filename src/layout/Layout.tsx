import React from "react";
import { Layout } from "antd";
import "./style.css";
import "./layout.css";
import MyHeader from "./Header";
import Body from "./Body";
import Navigation from "./Navigation";

const { Header, Sider, Content } = Layout;


//Layout

function MyLayout() {
  document.title = "Skautské rozvrhy";

  return (
    <Layout className={"layout"}>
      {" "}
      <Header className={"header-layout"}>
        <MyHeader />
      </Header>
      <Layout>
        <Content className={"content-layout"}>
          <Body />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MyLayout;
