import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import ChannelMenu from './views/ChannelMenu/ChannelMenu'
import Home from './views/Home/Home'
import Tag from './views/Tag/Tag'
import About from './views/About/About'
import Article from "./views/Article/Article";
import 'antd/dist/antd.css'
import './styles/app.css'
const { Header, Content, Footer } = Layout

const App = () => {
  return (
    <div className="app">
      <Router>
        <Header>
          <ChannelMenu/>
        </Header>
        <Content>
          <Switch>
            <Route exact path="/" component={() => <Home/>}/>
            <Route path="/Article/:id" component={(props) => <Article {...props} />}/>
            <Route path="/Tag" component={() => <Tag/>} />
            <Route path="/About" component={() => <About/>} />
          </Switch>
        </Content>
      </Router>
      <Footer>咻咪咻咪的react的练手网站</Footer>
    </div>
  );
}

export default App;
