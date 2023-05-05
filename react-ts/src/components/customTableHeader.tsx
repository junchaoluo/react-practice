import Draggable from 'react-draggable'
import { FC } from 'react'
import { Drawer } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

type ColumnsType = {
    title: string,
    key: string,
    dataIndex: string,
    fixed?: string,
    width?: string | number,
    render?: (text?:string, record?: any, index?:number) => JSX.Element
}

type TableHeaderProps = {
    columns: Array<ColumnsType>,
    sortType: string,
    tipsType: string,
    isOpenDrawer: boolean,
    closeDrawer: () => void
}

const CustomTableHeader: FC<TableHeaderProps> = (props) => {
    const {columns, sortType, tipsType, isOpenDrawer, closeDrawer} = props

    return (
        <Drawer open={isOpenDrawer} title="自定义列表" closable={false} extra={
            <CloseOutlined onClick={() => closeDrawer} />
        }>
            <p>请对列表需要显示的信息进行勾选或拖动排序</p>
            <Draggable></Draggable>
        </Drawer>
    )
}

export default CustomTableHeader;