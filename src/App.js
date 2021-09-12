import Child from './Child'
import './App.css'
import { useEffect } from 'react'
import axios from 'axios'
function App(){

  useEffect(()=>{
    axios.get("/ajax/movieOnInfoList?token=&optimus_uuid=74B5F0A032A711EB82DD6B9282E93C676D27D7B9731D4E608D7612C3E708C120&optimus_risk_level=71&optimus_code=10").then(res=>{
      console.log(res.data)
    })
  },[])

  return <div>
    app
      <ul>
        <li>11111</li>
        <li>22222</li>
      </ul>
    <Child/>
  </div>
}

export default App