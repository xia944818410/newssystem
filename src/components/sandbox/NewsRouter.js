import React, { useEffect, useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Home from "../../views/sandbox/home/Home";
import UserList from "../../views/sandbox/user-manage/UserList";
import RoleList from "../../views/sandbox/right-manage/RoleList";
import RightList from "../../views/sandbox/right-manage/RightList";
import Nopermission from "../../views/sandbox/nopermission/Nopermission";
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../../views/sandbox/news-manage/NewsCategory";
import Audit from "../../views/sandbox/aduit-manage/Audit";
import AuditList from "../../views/sandbox/aduit-manage/AuditList";
import Unpublished from "../../views/sandbox/publish-manage/Unpublished";
import Published from "../../views/sandbox/publish-manage/Published";
import Sunset from "../../views/sandbox/publish-manage/Sunset";

import axios from "axios";

const LocalRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset,
};

export default function NewsRouter() {
  const [BackRouteList, setBackRouteList] = useState([]);
  /* 利用promise发送两个请求  */
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:5000/rights"),
      axios.get("http://localhost:5000/children"),
    ]).then((res) => {
      // console.log("我是res的数据：",res)
      setBackRouteList([...res[0].data, ...res[1].data]);
      /* 打印得到27个所需的数据 */
      // console.log([...res[0].data, ...res[1].data]);
      //  console.log("111",BackRouteList);
    });
  }, []);

  // 当前用户登录信息
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));

  /* 删除或者增加权限时，LocalRouterMap[item.key] 必须存在；
     且权限控制item.pagepermission等于1*/
  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && item.pagepermisson;
  };

  /*查看当前登录信息是否包含item.key  */
  const checkUserPermission = (item) => {
    return rights.includes(item.key);
  };

  return (
    <Switch>
      {/*   <Route path="/home" component={Home}/>
            <Route path="/user-manage/list" component={UserList}/>
            <Route path="/right-manage/role/list" component={RoleList}/>
            <Route path="/right-manage/right/list" component={RightList}/> */}
      {BackRouteList.map((item) => {
        if (checkRoute(item) && checkUserPermission(item)) {
          return (
            <Route
              path={item.key}
              key={item.key}
              component={LocalRouterMap[item.key]}
              exact
            />
          );
        }
        return null;
      })}

      {/* exact精确匹配 */}
      <Redirect from="/" to="/home" exact />

      {/* <Route path="*" component={Nopermission}/> */}
      {BackRouteList.length > 0 && <Route path="*" component={Nopermission} />}
    </Switch>
  );
}
