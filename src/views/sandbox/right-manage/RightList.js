import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Modal, Popover, Switch } from "antd";

import axios from "axios";

import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
// import Item from 'antd/lib/list/Item';
// import { SearchOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export default function RightList() {
  const [dataSource, setdataSource] = useState([]);

  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      const list = res.data;
      console.log("请求拿到的数据", list);
      // list[0].children = ""
      /* 找到children为空的数组,赋值为空字符串*/
      list.forEach((item) => {
        if (item.children.length === 0) {
          item.children = "";
        }
      });
      setdataSource(list);
    });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        /* b标签使数字字体颜色加深 */
        return <b>{id}</b>;
      },
    },
    {
      title: "权限名称",
      dataIndex: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render: (key) => {
        /* Tag标签展示加上orange颜色的路径 */
        return <Tag color="orange">{key}</Tag>;
      },
    },
    {
      title: "操作",
      /*当不取dataIndex时，拿到的为所有对象  */
      render: (item) => {
        return (
          <div>
            {/*此button为红色的删除按钮 */}
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => {
                confirmMethod(item);
                console.log("我是点击删除按钮拿到的item:", item);
              }}
            />
            {/* popover为气泡卡片：点击绿色小笔按钮，会出现页面配置项功能按钮*/}
            <Popover
              title="页面配置项"
              /*  二级列表item.pagepermisson不存在时，按钮为灰色且不可点击，禁用此次对此点击事件*/
              trigger={item.pagepermisson === undefined ? "" : "click"}
              content={
                <div style={{ textAlign: "center" }}>
                  {/* switch为页面配置项按钮，checked为真亮起 */}
                  <Switch
                    checked={item.pagepermisson}
                    onChange={() => {
                      switchMethod(item);
                    }}
                  ></Switch>
                </div>
              }
            >
              {/* button是绿色的小笔按钮，disabled为真亮起 */}
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                /*  二级列表item.pagepermisson不存在时，按钮始终为灰色*/
                disabled={item.pagepermisson === undefined}
              />
            </Popover>
          </div>
        );
      },
    },
  ];
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    // console.log("wfw",item);
    /* 如果不进行此操作会点不动按钮 */
    setdataSource([...dataSource]);
    if (item.grade === 1) {
      /* patch有补丁效果，对于不变的数据就不会更新，只改变更新的数据*/
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    }
  };
  /* 点击删除弹出的confirm的确认框 */
  const confirmMethod = (item) => {
    confirm({
      title: "你确定要删除吗?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        console.log("OK");
        deleteMethod(item);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  /* confirm确认框中的删除确认 */
  const deleteMethod = (item) => {
    /* 当前页面同步 + 后端同步 */
    if (item.grade === 1) {
      // console.log("item1",item);
      /* 更新dataSource数据，过滤掉删除的此项id */
      setdataSource(dataSource.filter((data) => data.id !== item.id));
      /* axios请求删除，数据库删除此项id */
      axios.delete(`/rights/${item.id}`);
    } else {
      /* 先筛选拿到一级菜单项 */
      let list = dataSource.filter((data) => data.id === item.rightId);
      /* 过滤掉删除的二级项,再把数据赋值给list[0].cjildren,即是更新list数据 */
      list[0].children = list[0].children.filter((data) => data.id !== item.id);
      setdataSource([...dataSource]);
      axios.delete(`/children/${item.id}`);
    }
  };
  return (
    <div>
      {/* 表格支持树形数据的展示（展开 + — 符号），当数据中有 children 字段时会自动展示为树形表格，
          如果不需要或配置为其他字段可以用 childrenColumnName 进行配置。 */}
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
      ;
    </div>
  );
}
