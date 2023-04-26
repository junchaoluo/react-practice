import style from './index.module.scss'
import { Space, Form, Input, Radio, Button } from 'antd'
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
import { useState } from 'react'

const Login = () => {
    const [form] = Form.useForm()
    const [initialValues, setInitialValues] = useState({
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
        }
    }

    return (
        <div className={style.loginBox}>
            <div className={style.loginContent}>
                <div className={style.loginLeft}></div>
                <div className={style.loginRight}>
                    <div className={style.loginTitle}>
                        <Space direction="vertical" size="middle">
                            <div>账号登录</div>
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
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
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