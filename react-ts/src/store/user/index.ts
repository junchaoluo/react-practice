import {UserInfo} from '../../types/user'

const user =  {
    state: {
        userInfo: {}
    },
    actions: {
        setUserInfo(action: {val: UserInfo}) {
            user.state.userInfo = action.val
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