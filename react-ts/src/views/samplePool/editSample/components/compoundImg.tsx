import { memo, PropsWithChildren, FC } from 'react';
import style from'../index.module.scss'

const Template: FC<PropsWithChildren> = () => {
       return (
        <div className={style.compoundImg}>
            <div className={style.image}></div>
            <div className={style.info}></div>
        </div>
       )
}

export default memo(Template)