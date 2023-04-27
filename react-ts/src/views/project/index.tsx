import { useSelector } from 'react-redux'
import user from '../../store/user/index'
import style from './index.module.scss'
import { useCallback, useState } from 'react'
import { Divider, Button, Input } from 'antd'
import { PlusOutlined, SearchOutlined, VideoCameraAddOutlined, SettingOutlined } from '@ant-design/icons'

const Project = () => {
    const statusList = [
        {
            label: '进行中',
            key: 0
        },
        {
            label: '已归档',
            key: 1
        }
    ]
    const [status, setStatus] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const search = useCallback(() => {
        console.log(searchValue)
        
    }, [searchValue])

    return (
        <div className='page-conetnt'>
            <div className={style.header}>
                <span>当前状态：</span>
                <div className={style.status}>
                    {
                        statusList.map(item => {
                            return <div key={item.key} className={item.key === status ? `${style.active} ${style.tabLabel}`:`${style.tabLabel}`} onClick={() => setStatus(item.key)}>{item.label}</div>
                        })
                    }
                </div>
            </div>
            <Divider dashed={true} style={{borderColor: 'rgba(5, 5, 5, 0.2)',borderWidth: '1.5px 0 0'}}/>
            <div className={style.searchModule}>
                <Button type="primary" icon={<PlusOutlined/>}>新增项目</Button>
                <div className={style.search}>
                    <Input placeholder="请输入项目编号查询" prefix={<SearchOutlined />} value={searchValue} onChange={(event: Event) => setSearchValue(((event.target) as HTMLInputElement).value)} />
                    <Button type="primary" className={style.marginLeft12} onClick={() => search()}>搜索</Button>
                    <div className={`${style.marginLeft12} ${style.searchIcon}`}>
                        <VideoCameraAddOutlined/>
                    </div>
                    <div className={`${style.marginLeft12} ${style.searchIcon}`}>
                        <SettingOutlined/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Project;