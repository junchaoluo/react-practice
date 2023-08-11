import { memo, PropsWithChildren, FC, useState, useEffect } from 'react';
import style from'../index.module.scss'
import { Image } from 'antd'
import { Compound, setImg } from '../components/basicInfo'

type IProps = PropsWithChildren<Compound>

// 失败图片地址
import fallbackSrc from '@/assets/images/login-left.png';

const Template: FC<IProps> = (props) => {
    const { recordId, name, structureImgPath } = props

       return (
        <div className={style.compoundImg}>
            <div className={style.image}>
                <Image height={114} preview={false} src={setImg(structureImgPath)} fallback={fallbackSrc} />
            </div>
            <div className={style.info}>
                { name ? name : '化合物预览' }
            </div>
        </div>
       )
}

export default memo(Template)