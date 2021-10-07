import React, { forwardRef,useEffect,useState } from 'react'
import {Form,Input,Select} from "antd"
const { Option } = Select;
const UserForm = forwardRef((props,ref) =>{
    /* 通过isDisabled来控制区域选择按钮 */
    const  [isDisabled, setisDisabled] = useState(false)
    /* 接收isUpdateDisabled的状态值，并更新isDisabled，接收父传子*/
    useEffect(()=>{
        setisDisabled(props.isUpdateDisabled)
    },[props.isUpdateDisabled])
    return (
        <Form
           ref={ref}
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
                /* 当为超级管理员时，isDisabled=true,不会显示message内容 */
                rules={isDisabled?[]:[{ required: true, 
                    message: 'Please input the title of collection!'
                }]}
            >
                {/* 模态框区域选项列表数据 */}
                <Select
                     /* 禁用区域选择按钮 */
                    disabled={isDisabled}
                >
                    {
                        props.regionList.map(item =>
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
                <Select
                    /* onChange事件：当角色选择为超级管理员时禁用区域选择按钮，
                        value=1时代表角色选择为超级管理员*/
                    onChange={(value)=>{
                        /* console.log(value, typeof(value)) */ //value的1是字符串的1
                        if(value === '1'){
                            setisDisabled(true)
                            /* 当选择为超级管理员时，区域默认显示为空 */
                            // console.log("ref",ref);
                            ref.current.setFieldsValue({
                                region:""
                            })
                        }else{
                            setisDisabled(false)
                        }
                    }}
                >
                    {
                        props.roleList.map(item =>
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
    )
}
)
export default UserForm