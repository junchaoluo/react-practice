import React, { memo, useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { FC, ReactNode } from 'react'
import { ProjectProps } from '../index'
import { Descriptions, DatePicker, Cascader, Input } from 'antd'
import style from '../index.module.scss'
import { getDeptTree } from '@/api/user'

const { RangePicker } = DatePicker;
const { TextArea } = Input;
interface IProps {
    project: ProjectProps,
    children?: ReactNode
}

const BasicInfo = forwardRef((props: IProps, ref: ForwardedRef) => {
    const { project } = props
    useImperativeHandle(ref, () => ({
        project
    }))

    // 进入页面进行渲染
    useEffect(() => {
        // 查询下拉框数据 部门下拉框
        getDepartmentOptions()
    }, [])

    const [departmentOptions, setDepartmentOptions] = useState([]) // 部门
    // 所属部门
    const getDepartmentOptions = useCallback(() => {
        getDeptTree().then((res: {
            result?: Array<never>
        }) => {
            setDepartmentOptions(res.result || [])
        })
    },[])

    return (
        <div className={style.basicInfo}>
            <div>
                <Descriptions
                    column={2}
                    title="基础信息"
                    bordered
                    size="middle"
                    >
                    <Descriptions.Item label="产品号">
                        { project.productCode || '-' }
                    </Descriptions.Item>
                    <Descriptions.Item label="项目周期">
                        {
                            project.type === "0"?
                            `${project.startTime}~${project.endTime}`
                            :
                            <RangePicker format="YYYY-MM-DD" placeholder={['开始日期', '结束日期']} value={project.cycle} />
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="项目编号">{project.code || '-'}</Descriptions.Item>
                    <Descriptions.Item label="所属部门">
                    {
                            project.type === "0"?
                            `${project.departments.map(item => item.name)?.join('/')}`
                            :
                            <Cascader options={departmentOptions} placeholder="请选择" value={project.departmentIds} fieldNames={{label: 'name', value: 'id', children: 'childNode'}}></Cascader>
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="项目类型" span={2}>{project.projectType || '-'}</Descriptions.Item>
                    <Descriptions.Item label="项目描述" span={2}>
                        {
                            project.type === "0"?
                            `${project.description || '-'}`
                            :
                            <TextArea value={project.description} rows={3} placeholder="请输入项目描述"/>
                        }
                    </Descriptions.Item>
                </Descriptions>
            </div>
       </div>
    )
})

export default memo(BasicInfo)