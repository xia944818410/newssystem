import React, {useState,useEffect} from 'react'
import { Table,Tag,Button,Modal} from "antd"
import axios from 'axios'
import {EditOutlined ,DeleteOutlined,ExclamationCircleOutlined } from "@ant-design/icons"
// import { SearchOutlined } from '@ant-design/icons';
const { confirm } = Modal;
export default function RightList() {

    const  [dataSource, setdataSource] = useState([])

    useEffect(()=>{
        axios.get("http://localhost:5000/rights?_embed=children").then(res=>{
            const list = res.data
            // list[0].children = ""
            /* 找到children为空的数组,赋值为空字符串*/
            list.forEach(item => {
                 if(item.children.length === 0 ){
                     item.children = ""
                 }
            });
            setdataSource(list)
        })
    },[])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render:(id)=>{
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title'
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render:(key)=>{
                return <Tag 
                        color="orange"
                       >
                        {key}
                      </Tag>
          }
        },
        {
            title:"操作",
            /*当不取dataIndex时，拿到的为所有对象  */
            render:(item)=>{
                /* console.log(item); */
                return <div>
                            <Button 
                                danger
                                shape="circle" 
                                icon={<DeleteOutlined/>}
                                onClick={()=>confirmMethod(item)}
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
     /* 删除确认 */ 
     const deleteMethod = (item) =>{
           /* 当前页面同步 + 后端同步 */
           if(item.grade===1){
                // console.log("item1",item);
                setdataSource(dataSource.filter(data=>data.id!==item.id))
                axios.delete(`http://localhost:5000/rights/${item.id}`)
           }else{
                 let list = dataSource.filter(data=>data.id===item.rightId)
                 list[0].children = list[0].children.filter(data=>data.id!==item.id)
                //  console.log("grade=2",list);
                    // console.log("grade",dataSource);
                    setdataSource([...dataSource])
                    // setdataSource(dataSource)

                 axios.delete(`http://localhost:5000/children/${item.id}`)
           }
      
     }
    return (
        <div>
            <Table 
                dataSource={dataSource}
                columns={columns}
                pagination={{pageSize:5}}
            />;
        </div>
    )
}
