import React, { forwardRef, useEffect, useState } from "react";
import { Form, Input, Select } from "antd";

const { Option } = Select;

/* forwardRef接受ref */
const UserForm = forwardRef((props, ref) => {
  /* 通过isDisabled来控制区域选择按钮 */
  const [isDisabled, setisDisabled] = useState(false);

  /* 接收isUpdateDisabled的状态值，并更新isDisabled，接收父传子*/
  useEffect(() => {
    setisDisabled(props.isUpdateDisabled);
  }, [props.isUpdateDisabled]);

  /* 判断是以超管理员，区域管理员，还是区域编辑的身份进入 */
  // console.log("token",JSON.parse(localStorage.getItem("token")));
  const { roleId, region } = JSON.parse(localStorage.getItem("token"));

  /* 禁用区域列表的回调 */
  const checkRegionDisabled = (item) => {
    /*对更新用户操作  */
    if (props.isUpdate) {
      if (roleId === 1) {
        /* return false表示禁用为假 */
        return false;
      } else {
        /* return true表示禁用为真*/
        return true;
      }
    } else {
      /* 对添加用户操作 */
      if (roleId === 1) {
        return false;
      } else {
        /*  筛选出添加用户时默认的区域 */
        return item.value !== region;
      }
    }
  };

  /* 禁用角色列表的回调 */
  const checkRoleDisabled = (item) => {
    if (props.isUpdate) {
      if (roleId === 1) {
        /* return false表示禁用为假 */
        return false;
      } else {
        /* return true表示禁用为真*/
        return true;
      }
    } else {
      /* 对添加用户操作 */
      if (roleId === 1) {
        return false;
      } else {
        /* 筛选出添加用户时默认的角色 /roles 数据在这里获取得到的 */
        /* 只有当角色为区域编辑时不禁用*/
        return item.id !== 3;
      }
    }
  };

  // console.log("props.regionList数据",props.regionList)
  return (
    <Form
      /* 接收来自上一级的ref */
      ref={ref}
      /* 垂直布局的 */
      layout="vertical"
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          { required: true, message: "Please input the title of collection!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="passsword"
        label="密码"
        rules={[
          { required: true, message: "Please input the title of collection!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        /* 当为超级管理员时，isDisabled=true,不会显示message内容 */
        rules={
          isDisabled
            ? []
            : [
                {
                  required: true,
                  message: "Please input the title of collection!",
                },
              ]
        }
      >
        {/* 模态框区域选项列表数据 */}
        <Select
          /* 禁用区域选择按钮 */
          disabled={isDisabled}
        >
          {props.regionList.map((item) => (
            <Option
              value={item.value}
              key={item.id}
              /* 判断是否禁用区域的按钮，当以管理员身份进来的时候，
                 正常显示区域选择；当以另外身份进来的时候，禁用区域选择 */
              disabled={checkRegionDisabled(item)}
            >
              {item.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          { required: true, message: "Please input the title of collection!" },
        ]}
      >
        {/* 模态框角色选项列表数据 */}
        <Select
          /* onChange事件：当角色选择为超级管理员时禁用区域选择按钮，
                        value=1时代表角色选择为超级管理员*/
          onChange={(value) => {
            // console.log("value", value);
            /* console.log(value, typeof(value)) */
            if (value === 1) {
              setisDisabled(true);
              /* 当选择为超级管理员时，区域默认显示为空，
                  设置ref.current.setFieldsValue()方法使表单数据为空 */
              // console.log("ref", ref);
              ref.current.setFieldsValue({
                region: "",
              });
            } else {
              setisDisabled(false);
            }
          }}
        >
          {props.roleList.map((item) => (
            <Option
              value={item.id}
              key={item.id}
              disabled={checkRoleDisabled(item)}
            >
              {item.roleName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
});
export default UserForm;
