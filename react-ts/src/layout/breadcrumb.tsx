import { Breadcrumb } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menus } from '@/router/index'

interface BreadcrumbProps {
    name: string,
    path: string,
    isRedirect?: boolean
}

const BreadcrumbCom = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [breadcrumb, setBreadcrumb] = useState<Array<BreadcrumbProps>>([])

    useEffect(() => {
        // 组装面包屑
        assembleBreadCrumb()
    }, [location.pathname])

    const assembleBreadCrumb = (arr = Menus) => {
        arr.forEach(item => {
            if(item.children && item.children.length > 0){
                item.children.forEach(aItem => {
                    if(location.pathname === aItem.path) {
                        setBreadcrumb([])
                        setBreadcrumb(Object.assign([], [{
                            name: item.name,
                            path: item.path,
                            isRedirect: item.isRedirect
                        }, {
                            name: aItem.name,
                            path: aItem.path,
                            isRedirect: aItem.isRedirect
                        }]))
                    }
                })
            }else{
                if(location.pathname === item.path) {
                    setBreadcrumb([])
                    setBreadcrumb(Object.assign([], [{
                        name: item.name,
                        path: item.path,
                        isRedirect: item.isRedirect
                    }]))
                }
            }
        })
    }

    const routerPage = (item: BreadcrumbProps) => {
        if(!item.isRedirect) {
            navigate(item.path)
        }
    }

    return (
        <Breadcrumb style={{ margin: '16px 0' }}>
            {
                breadcrumb.map(item => {
                    return <Breadcrumb.Item key={item.path} onClick={() => routerPage(item)}>{item.name}</Breadcrumb.Item>
                })
            }
        </Breadcrumb>
    )
}
export default BreadcrumbCom;