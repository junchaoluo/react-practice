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
const ProjectDetail = lazy(() => import('@/views/project/projectDetail'))
const AddProject = lazy(() => import('@/views/project/addProject/addProject'))
const Process = lazy(() => import('@/views/process'))
const EditProcess = lazy(() => import('@/views/process/editProcess'))
const Type = lazy(() => import('@/views/type'))
const SamplePool = lazy(() => import('@/views/samplePool'))
const EditSample = lazy(() => import('@/views/samplePool/editSample'))
const MySample = lazy(() => import('@/views/my-sample'))

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
        path: '/project/detail',
        name: '项目详情',
        element: <ProjectDetail/>,
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
                path: '/set/process',
                name: '工序设置',
                isMenu: true,
                element: <Process/>,
            },
            {
                path: '/set/process/edit',
                name: '编辑工序',
                isMenu: false,
                element: <EditProcess/>,
            },
            {
                path: '/set/type',
                name: '实验类型',
                isMenu: true,
                element: <Type/>,
            }
        ]
    },
    {
        path: '/sample-pool',
        name: '样品池',
        icon: <FundProjectionScreenOutlined />,
        element: <SamplePool/>,
        isMenu: true
    },
    {
        path: '/my-sample',
        name: '我的送样',
        icon: <FundProjectionScreenOutlined />,
        element: <MySample/>,
        isMenu: true
    },
    {
        path: '/sample-pool/edit-sample',
        name: '编辑送样',
        element: <EditSample/>,
        isMenu: false
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