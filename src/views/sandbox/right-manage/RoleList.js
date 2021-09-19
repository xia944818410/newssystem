import React,{useState,useEffect} from 'react'
import {Table,Button,Modal} from 'antd'
import {EditOutlined ,DeleteOutlined,ExclamationCircleOutlined} from "@ant-design/icons"
import axios from 'axios'
const { confirm } = Modal;
export default function RoleList() {
    const [dataSource, setdataSource] = useState([])
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
            dataIndex: 'roleName',
            
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
    useEffect(()=>{
         axios.get("http://localhost:5000/roles").then(res=>{
            console.log("roles",res.data);
            setdataSource(res.data)
         })
    },[])
    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                /* rowKey的作用：添加唯一的key值属性，不添加会报错 */
                rowKey={ item =>
                    item.id
                }
            >
            </Table>
        </div>
    )
}
