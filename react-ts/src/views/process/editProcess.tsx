/**
* @file  editProcess
* @date 2023-06-10
*/


import {memo, PropsWithChildren, useEffect, useState} from 'react';
import type { FC } from 'react';
import { useSearchParams } from 'react-router-dom'
import { Form, Input } from 'antd'
import style from './index.module.scss'

const getData = (id: string, setData: CallableFunction) => {

}

const EditProcess: FC<PropsWithChildren> = (props) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [data, setData] = useState({})
    const [form] = Form.useForm()

    useEffect(() => {
        if(searchParams.get('type') == 1) {
            //编辑 查看详情
            getData(searchParams.get('id'), setData)
        }
    }, [searchParams.get('type')])

    return (
        <div className={style.module}>
            <div className={style.editProcess}>
                <Form form={form} layout="vertical">
                    <Form.Item label="工序名称" name="name" rules={[{required: true, message: '请输入工序名称'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item>
                        <div className={style.chooseType}>

                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};

export default memo(EditProcess);
