import { memo, PropsWithChildren, FC, useEffect, useState } from 'react';
import style from './index.module.scss'

type SvgIconsProps = {
    name: string,
    size?: number,
    color?: string,
    svgClass?: string
} & PropsWithChildren

const SvgIcons: FC<SvgIconsProps> = (props) => {
    const { name, size = 14, color = '#fff', svgClass = '' } = props
    const [classList, setClassList] = useState<string>('svgIcon')

    useEffect(() => {
        if(svgClass) {
            setClassList(`${style.svgIcon} ${svgClass}`)
        }
    }, [svgClass])

    return (
        <svg className={classList} aria-hidden="true">
            <use href={`#icon-${name}`} />
        </svg>
    )
}

export default memo(SvgIcons)