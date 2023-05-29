import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {UserInfo} from '@/types/user'
import { login } from '@/api/login'
import { fingerpring } from '@/util/device.js'
import Util from '@/util/util.js'
import { baseUlr } from '@/request'

export const loginUser = createAsyncThunk('loginUser', async (params: {
    account: string,
    [propName: string]: unknown
}) => {
    const res = await login(params)
    let userInfo: UserInfo = {}
    if(res.code === 0){
        const r = res.result
        userInfo = {
            id: r.id,
            admin: params.account === 'admin' ? true : false,
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
    }
    return userInfo
})

export const userSlice = createSlice({
    name: 'userSlice',
    initialState: {
        userInfo: sessionStorage.getItem('userInfo')?JSON.parse(sessionStorage.getItem('userInfo')):{}
    },
    reducers: {
        setUserInfo(state: {userInfo: UserInfo}, action:{payload: UserInfo}) {
            state.userInfo = action.payload
            sessionStorage.setItem("userInfo", JSON.stringify(action.payload))
            sessionStorage.setItem("token", action.payload.token || '')
        },
        handleJumpTo(state: {userInfo: UserInfo}, action: {payload: string}){
            window.open(action.payload, '')
			sessionStorage.removeItem('redirectURL')
        }
    },
    extraReducers(builder){
        builder
        .addCase(loginUser.fulfilled, (state, action) => {
            const userInfo = action.payload
            state.userInfo = userInfo
            sessionStorage.setItem("userInfo", JSON.stringify(userInfo))
            sessionStorage.setItem("token", userInfo.token || '')
            const arr = JSON.parse(localStorage.getItem('historyUserName')) || []
            if (!arr.includes(userInfo.account)) {
                arr.push(userInfo.account)
            }

            localStorage.setItem('historyUserName', JSON.stringify(arr))
            const redirectURL = sessionStorage.getItem('redirectURL')
            // Util.setCookie('adLogin', obj.userrole)
            if (redirectURL) {
                // dispatch({type: 'setUserInfo', val: redirectURL})
                window.open(redirectURL, '')
			sessionStorage.removeItem('redirectURL')
            } else {
                // 登录成功默认到首页
                window.location.href=`${baseUlr}/home`
            }
        })
    }
})

export const { setUserInfo, handleJumpTo } = userSlice.actions
export default userSlice.reducer