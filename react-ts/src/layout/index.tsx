import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { FC, useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { RouteType, Menus } from '../router/index'
import PermissionOutlet from './permission'
import BreadcrumbCom from './breadcrumb'

const { Header, Content, Footer, Sider } = Layout
type MenuItem = Required<MenuProps>['items'][number]

const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    ): MenuItem =>  {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
} 

const changeRouterToMenu = (Menus: RouteType[]) => {
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
    const location = useLocation()

    const [collapsed, setCollapsed] = useState(false)
    const onCollapse = (collapsed: boolean, type?: string) => {
        setCollapsed(collapsed)
    }

    const [selectedKeys, setSelectedKeys] = useState(['/template'])
    const items: MenuItem[] = changeRouterToMenu(Menus)
    const navigate = useNavigate()
    const handleClickMenuItem = ({ item, key, keyPath, domEvent }: MenuItem) => {
        setSelectedKeys([key])
        navigate(key)
    }

    useEffect(() => {
        changeSelectKeys()
    }, [])

    const changeSelectKeys = (arr = Menus) => {
        arr.forEach(item => {
            if(item.children && item.children.length > 0){
                changeSelectKeys(item.children)
            }else{
                if(location.pathname === item.path) {
                    setSelectedKeys([item.path])
                }
            }
        })
    }

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible={true} style={{backgroundColor: '#fff'}} collapsed={collapsed} onCollapse={onCollapse}>
                <Menu selectedKeys={selectedKeys} mode="inline" items={items} onClick={handleClickMenuItem} />
            </Sider>
            <Layout className="site-layout">
                <Header style={{ paddingLeft: '16px',height: '56px', background: '#fff' }}>
                    <BreadcrumbCom/>
                </Header>
                <Content style={{ margin: '16px', background: '#fff' }}>
                    <PermissionOutlet/>
                </Content>
            </Layout>
        </Layout>
    )
}
export default LayoutApp;