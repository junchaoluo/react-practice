import { memo, forwardRef } from 'react'

const ChooseUser = memo(forwardRef((props, ref: HTMLElement) => {
    return (
        <div>人员</div>
    )
}))

export default ChooseUser;