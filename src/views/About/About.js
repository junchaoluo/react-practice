import React, {Fragment, useEffect, useState} from "react";
import {Avatar, Button, Divider} from 'antd'
import store from '../../store/index'
import { SUB_NUMBER, DECREMENT } from '../../action/index'
import '../../styles/about.css'
import avatarSrc from "../../assets/avatar.jpg"

const About = () => {
  let user = {
    name: "咻咪咻咪",
    age: "27",
    sex: "女",
    hobby: "游泳、弹琴、写代码"
  }

  let skillList = [
    "熟悉HTML5、CSS、JavaScript、ES6；",
    "熟练掌握Vue全家桶，包括Vue-cli、 Vue-Router，Vuex，熟悉Vue的数据响应式原理；",
    "熟练使用elementUI、layui、iView等UI库，使用Echarts图形化展示；",
    "熟练使用axios实现局部更新页面，熟悉axios的二次封装；",
    "了解Java后台开发，能独立完成前后端交互开发；",
    "熟练使用Git、SVN等版本控制系統。",
  ]

  const [count, setCount] = useState(store.getState().count)

  useEffect(() => {
    return store.subscribe(() => {
      setCount(store.getState().count)
    })
  })

  return (
    <Fragment>
      <div style={{marginTop: '10px', marginBottom: '10px'}}>
        <Button type="primary" onClick={() => {
          store.dispatch({
            type: DECREMENT
          })
        }}>+减掉1</Button>
        <Button type="primary" onClick={() => {
          store.dispatch({
            type: SUB_NUMBER,
            num: 3
          })
        }}>+减掉3</Button>
      </div>
      <div>reducr的count数据：{count}</div>
      <div>
        <Divider>
          <div className="user-skill-title">用户信息</div>
        </Divider>
        <div className="user-info">
          <Avatar size={64} src={avatarSrc} />
          <ul>
            <li>姓名：{user.name}</li>
            <li>年龄：{user.age}</li>
            <li>性别：{user.sex}</li>
            <li>爱好：{user.hobby}</li>
          </ul>
        </div>
      </div>
      <div className="user-skill">
        <Divider>
          <div className="user-skill-title">自我评价</div>
        </Divider>
        <ol>
          {
            skillList.map((item, index) => {
              return <li key={index}>{item}</li>
            })
          }
        </ol>
      </div>
    </Fragment>
  )
}

export default About;