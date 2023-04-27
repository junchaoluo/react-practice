import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { FC, useEffect, useState } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import type { MenuProps } from 'antd'
import { RouteType, Menus } from '../router/index'
import PermissionOutlet from './permission'

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



const LayoutApp: FC =  () => {
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const onCollapse = (collapsed: boolean, type?: string) => {
        setCollapsed(collapsed)
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
    const items: MenuItem[] = changeRouterToMenu(Menus)

    const handleClickMenuItem = ({ item, key, keyPath, domEvent }: MenuItem) => {
        navigate(key)
    }

    const [defaultSelectedKeys, setDefaultSelectedKeys] = useState([''])
    useEffect(() => {
        searchDefaultSelect()
    }, [])
    const searchDefaultSelect = (arr = Menus) => {
        arr.forEach(item => {
            if(item.children && item.children.length > 0){
                searchDefaultSelect(item.children)
            }else if(item.path === location.pathname) {
                setDefaultSelectedKeys([item.path])
            }
        })
    }

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible={true} style={{backgroundColor: '#fff'}} collapsed={collapsed} onCollapse={onCollapse}>
                <Menu defaultSelectedKeys={defaultSelectedKeys} mode="inline" items={items} onClick={handleClickMenuItem} />
            </Sider>
            <Layout className="site-layout">
                <Header style={{ paddingLeft: '16px',height: '56px', background: '#fff' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
                <Content style={{ margin: '16px', background: '#fff' }}>
                    <PermissionOutlet/>
                </Content>
            </Layout>
        </Layout>
    )
}
export default LayoutApp;