import React, {Fragment, useEffect, useState} from "react";
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { Table, Button } from 'antd'
import store from '../../store/index'
import {INCREMENT} from '../../action/index'
import '../../mock/mock.js'
import '../../styles/app.css'

const Home = () => {
  const [list, setList] = useState([]);
  let columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (text, row) => {
        return <a onClick={() => viewDetails(row)}>查看详情</a>
      }
    },
  ]
  let history = useHistory();

  useEffect(() => {
    axios.get('http://localhost:3000/getList').then(res => {
      setList(res.data.array)
    })
  },[])


  const viewDetails = (item) => {
    history.push(`/Article/${item.id}`)
  }

  return (
    <Fragment>
      <div style={{marginTop: '10px', marginBottom: '10px'}}>
        <Button type="primary" onClick={() => {
          store.dispatch({
            type: INCREMENT
          })
        }}>+新增1</Button>
      </div>
      <div>reducr的count数据：{store.getState().count}</div>
      <Table dataSource={list} columns={columns}/>
    </Fragment>
  )
}

export default Home;