import React from "react";

import axios from "axios";
import { Form, Button, Input, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Particles from "react-particles-js";

import "./Login.css";

/* Login组件为路由组件，使用Router包括起来的（在IndexRouter组件中），
   react-router 的 history、location、match 三个对象会传入到props对象上，可直接使用props.history属性 */
export default function Login(props) {
  /* onFinish是表单收集的数据 */
  // console.log("123465",props)
  const onFinish = (values) => {
    /* 打印的values值就是表单里接收到的数据 */
    // console.log("value",values);
    axios
      .get(
        `/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`
      )
      .then((res) => {
        // console.log("789", res.data);
        if (res.data.length === 0) {
          message.error("用户名或密码不匹配");
        } else {
          console.log("res", res.data);
          /* 某个管理员登录成功后把JSON.stringify(res.data[0])存入到localStorage中
             这里拿到的数据是指某个管理员下的全部数据
             使用localStorage.getItem("token")即可拿到所以数据*/
          localStorage.setItem("token", JSON.stringify(res.data[0]));
          props.history.push("/");
        }
      });
  };
  return (
    <div
      style={{
        background: "rgb(35, 39, 65)",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* 粒子效果引入 */}
      <Particles
        height={document.documentElement.clientHeight}
        params={{
          background: {
            color: {
              value: "rgb(35, 39, 65)",
            },
            position: "50% 50%",
            repeat: "no-repeat",
            size: "cover",
          },
          fullScreen: {
            enable: true,
            zIndex: 1,
          },
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "bubble",
                parallax: {
                  force: 60,
                },
              },
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 1,
                size: 40,
              },
              grab: {
                distance: 400,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: {
                value: "#fff",
              },
              distance: 150,
              opacity: 0.4,
            },
            move: {
              attract: {
                rotate: {
                  x: 600,
                  y: 1200,
                },
              },
              enable: true,
              outModes: {
                default: "bounce",
                bottom: "bounce",
                left: "bounce",
                right: "bounce",
                top: "bounce",
              },
              speed: 6,
            },
            number: {
              density: {
                enable: true,
              },
              value: 170,
            },
            opacity: {
              animation: {
                speed: 1,
                minimumValue: 0.1,
              },
            },
            shape: {
              options: {
                character: {
                  fill: false,
                  font: "Verdana",
                  style: "",
                  value: "*",
                  weight: "400",
                },
                char: {
                  fill: false,
                  font: "Verdana",
                  style: "",
                  value: "*",
                  weight: "400",
                },
                polygon: {
                  nb_sides: 5,
                },
                star: {
                  nb_sides: 5,
                },
                image: {
                  height: 32,
                  replace_color: true,
                  src: "/logo192.png",
                  width: 32,
                },
                images: {
                  height: 32,
                  replace_color: true,
                  src: "/logo192.png",
                  width: 32,
                },
              },
              type: "image",
            },
            size: {
              value: 16,
              animation: {
                speed: 40,
                minimumValue: 0.1,
              },
            },
            stroke: {
              color: {
                value: "#000000",
                animation: {
                  h: {
                    count: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    sync: true,
                  },
                  s: {
                    count: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    sync: true,
                  },
                  l: {
                    count: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    sync: true,
                  },
                },
              },
            },
          },
        }}
      />
      <div className="formContainer">
        <div className="login-title">全球新闻发布系统</div>
        <Form
          name="normal_login"
          className="login-form"
          /* onFinish是表单收集的数据 */
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
