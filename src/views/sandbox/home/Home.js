import React from 'react'
import { Button } from 'antd';
import axios from "axios"
export default function Home() {
    const ajax = ()=>{
         axios.get("http://localhost:8000/posts").then(res=>{
             console.log(res.data);
         })
    }
    return (
        <div>
           <Button type="primary" onClick={ajax}>Button</Button>
        </div>
    )
}
