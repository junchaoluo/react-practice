import {UserInfo} from '@/types/user'

const user =  {
    state: {
        userInfo: sessionStorage.getItem('userInfo')?JSON.parse(sessionStorage.getItem('userInfo')):{}
    },
    actions: {
        setUserInfo(newState: UserInfo, action: {val: UserInfo}) {
            user.state.userInfo = action.val
            sessionStorage.setItem("userInfo", JSON.stringify(action.val))
            sessionStorage.setItem("token", action.val.token)
            Object.assign(newState, user.state)
        },
        handleJumpTo(newState: UserInfo, action: {val: string}){
            window.open(action.val, '')
			sessionStorage.removeItem('redirectURL')
            Object.assign(newState, user.state)
        }
    },
    asyncActions: {},
    actionNames: {}
}

export default user;