import axios from 'axios'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
import store from '@/store'

let isResrLogin = true

export const baseURL = 'https://test.pharmaoryx.tech:9000'

const request = axios.create({
    baseURL: baseURL,
    timeout: 60000
})

export const baseUlr = 'http://localhost:7000'

request.interceptors.request.use((config: {
    headers: {
        'Authorization'?: string,
        [propName: string]: unknown
    },
    [propName: string]: unknown
})  => {
    // const userInfo = store.getState('user').user.userInfo
    config.headers['Authorization'] = sessionStorage.getItem('token') || ''
    // config.headers['Authorization'] = userInfo?.token || ''
    return config
}, (error: unknown) => {
    return Promise.reject(error)
})

request.interceptors.response.use((response: {
    data: {
        code: number,
        result: unknown,
        description: string,
        [propName: string]: unknown,
    },
    [propName: string]: unknown,
}) => {
    const { code, result, description } = response.data
    if (code === 200 || code === 0) {
        return response.data
        } else if (code === 401 || code === 1002) {
            message.error('登录过期，请重新登录')
        if (isResrLogin) {
            localStorage.removeItem('proJectKeywords')
            sessionStorage.clear()
            // const navigate = useNavigate()
            // navigate('/login')
            window.location.href = `${baseUlr}/login`
            setTimeout(() => {
                isResrLogin = false
            }, 3000)
        }
        } else {
        if (description !== '未知异常') {
            if (result && result.indexOf('JSON parse error: Cannot deserialize value of type') > -1) {
                message.error('数据格式错误，请填写数字')
            } else {
            if (!(response.data instanceof Blob))
                message.error(description)
            }
        }
        return Promise.reject(response.data)
        }
}),(error: unknown) => {
    return Promise.reject(error)
}

export default request