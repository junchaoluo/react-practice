import React, { useEffect, useState} from "react";
import axios from "axios";
import { Button, Divider } from 'antd'
import { useHistory } from 'react-router-dom'
import '../../mock/mock.js'
import '../../styles/article.css'

const Article = (props) => {
  // console.log(props.match.params.id)
  const [article, setArticle] = useState({})
  let history = useHistory();

  useEffect(() => {
    axios.get('http://localhost:3000/getDataById').then(res => {
      setArticle(res.data.object)
    })
  }, [props.match.params.id])

  const back = () => {
    history.push("/")
  }

  return (
    <div className="article">
      <div>
        <Divider>
          <div className="title">{article.title}</div>
        </Divider>
        <div className="content">{article.content}</div>
        <div className="datetime">{article.datetime}</div>
      </div>
      <div className="back">
        <Button onClick={() => back()}>返回</Button>
      </div>
    </div>
  )
}

export default Article;