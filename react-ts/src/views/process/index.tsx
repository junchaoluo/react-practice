import { memo, PropsWithChildren, FC } from 'react';
import style from './index.module.scss'

const Process: FC<PropsWithChildren> = () => {
       return (
        <div className={style.module}>Process</div>
       )
}

export default memo(Process)