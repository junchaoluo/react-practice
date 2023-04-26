import handleUser from './index'

const user = (state = handleUser.state, action:{type: string}) => {
    let newState = JSON.parse(JSON.stringify(state))
    // switch(action.type) {

    // }
    return newState
}
export default user;