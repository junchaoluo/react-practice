import { Breadcrumb } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menus } from '../router/index'

interface BreadcrumbProps {
    name: string,
    path: string
}

const BreadcrumbCom = () => {
    const location = useLocation()
    const [breadcrumb, setBreadcrumb] = useState<Array<BreadcrumbProps>>([])

    useEffect(() => {
        // 组装面包屑
        assembleBreadCrumb()
    }, [location.pathname])

    const assembleBreadCrumb = (arr = Menus) => {
        console.log(breadcrumb)
        arr.forEach(item => {
            if(item.children && item.children.length > 0){
                item.children.forEach(aItem => {
                    if(location.pathname === aItem.path) {
                        setBreadcrumb(Object.assign([], breadcrumb, [{
                            name: aItem.name,
                            path: item.path
                        }]))
                    }
                })
            }else{
                if(location.pathname === item.path) {
                    setBreadcrumb(Object.assign([], breadcrumb, [{
                        name: item.name,
                        path: item.path
                    }]))
                }
            }
        })
    }

    console.log(breadcrumb)

    return (
        <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
    )
}
export default BreadcrumbCom;