import { memo, PropsWithChildren, FC, useState, useCallback } from 'react'
import { Button, Tabs, Input } from 'antd'
import type { TabProps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import style from './index.module.scss'

const items: TabProps['items'] = [
    {
        key: '1',
        label: `正常`,
    },
    {
        key: '2',
        label: `已作废`,
    },
]

const Process: FC<PropsWithChildren> = () => {
    const [activeKey, setActiveKey] = useState('1')
    const [keywords, setKeywords] = useState("")

    const onChangeTab = useCallback((value: string) => {
        setActiveKey(value)
    }, [])

    const onChangeKeywords = useCallback((e: Event) => {
        setKeywords(e.target.value)
    }, [])

    return (
        <div className={style.module}>
            <Tabs activeKey={activeKey} items={items} onChange={onChangeTab} />
            <div className={style.operate}>
                <Button icon={<PlusOutlined />} type="primary">新增工序</Button>
                <div className={style.search}>
                    <Input value={keywords} onChange={onChangeKeywords}/>
                </div>
            </div>
        </div>
    )
}

export default memo(Process)