import React, { useState, useEffect, useRef } from "react";

import axios from "axios";
import { Table, Button, Modal, Switch } from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import UserForm from "../../../components/user-manage/UserForm";

const { confirm } = Modal;

export default function UserList() {
  const [dataSource, setdataSource] = useState([]);

  /* 模态框--添加用户，并设置初始值为false */
  const [isAddVisible, setisAddVisible] = useState(false);

  /* 模态框--操作下的小笔按钮 */
  const [isUpdateVisible, setisUpdateVisible] = useState(false);

  /* 添加用户模态框里面的区域列表 */
  const [regionList, setregionList] = useState([]);

  /* 添加用户模态框里面的角色列表 */
  const [roleList, setroleList] = useState([]);

  /* 操作-更新用户-管理员禁用按钮的控制 */
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false);

  /* 当前更新项 */
  const [current, setcurrent] = useState(null);

  /* 定义添加的Ref.初始值为空 */
  const addForm = useRef(null);

  /* 定义更新的Ref */
  const updateForm = useRef(null);

  /*  JSON.parse(localStorage.getItem("token")))是进入相应用户名下打印出来的值 */
  console.log("admin", JSON.parse(localStorage.getItem("token")));
  /* roleId=1---超级管理员，roleId=2---区域管理员，roleId=3---区域编辑，region对应区域 ,username用户名*/
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );

  /* 得到用户列表数据：区域 角色列表 用户名 用户状态 操作 
      roleId =1 为超级管理员 */
  useEffect(() => {
    axios.get("/users?_expand=role").then((res) => {
      const list = res.data;
      // console.log("用户列表list", list);
      setdataSource(
        roleId === 1
          ? list
          : [
              /* 筛选出来当前的登录用户 */
              ...list.filter((item) => item.username === username),
              ...list.filter(
                (item) => item.region === region && item.roleId === 3
              ),
            ]
      );
    });
  }, [roleId, region, username]);

  /*  添加用户模态框里面的区域列表数据获取*/
  useEffect(() => {
    axios.get("/regions").then((res) => {
      const list = res.data;
      // console.log("区域列表数据",list)
      setregionList(list);
    });
  }, []);

  /* 添加用户模态框里面的角色列表数据获取 */
  useEffect(() => {
    axios.get("/roles").then((res) => {
      const list = res.data;
      setroleList(list);
    });
  }, []);

  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      /* 筛选区域列表 */
      filters: [
        ...regionList.map((item) => ({
          text: item.title,
          value: item.value,
        })),
        {
          text: "全球",
          value: "全球",
        },
      ],
      /* value是点击筛选区域的勾选框,然后点击ok之后传入的值,value就相当于复选框前面的亚洲欧洲 */
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === "";
        }
        return item.region === value;
      },
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => {
        return role?.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      render: (roleState, item) => {
        return (
          <Switch
            /* 控制用户状态开关按钮,check为真时亮起*/
            checked={roleState}
            /*禁用用户状态开关，disabled为false时开关亮起 */
            disabled={item.default}
            onChange={() => handleChange(item)}
          />
        );
      },
    },
    {
      title: "操作",
      /* item是datasources数据中的每一条 */
      render: (item) => {
        return (
          <>
            {/*此button为红色的删除按钮 */}
            <Button
              danger
              shape="circle"
              /* 删除图标 */
              icon={<DeleteOutlined />}
              onClick={() => {
                confirmMethod(item);
              }}
              /* 禁用用户状态开关，disabled为false时开关亮起 */
              disabled={item.default}
            />
            {/* button是绿色的小笔按钮，disabled为真亮起 */}
            <Button
              type="primary"
              shape="circle"
              /* 操作小笔图标 */
              icon={<EditOutlined />}
              /* 禁用用户状态开关，disabled为false时开关亮起 */
              disabled={item.default}
              /* 点击操作下的小笔后，触发的onClick函数 */
              onClick={() => handleUpdate(item)}
            />
          </>
        );
      },
    },
  ];

  /*  操作-更新用户调用的函数*/
  const handleUpdate = (item) => {
    setTimeout(() => {
      setisUpdateVisible(true);
      /* item.roleId===1为超级管理员*/
      if (item.roleId === 1) {
        //禁用----当角色为超级管理员时，禁用区域
        setisUpdateDisabled(true);
      } else {
        //取消禁用
        setisUpdateDisabled(false);
      }
      /* 设置更新框中的值为item,即是模态框设置为默认值 */
      updateForm.current.setFieldsValue(item);
    }, 0);
    setcurrent(item);
  };

  /* 点击用户状态的onChange属性 */
  const handleChange = (item) => {
    /* 此item拿到的为整个信息数据，里面有个属性roleState控制用户状态的开关 */
    // console.log("item",item);
    /* 取反roleState状态，并更新数据 */
    item.roleState = !item.roleState;
    setdataSource([...dataSource]);
    /* 利用补丁方法patch，更新数据库 */
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState,
    });
  };

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

  /* 删除确认 */
  const deleteMethod = (item) => {
    /* 当前页面同步 + 后端同步 */
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    /* axios请求，数据库中删除此项 */
    axios.delete(`/users/${item.id}`);
  };

  /*模态框添加用户，点击确定之后的回调函数*/
  const addFormOk = () => {
    /* addForm.current.validateFields()方法可以拿到已经触发的input框值 */
    addForm.current
      .validateFields()
      .then((value) => {
        /* 点击确定之后，拿到的添加用户表单信息*/ /* 成功时候得到的数据 */
        // console.log(123466, value);
        /* 消失模态框 */
        setisAddVisible(false);
        addForm.current.resetFields();
        /* post到后端，先生成id,再设置datasource,即可利用删除和更新-----------生成一整套数据 */
        axios
          .post(`/users`, {
            /* 先拿到values,再添加另外两个 */
            ...value,
            roleState: true,
            default: false,
          })
          .then((res) => {
            /* 更新数据------dataSource之前的数据，res.data：点击确定按钮之后刚生成的数据,也即是插入后的数据 */
            setdataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleList.filter((item) => item.id === value.roleId)[0],
              },
            ]);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /* 更新 */
  const updateFormOk = () => {
    /* updateForm.current.validateFields()方法拿到绑定的input框 */
    updateForm.current.validateFields().then((value) => {
      // console.log("value",value);
      /* 消失模态框 */
      setisUpdateVisible(false);
      /* 更新数据 */
      setdataSource(
        dataSource.map((item) => {
          /* current当前更新项 */
          if (item.id === current.id) {
            return {
              ...item,
              ...value,
              role: roleList.filter((data) => data.id === value.roleId)[0],
            };
          }
          return item;
        })
      );
      setisUpdateDisabled(!isUpdateDisabled);
      axios.patch(`/users/${current.id}`, value);
    });
  };

  return (
    // <> </>标签的功能相当于<div></div>作用,并且不会渲染出来<div></div>
    <>
      <Button
        type="primary"
        /* 点击添加用户，弹出模态框 */
        onClick={() => {
          setisAddVisible(true);
        }}
      >
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
      {/* 添加用户--模态框 */}
      <Modal
        /* 控制模态框是否弹出 */
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        /*取消回调 */
        onCancel={() => {
          /* 取消模态框的弹出 */
          setisAddVisible(false);
        }}
        /* 确认回调,调用updateFormOk函数 */
        onOk={() => addFormOk()}
      >
        {/* 添加用户 */}
        <UserForm
          /* 区域列表数据 */
          regionList={regionList}
          /* 角色列表数据 */
          roleList={roleList}
          /* 传入ref */
          ref={addForm}
        />
      </Modal>
      {/* 操作--更新用户--模态框 */}
      <Modal
        /* 控制模态框是否弹出 */
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        /*取消回调 */
        onCancel={() => {
          /* 取消模态框的弹出 */
          setisUpdateVisible(false);
          /* 点击取消按钮后，做取反isUpdateDisabled操作，并在下面将状态传递给子组件*/
          setisUpdateDisabled(!isUpdateDisabled);
        }}
        /* 确认回调,调用updateFormOk函数 */
        onOk={() => updateFormOk()}
      >
        {/* 更新用户 */}
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={updateForm}
          /*  传递给子组件的isUpdateDisabled值 */
          isUpdateDisabled={isUpdateDisabled}
          /* 区别是更新还是新建用户，默认为false */
          isUpdate={true}
        />
      </Modal>
    </>
  );
}
