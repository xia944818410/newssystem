import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

/* TopHeader组件要想使用props的history属性，需要引入react-router-dom中的WithRouter属性，
   并默认暴露WithRouter(TopHeader),此时react-router 的 history、location、match 三个对象会传入到props对象上，
   可直接使用props.history属性 */
function TopHeader(props) {
  const [collapsed, setCollapsed] = useState(false);
  const changeCollapsed = () => {
    setCollapsed(!collapsed);
  };

  /* localStorage.getItem("token")是login组件中localStorage.setItem所存入的数据;
     结构解析取出roleName和username*/
  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem("token"));

  const menu = (
    <Menu>
      <Menu.Item>{roleName}</Menu.Item>
      <Menu.Item
        danger
        onClick={() => {
          localStorage.removeItem("token");
          /* 重定向到login组件 */
          props.history.replace("/login");
        }}
      >
        退出
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {collapsed ? (
        <MenuUnfoldOutlined onClick={changeCollapsed} />
      ) : (
        <MenuFoldOutlined onClick={changeCollapsed} />
      )}
      <div style={{ float: "right" }}>
        <span>
          欢迎
          <span style={{ color: "#1890ff" }}>{username}</span>
          回来
        </span>
        {/* Avatar为黑色圆圈 */}
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}
export default withRouter(TopHeader);
