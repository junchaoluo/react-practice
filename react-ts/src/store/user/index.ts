import {UserInfo} from '../../types/user'

const user =  {
    state: {
        userInfo: {},
        token: ''
    },
    actions: {
        setUserInfo(action: {val: UserInfo}) {
            user.state.userInfo = action.val
            sessionStorage.setItem("token", action.val.token)
            user.state.token = sessionStorage.getItem('token') || ''
        },
        handleJumpTo(action: {val: string}){
            window.open(action.val, '')
			sessionStorage.removeItem('redirectURL')
        }
    },
    asyncActions: {},
    actionNames: {}
}

export default user;