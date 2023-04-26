const defaultState = {}

const user = (state = defaultState, action:{type: string}) => {
    let newState = JSON.parse(JSON.stringify(state))
    // switch(action.type) {

    // }
    return newState
}
export default user;