import handleUser from './index'

const user = (state = handleUser.state, action:{type: string, val: any}) => {
    const newState = JSON.parse(JSON.stringify(state))
    switch(action.type) {
        case 'setUserInfo':
            handleUser.actions['setUserInfo'](newState, action)
            break;
        case 'handleJumpTo':
            handleUser.actions['handleJumpTo'](newState, action)
            break;
        default: break;
    }
    console.log(newState)
    return newState
}
export default user;