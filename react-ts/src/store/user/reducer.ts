import handleUser from './index'

const user = (state = handleUser.state, action:{type: string, val: any}) => {
    const newState = JSON.parse(JSON.stringify(state))
    switch(action.type) {
        case 'setUserInfo':
            handleUser.actions['setUserInfo'](action)
            break;
        case 'handleJumpTo':
            handleUser.actions['handleJumpTo'](action)
            break;
        default: break;
    }
    return newState
}
export default user;