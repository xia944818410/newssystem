import React, { useState, useEffect } from "react";

import axios from "axios";
import { Table, Button, Modal, Tree } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;

export default function RoleList() {
  /* 角色列表数据  ID 角色名称 操作 */
  const [dataSource, setdataSource] = useState([]);
  /* 模态框列表的数据 */
  const [rightList, setRightList] = useState([]);
  /* 设置modal框visible初始值为false,isModalVisible为其状态*/
  const [isModalVisible, setisModalVisible] = useState(false);
  /* currentRights：tree默认勾选的复选框 */
  const [currentRights, setcurrentRights] = useState([]);
  /*  currentId可以简单理解为角色列表中对应的ID123*/
  const [currentId, setcurrentId] = useState(0);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
    },
    {
      title: "操作",
      /*当不取dataIndex时，拿到的为所有对象  */
      render: (item) => {
        // console.log("item拿到的数据",item);
        return (
          <div>
            {/*此button为红色的删除按钮 */}
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => {
                confirmMethod(item);
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                // console.log("点击模态框拿到的item数据",item)
                /* 触发点击事件后，setisModalVisible(true)，弹出模态框 */
                setisModalVisible(true);
                /* 触发点击后，需要勾选的框值 */
                setcurrentRights(item.rights);
                setcurrentId(item.id);
              }}
            />
          </div>
        );
      },
    },
  ];

  const confirmMethod = (item) => {
    confirm({
      title: "你确定要删除吗?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        // console.log("OK");
        deleteMethod(item);
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  };

  const deleteMethod = (item) => {
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/roles/${item.id}`);
  };

  /* 此useEffect获取的为角色列表数据 */
  useEffect(() => {
    axios.get("/roles").then((res) => {
      setdataSource(res.data);
    });
  }, []);

  /* useEffect获取的为模态框列表里面的数据 */
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      setRightList(res.data);
    });
  }, []);

  /* 确认按钮 */
  const handleOk = () => {
    // console.log("点击确定之后的currentRights",currentRights);
    setisModalVisible(false); /* 先隐藏模态框 */
    /* 同步dataSource, ID 1,2,3; 
           ID=1时点击1的操作小笔,此时的map函数刚好匹配上，勾选或者取消勾选都会触发*onCheck函数,
           从而更新currentRight;而ID=2,3不会改变，返回原来的值*/
    setdataSource(
      dataSource.map((item) => {
        if (item.id === currentId) {
          return {
            ...item,
            rights:
              /* 勾选或者取消勾选后改变了currentRights值，从而更新了rights，在进行对页面进行从新勾选*/
              currentRights,
          };
        }
        return item;
      })
    );
    /* patch有补丁效果，对于不变的数据就不会更新，只改变更新的数据*/
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights,
    });
  };

  /* 取消按钮 */
  const handleCancel = () => {
    setisModalVisible(false);
  };

  /*  onCheck:勾选或者取消勾选复选框,
      setcurrentRights(checkKeys)作用是：得到更新后的checkKeys,并重新获取数据
  */
  const onCheck = (checkKeys) => {
    /* 点击勾选框之后，打印出来的checkKeys是除勾选框之外的路径 */
    //  console.log("点击复选框触发：",checkKeys);
    setcurrentRights(checkKeys.checked);
    /*  setcurrentRights(checkKeys.checked)：获得勾选或者取消勾选后的内容，再次更新需要勾选的条款*/
  };

  return (
    <div>
      <Table
        /* 传入为角色列表数据 */
        dataSource={dataSource}
        columns={columns}
        /* rowKey的作用：添加唯一的key值属性，不添加会报错 */
        rowKey={(item) => item.id}
      />
      {/* 模态框 */}
      <Modal
        title="权限分配"
        /* 刚开始isModalVisible初始值为false，模态框不展示，visible为true时弹出模态框  */
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {/* Tree为权限分配下方的列表 */}
        <Tree
          /* checkable: 显示勾选框 */
          checkable
          /*  checkedKeys是默认勾选框,currentRights拿到的是item.rights路径,
              也即是rightList对应的key值,即是要从rightList列表中默认勾选
              currentRights(/roles,里面的item.rights)
          */
          checkedKeys={currentRights}
          /*  onCheck:勾选或者取消勾选复选框 */
          onCheck={onCheck}
          /* 父子节点选中状态不再关联 */
          checkStrictly={true}
          /*treeData为/rights?_embed=children请求得到的数据，始终保持不变*/
          treeData={rightList}
        />
      </Modal>
    </div>
  );
}
