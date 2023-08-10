import { memo, PropsWithChildren, FC } from 'react';
import style from'../index.module.scss'
import { Image } from 'antd'

type IProps = PropsWithChildren<{
    name: string
}>

const Template: FC<IProps> = (props) => {
    const { name } = props

       return (
        <div className={style.compoundImg}>
            <div className={style.image}>
                <Image/>
            </div>
            <div className={style.info}>
                { name ? name : '化合物预览' }
            </div>
        </div>
       )
}

export default memo(Template)