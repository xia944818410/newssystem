import React,{useState} from 'react'
import { Layout ,Menu, Dropdown, Avatar } from 'antd';
import { MenuUnfoldOutlined,MenuFoldOutlined ,UserOutlined} from '@ant-design/icons';
import {withRouter} from 'react-router-dom'
const { Header } = Layout;

function TopHeader(props) {
    const [collapsed,setCollapsed] = useState(false)
    const changeCollapsed = ()=>{
        setCollapsed(!collapsed)
    }
    /* localStorage.getItem("token")是表单收集的数据;结构解析取出roleName和username*/
    const {role:{rights,roleName},username} = JSON.parse(localStorage.getItem("token"))
    
    const menu = (
        <Menu>
            <Menu.Item>
                {roleName}
            </Menu.Item>
            <Menu.Item 
               danger
               onClick={()=>{
                  localStorage.removeItem("token")
                  /* 重定向到login组件 */
                  props.history.replace("/login")
               }}
            >
                退出
            </Menu.Item>
        </Menu>
      );

    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {
                collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/>
                : <MenuFoldOutlined onClick={changeCollapsed}/>
            }
            <div style={{float:"right"}}>
                <span>
                    欢迎
                    <span style={{color:"#1890ff"}}>
                        {username}
                    </span>
                    回来
                </span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
      </Header>
    )
}
export default withRouter(TopHeader)