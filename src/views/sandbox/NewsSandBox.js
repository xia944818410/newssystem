import React from 'react'
import { Redirect, Route, Switch } from '_react-router-dom@5.3.0@react-router-dom/cjs/react-router-dom.min'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import Home from './home/Home'
import UserList from './user-manage/UserList'
import RoleList from './right-manage/RoleList'
import RightList from './right-manage/RightList'
import Nopermission from './nopermission/Nopermission'
export default function NewsSandBox() {
    return (
        <div>

           <SideMenu></SideMenu>
           <TopHeader></TopHeader>

            <Switch>
                <Route path="/home" component={Home}/>
                <Route path="/user-manage/list" component={UserList}/>
                <Route path="/right-manage/role/list" component={RoleList}/>
                <Route path="/right-manage/right/list" component={RightList}/>

                <Redirect  from="/" to="/home" exact/>
                <Route path="*" component={Nopermission}/>
            </Switch>

        </div>
    )
}
