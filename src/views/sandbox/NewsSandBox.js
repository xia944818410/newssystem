import React, { useEffect } from "react";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
/* 引入进度条 */
import NProgress from "nprogress";
/* 引入进度条样式 */
import "nprogress/nprogress.css";

//css
import "./NewsSandBox.css";

//antd
import { Layout } from "antd";
import NewsRouter from "../../components/sandbox/NewsRouter";
const { Content } = Layout;

export default function NewsSandBox() {
  /* 显示进度条 */
  NProgress.start();
  /* 赋值给 useEffect 的函数会在组件渲染到屏幕之后执行 */
  useEffect(() => {
    NProgress.done();
  });
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  );
}
