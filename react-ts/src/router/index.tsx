import { useRoutes, RouteObject } from 'react-router-dom'
import { lazy, Suspense, LazyExoticComponent } from 'react'
import * as React from 'react'

type RouteType = {
    path: string,
    element: React.ReactNode,
    children?: RouteType[]
}

// import Layout from '../layout/index'
// import Page1 from '../views/page1'
// import Page2 from '../views/page2'

const Layout = lazy(() => import('../layout/index'))
const Home = lazy(() => import('../views/home'))
const Page1 = lazy(() => import('../views/page1'))
const Page2 = lazy(() => import('../views/page2'))

const Routes: RouteType[] = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/home',
                element: <Home/>
            },
            {
                path: '/page1',
                element: <Page1/>
            },
            {
                path: '/page2',
                element: <Page2/>
            }
        ]
    },
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

export default () => useRoutes(syncRouter(Routes));