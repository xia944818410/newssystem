import React, { useEffect, useState } from "react";

import axios from "axios";

import { Layout, Menu } from "antd";
import "./index.css";
import { withRouter } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

const { Sider } = Layout;
const { SubMenu } = Menu;

const iconList = {
  "/home": <UserOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <UserOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />,
};

/* SideMenu组件要想使用props的history属性，需要引入react-router-dom中的WithRouter属性，
   并默认暴露WithRouter(SideMenu),此时react-router 的 history、location、match 三个对象会传入到props对象上，可直接使用props.history属性 */
function SideMenu(props) {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      // console.log("sidemenu", res.data);
      setMenu(res.data);
    });
  }, []);

  /*  rights:拿到当前登录用户所具有的权限列表 */
  // console.log("11", JSON.parse(localStorage.getItem("token")));
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));

  /*  rights.includes(item.key):rights里面的权限必须包含，导航栏item.key，且为真，侧边栏才有机会渲染*/
  const checkPagePermission = (item) => {
    return item.pagepermisson === 1 && rights.includes(item.key);
  };

  const renderMenu = (menuList) => {
    return menuList.map((item) => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return (
          <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
        );
      }
      return (
        checkPagePermission(item) && (
          <Menu.Item
            key={item.key}
            icon={iconList[item.key]}
            onClick={() => {
              // console.log("item.key***",item.key );
              props.history.push(item.key);
            }}
          >
            {item.title}
          </Menu.Item>
        )
      );
    });
  };

  // console.log("p***", props.location);
  const selectKeys = [props.location.pathname];

  // console.log("props.location.pathname",props.location.pathname);
  const openKey = ["/" + props.location.pathname.split("/")[1]];

  return (
    <Sider trigger={null} collapsible collapsed={false}>
      {/* display="flex",flex-direction="column",flex布局，代表主轴为垂直方向*/}
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo">新闻管理发布系统</div>
        {/* defaultSelectedKeys后面的参数表示默认展示的内容*/}
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            //selectedKeys为当前选中的菜单项 key 数组，也即默认选中的二级菜单项
            selectedKeys={selectKeys}
            //defaultOpenKeys为初始展开的 SubMenu 菜单项 key 数组，也即默认选中的一级菜单项
            defaultOpenKeys={openKey}
          >
            {/* <Menu.Item key="1" icon={<UserOutlined />}>
                    首页1
                </Menu.Item>
                <Menu.Item key="2" icon={<UserOutlined />}>
                    首页2
                </Menu.Item>
                <Menu.Item key="3" icon={<UserOutlined />}>
                    首页3
                </Menu.Item>
                <SubMenu key="1" icon={<UploadOutlined/>} title="首页4">
                    <Menu.Item key="11">Option 12</Menu.Item>
                    <Menu.Item key="2545">Option 34</Menu.Item>
                </SubMenu>  
             */}
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  );
}
export default withRouter(SideMenu);
