import React,{useState,useEffect} from 'react'
import {Table,Button,Modal,Tree} from 'antd'
import {EditOutlined ,DeleteOutlined,ExclamationCircleOutlined} from "@ant-design/icons"
import axios from 'axios'
const { confirm } = Modal;

export default function RoleList() {
    /* 角色列表数据  ID 角色名称 操作 */
    const [dataSource, setdataSource] = useState([])
    /* 模态框列表的数据 */
    const [rightList, setrightList] = useState([])
    /* 设置modal框visible初始值为false,isModalVisible为其状态*/
    const [isModalVisible, setisModalVisible] = useState(false)

    const [currentRights, setcurrentRights] = useState()
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render:(id)=>{
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName'
        },
        {
            title:"操作",
            /*当不取dataIndex时，拿到的为所有对象  */
            render:(item)=>{
                /* console.log(item); */
                return <div>
                            {/*此button为红色的删除按钮 */}
                            <Button
                                danger
                                shape="circle" 
                                icon={<DeleteOutlined/>}
                                onClick={()=>{
                                    confirmMethod(item)
                                }}
                            />
                            <Button
                                type="primary" 
                                shape="circle" 
                                icon={<EditOutlined />}
                                /* 此onclick事件为控制模态框的弹出 */
                                onClick={()=>{
                                    setisModalVisible(true)
                                    setcurrentRights(item.rights)
                                }}
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

    const deleteMethod = (item) =>{
          setdataSource(dataSource.filter(data=>data.id!==item.id))
          axios.delete(`http://localhost:5000/roles/${item.id}`)
    }
    /* 此useEffect获取的为角色列表数据 */
    useEffect(()=>{
         axios.get("http://localhost:5000/roles").then(res=>{
            // console.log("roles",res.data);
            setdataSource(res.data)
         })
    },[])
    /* useEffect获取的为模态框列表里面的数据 */
    useEffect(()=>{
        axios.get("http://localhost:5000/rights?_embed=children").then(res=>{
        //    console.log("roles",res.data);
           setrightList(res.data)
        })
   },[])  

    /* 确认按钮 */
    const handleOk = ()=>{
        setisModalVisible()
    }

    /* 取消按钮 */
    const handleCancel = ()=>{
        setisModalVisible(false)
    }

     /*  onCheck:勾选或者取消勾选复选框 */
    const onCheck = (checkKeys)=>{
        //    console.log(checkKeys);
           setcurrentRights(checkKeys)
    }

    return (
        <div>
            <Table
                /* 传入为角色列表数据 */
                dataSource={dataSource}
                columns={columns}
                /* rowKey的作用：添加唯一的key值属性，不添加会报错 */
                rowKey={ item =>
                    item.id
                }
            >
            </Table>
            {/* 模态框 */}
            <Modal title="权限分配"
                   /* 刚开始isModalVisible初始值为false，modal不展示，visible控制模态框的弹出  */
                   visible={isModalVisible} 
                   onOk={handleOk} 
                   onCancel={handleCancel}
            >
                    {/* Tree为权限分配下方的列表 */}
                    <Tree
                        /* checkable: 显示勾选框 */
                        checkable
                        /* checkedKeys是默认勾选框， 
                           currentRights 拿到的是item.rights路径，也即是rightList对应的key值，
                        */
                        checkedKeys={currentRights}
                        /*  onCheck:勾选或者取消勾选复选框 */
                        onCheck={onCheck}
                        /* 父子节点选中状态不再关联 */
                        checkStrictly = {true}
                        /* treeData为接收到的数据 */ 
                        treeData={rightList}
                    />
            </Modal>
        </div>
    )
}
