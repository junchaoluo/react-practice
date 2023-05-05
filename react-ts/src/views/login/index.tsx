import style from './index.module.scss'
import { Space, Form, Input, Radio, Button } from 'antd'
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import {login} from '@/api/login'
import Crypto from '@/util/secret'
import Util from '@/util/util.js'
import { fingerpring } from '@/util/device.js'
import { useNavigate } from 'react-router-dom'
import { UserInfo } from '@/types/user'
import { useDispatch } from 'react-redux'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [clientId, setClientId] = useState('')
    useEffect(() => {
        initClientId()
    }, [])

    const initClientId = () => {
        setClientId(localStorage.getItem('clientId'))
        if (clientId) {
            setClientId(rebuildClientId())
        }
    }
    const rebuildClientId = () => {
        const sClientId = Util.gsid(16)
        localStorage.setItem('clientId', sClientId)
        return sClientId
    }

    const [form] = Form.useForm()
    const [initialValues] = useState({
        userrole: '0'
    })
    const [usernameValidateStatus, setUsernameValidateStatus] = useState("")
    const [passwordValidateStatus, setPasswordValidateStatus] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const onFinish = (obj: any) => {
        console.log(obj)
        if(!obj.username || !obj.password){
            if(!obj.password){
                setPasswordValidateStatus("error")
                setErrorMsg('请输入密码')
            }else{
                setPasswordValidateStatus("")
            }
            if(!obj.username){
                setUsernameValidateStatus("error")
                setErrorMsg('请输入账号')
            }else{
                setUsernameValidateStatus("")
            }
        }else{  
            setPasswordValidateStatus("")
            setUsernameValidateStatus("")
            setErrorMsg('')
            // 登录成功
            let password = ''
			const secretKey = Util.gid16()
            if (obj.userrole == 0) {
				password = Crypto.encrypt(obj.password, secretKey, secretKey)
			}
            login({
                account: obj.username,
                password: password,
                adLogin: obj.uaerrole,
                key: secretKey,
                // source 登录源 0 => PC
                source: 0,
                // 客户端身份
                identification: clientId,
                // 图形验证码
                kaptcha: '',
                // 短信码
                verificationCode: ''
            }).then(async res => {
                if(res.code === 0){
                    const r = res.result
                    const userInfo:UserInfo = {
						id: r.id,
						admin: obj.username === 'admin' ? true : false,
						sysAdmin: r.sysAdmin,
						token: r.token,
						account: r.account,
						avator: r.avatar,
						status: r.status,
						nickname: r.realName,
						logintime: new Date().getTime(),
						uuid: 'uuid' + (await fingerpring()),
						researchRooms: r.researchRooms,
						location: r.location ? r.location : '',
						departmentList: r.department,
						departmentName: r.departmentName,
						pwdExpirationTime: r.pwdExpirationTime,
						remindDay: r.remindDay,
						hasReminded: false
					}
                    dispatch({type: 'setUserInfo', val: userInfo})
					const arr = JSON.parse(localStorage.getItem('historyUserName')) || []
					if (!arr.includes(userInfo.account)) {
						arr.push(userInfo.account)
					}

					localStorage.setItem('historyUserName', JSON.stringify(arr))
					const redirectURL = sessionStorage.getItem('redirectURL')
					Util.setCookie('adLogin', obj.userrole)
					if (redirectURL) {
                        dispatch({type: 'setUserInfo', val: redirectURL})
					} else {
						// 登录成功默认到首页
                        navigate('/home')
					}
                }
            })
        }
    }

    return (
        <div className={style.loginBox}>
            <div className={style.loginContent}>
                <div className={style.loginLeft}></div>
                <div className={style.loginRight}>
                    <div className={style.loginTitle}>
                        <Space direction="vertical" size="middle">
                            <div className={style.titleUserCode}>账号登录</div>
                            <div>欢迎使用E-Lab智能实验室管理平台</div>
                        </Space>
                    </div>
                    <div className={style.loginForm}>
                        <Form form={form} onFinish={onFinish} initialValues={initialValues}>
                            {
                                errorMsg?
                                <Form.Item>
                                    <div className={style.errorMsg}>
                                        {errorMsg}
                                    </div>
                                </Form.Item>
                                :
                                ''
                            }
                            <Form.Item name="username" validateStatus={usernameValidateStatus}>
                                <Input size="large" prefix={<UserOutlined/>} placeholder="请输入账号" />
                            </Form.Item>
                            <Form.Item name="password" validateStatus={passwordValidateStatus}>
                                <Input.Password size="large" prefix={<UserOutlined/>} placeholder="请输入登录密码" 
                                iconRender={(visible:boolean) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" className={style.antBtn} htmlType="submit">
                                    登录
                                </Button>
                            </Form.Item>
                            <Form.Item name="userrole">
                                <Radio.Group>
                                    <Radio value="1">博腾</Radio>
                                    <Radio value="0">普通</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
            <div className={style.footer}>
                <Space direction="vertical" size="middle">
                    <div>CopyRight ©️ 2022 PharmaOryx Tech Co., Ltd. All Rights Reserved.</div>
                    <div>ICP备案号 渝XXXXXX</div>
                </Space>
            </div>
        </div>
    )
}
export default Login;