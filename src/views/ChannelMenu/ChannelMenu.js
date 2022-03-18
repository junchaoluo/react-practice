import React, {useState} from "react";
import { Menu } from 'antd'
import {Link} from 'react-router-dom'

const ChannelMenu = () => {
  const [ menuList ] = useState([
    {
      key: 0,
      name: '首页',
      path: '/'
    },
    {
      key: 1,
      name: '标签',
      path: '/Tag'
    },
    {
      key: 2,
      name: '关于',
      path: '/About'
    },
  ])

  const [current, setCurrent] = useState('0')

  const handleClick = (e) => {
    setCurrent(e.key)
  }
  return (
    <Menu onClick={(e) => handleClick(e)} selectedKeys={[current]} mode="horizontal">
      {
        menuList.map((item, index) => {
          return <Menu.Item key={item.key}>
            <Link to={item.path} key={item.key}>{item.name}</Link>
          </Menu.Item>
        })
      }
    </Menu>
  )
}
export default ChannelMenu;