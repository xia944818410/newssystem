import React, {useState,useEffect} from 'react'
import { Table,Button,Modal,Switch,Form,Input} from "antd"
import axios from 'axios'
import {EditOutlined ,DeleteOutlined,ExclamationCircleOutlined } from "@ant-design/icons"
import { Select } from 'antd';
const { confirm } = Modal;
const { Option } = Select
export default function UserList() {

    const  [dataSource, setdataSource] = useState([])
     /* 控制模态框是否弹出，并设置初始值为false */
    const  [isAddVisible, setisAddVisible] = useState(false)
    /* 添加用户模态框里面的区域列表 */
    const  [regionList, setregionList] = useState([])
    /* 添加用户模态框里面的角色列表 */
    const  [roleList, setroleList] = useState([])
    /*  得到用户列表数据：区域 角色列表 用户名 用户状态 操作*/
    useEffect(()=>{
        axios.get("http://localhost:5000/users?_expand=role").then(res=>{
            const list = res.data
            setdataSource(list)
        })
    },[])
    /* 添加用户模态框里面的区域列表数据获取*/
    useEffect(()=>{
        axios.get("http://localhost:5000/regions").then(res=>{
            const list = res.data
            setregionList(list)
        })
    },[])
    /* 添加用户模态框里面的角色列表数据获取 */
    useEffect(()=>{
        axios.get("http://localhost:5000/roles").then(res=>{
            const list = res.data
            setroleList(list)
        })
    },[])
    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            render:(region)=>{
                return <b>{region===""?"全球":region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render:(role)=>{  
                return role?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render:(roleState,item)=>{
                return <Switch
                           /* 控制用户状态开关按钮,check为真时亮起*/
                           checked={roleState}
                           /*禁用用户状态开关，disabled为false时开关亮起 */
                           disabled={item.default}
                        >
                       </Switch>
            }
        },
        {
            title:"操作",
            /*当不取dataIndex时，拿到的为所有对象  */
            render:(item)=>{
                return <div>
                            {/*此button为红色的删除按钮 */}
                            <Button
                                danger
                                shape="circle" 
                                /* 删除图标 */
                                icon={<DeleteOutlined/>}
                                onClick={()=>{
                                    confirmMethod(item)
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
                            /> 
                       </div>
            }
        }
    ]
    const confirmMethod = (item)=>{
            confirm({
                title: '你确定要删除吗?',
                icon: <ExclamationCircleOutlined />,
                onOk() {
                   console.log('OK');
                   deleteMethod(item)
                },
                onCancel() {
                   console.log('Cancel');
                },
            });
     }
     /* 删除确认 */ 
     const deleteMethod = (item) =>{
           /* 当前页面同步 + 后端同步 */
     }
    return (
        <div>
            <Button
               type="primary"
               /* 点击添加用户，弹出模态框 */
               onClick={()=>{
                  setisAddVisible(true)
               }}
            >
                添加用户
            </Button>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{pageSize:5}}
                rowKey={ item =>
                    item.id
                }
            />;
            {/* 模态框 */}
            <Modal
                /* 控制模态框是否弹出 */
                visible={isAddVisible} 
                title="添加用户"
                okText="确定"
                cancelText="取消"
                /*取消回调 */
                onCancel={()=>{
                /* 取消模态框的弹出 */
                setisAddVisible(false)
                }}
                /* 确认回调 */
                onOk={() => {
                    console.log("add");
                }}
            >
                    <Form
                        /* 垂直布局的 */
                        layout="vertical"
                    >
                            <Form.Item
                                name="username"
                                label="用户名"
                                rules={[{ required: true, 
                                          message: 'Please input the title of collection!'
                                      }]}
                            >
                                  <Input />
                            </Form.Item>
                            <Form.Item
                                name="passsword"
                                label="密码"
                                rules={[{ required: true, 
                                          message: 'Please input the title of collection!'
                                      }]}
                            >
                                  <Input />
                            </Form.Item>
                            <Form.Item
                                name="region"
                                label="区域"
                                rules={[{ required: true, 
                                          message: 'Please input the title of collection!'
                                      }]}
                            >
                                 {/* 模态框区域选项列表数据 */}
                                 <Select>
                                      {
                                          regionList.map(item =>
                                              <Option
                                                    value={item.value}
                                                    key={item.id}
                                              >
                                                      {item.title}
                                              </Option>
                                          )
                                      }
                                 </Select>
                            </Form.Item>
                            <Form.Item
                                name="roleId"
                                label="角色"
                                rules={[{ required: true, 
                                          message: 'Please input the title of collection!'
                                      }]}
                            >
                                 {/* 模态框角色选项列表数据 */}
                                 <Select>
                                      {
                                          roleList.map(item =>
                                              <Option 
                                                   value={item.value}
                                                   key={item.id}
                                              >
                                                      {item.roleName}
                                              </Option>
                                          )
                                      }
                                 </Select>
                            </Form.Item>
                    </Form>
            </Modal>
        </div>
    )
}
