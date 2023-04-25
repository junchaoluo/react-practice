import { Outlet, useNavigate } from 'react-router-dom'
import { FC, useState } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import type { MenuProps } from 'antd'
import { RouteType, Menus } from '../router/index'
// import Routes from '../router'

const { Header, Content, Footer, Sider } = Layout
type MenuItem = Required<MenuProps>['items'][number]

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  function changeRouterToMenu(Menus: RouteType[]){
    const tempMenus: MenuItem[] = []
    Menus.forEach(menu => {
        const obj: MenuItem = {}
        obj.label = menu.name;
        obj.key = menu.path;
        if(menu.icon) {
            obj.icon = menu.icon;
        }
        if(menu.children) {
            obj.children = changeRouterToMenu(menu.children);
        }
        tempMenus.push(obj)
    })
    return tempMenus;
  }

const LayoutApp: FC =  () => {
    const [collapsed, setCollapsed] = useState(false)
    const onCollapse = (collapsed: boolean, type?: string) => {
        console.log(collapsed, type)
    }

    const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(['1'])
    const items: MenuItem[] = changeRouterToMenu(Menus)
    const navigate = useNavigate()
    const handleClickMenuItem = ({ item, key, keyPath, domEvent }: MenuItem) => {
        navigate(key)
    }
    console.log( items)

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible={true} collapsed={collapsed} onCollapse={onCollapse}>
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                <Menu theme="dark" defaultSelectedKeys={defaultSelectedKeys} mode="inline" items={items} onClick={handleClickMenuItem} />
            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: 0, background: '#ccc' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
                <Content style={{ margin: '16px', background: '#ccc' }}>
                    <Outlet/>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    )
}
export default LayoutApp;