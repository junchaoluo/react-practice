import axios from 'axios'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'

let isResrLogin = true

const request = axios.create({
    baseURL:'https://test.pharmaoryx.tech:9000',
    timeout: 60000
})

request.interceptors.request.use(config  => {
    config.headers['Authorization'] = '123'
    return config
}, error => {
    return Promise.reject(error)
})

request.interceptors.response.use(response => {
    const { code, result, description } = response.data
    if (code === 200 || code === 0) {
        return response.data
        } else if (code === 401 || code === 1002) {
            message({
                type: 'error',
                content: '登录过期，请重新登录'
            })
        if (isResrLogin) {
            localStorage.removeItem('proJectKeywords')
            sessionStorage.clear()
            const navigate = useNavigate()
            navigate('/login')
            setTimeout(() => {
                isResrLogin = false
            }, 3000)
        }
        } else {
        if (description !== '未知异常') {
            if (result && result.indexOf('JSON parse error: Cannot deserialize value of type') > -1) {
                message({
                    type: 'error',
                    content: '数据格式错误，请填写数字'
                })
            } else {
            if (!(response.data instanceof Blob))
                message({
                    type: 'error',
                    content: description
                })
            }
        }
        return Promise.reject(response.data)
        }
}),error => {
    return Promise.reject(error)
}

export default request