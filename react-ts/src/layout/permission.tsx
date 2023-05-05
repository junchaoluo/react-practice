// 类似路由守卫，看看是否登录
import { useLocation, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import user from '@/store/user/index'
import Login from '@/views/login'

const PermissionOutlet = () => {
    const location = useLocation()
    // const { token } = useSelector((state) => ({
    //     token: user.state.token
    // }))

    const token = sessionStorage.getItem('token')
    
    // 如果访问登录页面不做操作，如果访问其他页面判断是否登录，没登录自动跳转到登录页面
    if(location.pathname !== '/login' && !token){
        window.location.href = "http://localhost:7000/login"
        return <Login/>
    }
    return <Outlet/>
}
export default PermissionOutlet;