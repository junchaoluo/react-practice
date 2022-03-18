import React, {Fragment, useEffect, useState} from "react";
import {Button, Tag} from 'antd'
import store from '../../store/index'
import { ADD_NUMBER } from '../../action/index'
import '../../styles/tag.css'

const HomeTag = () => {

  // 随机生成颜色
  const getRandomColor = () => {
    let r = Math.floor(Math.random()*256);
    let g = Math.floor(Math.random()*256);
    let b = Math.floor(Math.random()*256);
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  }

  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    // 随机生成字符串
    let randomStr = "撒可见度封杀和芬兰的老男大黄蜂诺卡拉圣诞节娃儿破洞裤";
    const getRandomTitle = () => {
      let randomTitle = "";
      for (let i = 0;i<4;i++){
        randomTitle += randomStr[Math.floor(Math.random() * randomStr.length)];
      }
      return randomTitle;
    }
    let arr = [];
    for (let i = 0;i<50;i++){
      arr.push({
        color: getRandomColor(),
        tagTitle: getRandomTitle(),
      })
    }
    setTagList(arr);
  }, [])

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
            type: ADD_NUMBER,
            num: 5
          })
        }}>+新增5</Button>
      </div>
      <div>reducr的count数据：{count}</div>
      <ul className="tag-ul">
        {
          tagList.map((item, index) => {
            return <li key={index}>
              <Tag color={item.color}>{item.tagTitle}</Tag>
            </li>
          })
        }
      </ul>
    </Fragment>
  )
}

export default HomeTag;