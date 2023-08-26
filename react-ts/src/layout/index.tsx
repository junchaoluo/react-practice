import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import React, { FC, useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { RouteType, Menus } from '@/router/index'
import PermissionOutlet from './permission'
import BreadcrumbCom from './breadcrumb'
import Routes from '@/router'
import { MenuItemType } from 'antd/es/menu/hooks/useItems'

const { Header, Content, Footer, Sider } = Layout
type MenuItem = Required<MenuProps>['items'][number] & { children?: MenuItem[] };

// type MenuItem = Required<MenuProps>['items'][number] & {children?: MenuItem[]}

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
    const tempMenus: MenuItemType[] = []
    Menus.forEach(menu => {
        const obj: MenuItemType & {
            children?: MenuItemType[]
        } = {
            key: ''
        }
        obj.label = menu.name;
        obj.key = menu.path;
        if(menu.icon) {
            obj.icon = menu.icon;
        }
        if(menu.children) {
            if(menu.children.some(i => i.isMenu)){
                obj.children = changeRouterToMenu(menu.children);                
            }
        }
        if(menu.isMenu) {
            tempMenus.push(obj)
        }
    })
    return tempMenus;
}

const LayoutApp: FC =  () => {
    const location = useLocation()

    const [collapsed, setCollapsed] = useState(false)
    const onCollapse = (collapsed: boolean, type?: string) => {
        setCollapsed(collapsed)
    }

    const [selectedKeys, setSelectedKeys] = useState<Array<string>>(['/template'])
    const items: MenuItemType[] = changeRouterToMenu(Menus)
    const navigate = useNavigate()
    const handleClickMenuItem = (e: MenuItemType) => {
        setSelectedKeys([e.key as string])
        navigate(e.key as string)
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
                <Content>
                    <PermissionOutlet/>
                </Content>
            </Layout>
        </Layout>
    )
}
export default LayoutApp;