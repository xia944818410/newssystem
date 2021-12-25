import React, { useState, useEffect, useRef } from "react";
import { PageHeader, Steps, Button, Form, Input, Select } from "antd";
import NewsEditor from "../../../components/news-manage/NewsEditor";
import style from "./News.modal.css";
import axios from "axios";

export default function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);

  // const [formInfo, setFormInfo] = useState({});
  // const [content, setContent] = useState({});

  /* 控制current值来操作下一步 */
  const handleNext = () => {
    if (current === 0) {
      /* 表单校验 */
      NewForm.current
        .validateFields()
        .then((res) => {
          // console.log("1111", res.data);
          setCurrent(current + 1);
        })
        .catch((error) => {
          console.log("2222", error);
        });
    } else {
      setCurrent(current + 1);
    }
  };

  /* 控制current值来操作上一步 */
  const handlePrevious = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    axios.get("/categories").then((res) => {
      setCategoryList(res.data);
    });
  }, []);

  const NewForm = useRef(null);

  return (
    <div>
      <PageHeader className="site-page-header" title="撰写新闻" />
      {/* steps的current属性控制进度条的状态 */}
      <Steps current={current}>
        <Steps.Step title="基本信息" description="新闻标题，新闻分类" />
        <Steps.Step title="新闻内容" description="新闻主体内容" />
        <Steps.Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? "" : style.active}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            ref={NewForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Select>
                {categoryList.map((item) => {
                  return (
                    <Select.Option value={item.id}>{item.title}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.active}>
          <NewsEditor
            getContent={(value) => {
              console.log(1233, value);
            }}
          ></NewsEditor>
        </div>
        <div className={current === 2 ? "" : style.active}>3333333333</div>
      </div>
      <div style={{ marginTop: "50px" }}>
        {current === 2 && (
          <span>
            <Button type="primary">保存到草稿箱</Button>
            <Button danger>提交审核</Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        )}
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
      </div>
    </div>
  );
}
