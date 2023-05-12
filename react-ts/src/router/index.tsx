import { useRoutes, RouteObject, Navigate, Outlet } from 'react-router-dom'
import { lazy, Suspense, LazyExoticComponent, ReactNode } from 'react'
import { FundProjectionScreenOutlined, SettingOutlined } from '@ant-design/icons'

type RouteType = {
    path: string,
    element: ReactNode,
    isRedirect?: boolean,
    name?: string,
    icon?: ReactNode,
    children?: RouteType[],
    isMenu?: boolean
}

// import Layout from '../layout/index'
// import Page1 from '../views/page1'
// import Page2 from '../views/page2'

const Layout = lazy(() => import('@/layout/index'))
const Home = lazy(() => import('@/views/home'))
const Login = lazy(() => import('@/views/login'))
const NoPage = lazy(() => import('@/views/nopage'))
const Project = lazy(() => import('@/views/project'))
const AddProject = lazy(() => import('@/views/project/addProject'))
const Template = lazy(() => import('@/views/template'))
const Type = lazy(() => import('@/views/type'))

const Menus: RouteType[] = [
    {
        path: '/project',
        name: '项目',
        icon: <FundProjectionScreenOutlined />,
        element: <Project/>,
        isMenu: true
    },
    {
        path: '/project/add',
        name: '新增项目',
        element: <AddProject/>,
        isMenu: false
    },
    {
        path: '/set',
        name: '设置',
        isRedirect: true,
        isMenu: true,
        icon: <SettingOutlined />,
        element: <Outlet/>,
        children: [
            {
                path: '/set/template',
                name: '实验模板',
                isMenu: true,
                element: <Template/>,
            },
            {
                path: '/set/type',
                name: '实验类型',
                isMenu: true,
                element: <Type/>,
            }
        ]
    },

]

const Routes: RouteType[] = [
    {
        path: '/',
        element: <Layout />,
        children: [
            ...Menus,
            {
                path: '/home',
                element: <Home/>
            }
        ],
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '*',
        element: <NoPage/>
    }
]

const syncRouter = (routes: RouteType[]): RouteObject[] => {
    const syncRoutes: RouteObject[] = []
    routes.forEach(route => {
        syncRoutes.push({
            path: route.path,
            element: (
                <Suspense fallback={<div>Loading...</div>}>
                    {route.element}
                </Suspense>
            ),
            children: route.children && syncRouter(route.children)
        })
    })
    return syncRoutes
}

export {
    Menus,
    type RouteType,
}

export default () => useRoutes(syncRouter(Routes));