import style from './index.module.scss'
import { Card, Form, Row, Col,  Select, Input, AutoComplete, DatePicker, Cascader } from 'antd'
import { useEffect, useState } from 'react'
import { getProducts } from '@/api/project'
import { getDeptTree } from '@/api/user'
import { memo, useCallback, forwardRef } from 'react'

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

type IProps = {
    type: 0 | 1 | 2, // 新增、编辑、详情
    projectInfo: {
        departments: Array<{
            id: string
        }>,
        departmentId: string,
        departmentName: string
    }
}

const BasicInfo = memo(forwardRef((props: IProps, ref: any) => {
    
    const projectTypeList: Array<{
        value: string
    }> = [
        { value: 'B类' },
        { value: 'A类' },
        { value: '自主立项' },
        { value: 'FTE类' },
        { value: 'C类' }
    ] // 项目类型
    const [productOptions, setProductOptions] = useState([]) // 产品数据
    const [loadMoreProductPageNum, setLoadMoreProductPageNum] = useState(1) // 下拉产品数据
    const [departmentOptions, setDepartmentOptions] = useState([]) // 部门
    
    const[form] = Form.useForm()
    const [initialValues, setInitialValues] = useState({
        departmentIds: []
    })

    // 进入页面进行渲染
    useEffect(() => {
        // 查询下拉框数据 产品下拉框、部门下拉框
        getProductList(true)
        getDepartmentOptions()
    }, [])

    useEffect(() => {
        // 默认的部门
        const departmentIds: string[] = Array.from(props.projectInfo.departments, item => item.id)
        setInitialValues(Object.assign({}, initialValues, {
            departmentIds: departmentIds
        }))
        form.setFieldValue('departmentIds', departmentIds)
    }, [props.projectInfo.departments])

    // 产品下拉框
    const getProductList = useCallback((reset: boolean, key = '') => {
        if (reset) {
            setLoadMoreProductPageNum(1)
            setProductOptions([])
          }
          getProducts(loadMoreProductPageNum || 1, 10, key).then((res: {
            result: {
                rows: Array<any>
            }
          }) => {
            const list = res.result.rows
            if (list) {
            const arr:any = []
              list.forEach((item: any) => {
                arr.push(item)
              })
              setProductOptions(productOptions.concat(...arr))
            }
          })
    }, [])
    // 所属部门
    const getDepartmentOptions = useCallback(() => {
        getDeptTree().then((res: {
            result?: Array<never>
        }) => {
            setDepartmentOptions(res.result || [])
        })
    },[])

    return (
        <>
            <Card title="基础信息" size="small">
                <Form form={form} initialValues={initialValues} ref={ref}>
                    <Row gutter={20}>
                        <Col span={8}>
                            <Form.Item {...layout} label="产品号" name="productId">
                                <Select showSearch placeholder="请选择产品号" allowClear showArrow={false} filterOption={(inputValue: string, option: any) => option.label.includes(inputValue)}>
                                    {
                                        productOptions.map((item: {
                                            pdNo: string,
                                            id: string
                                        }, index: number) => {
                                            return <Option label={item.pdNo} value={item.id} key={item.id+index}>{item.pdNo}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item {...layout} label="项目编号" name="code">
                                <Input placeholder="请输入项目编号"/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                             <Form.Item {...layout} label="项目类型" name="projectType">
                                <AutoComplete
                                    popupClassName="请输入内容"
                                    placeholder="请选择项目类型"
                                    options={projectTypeList}
                                >
                                </AutoComplete>
                             </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={8}>
                            <Form.Item {...layout} label="项目周期" name="cycle">
                                <RangePicker format="YYYY/MM/DD" placeholder={['开始日期', '结束日期']} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item {...layout} label="所属部门" name="departmentIds">
                                <Cascader options={departmentOptions} placeholder="请选择" fieldNames={{label: 'name', value: 'id', children: 'childNode'}}></Cascader>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={24}>
                            <Form.Item labelCol={{span: 2}} wrapperCol={{span: 22}} label="项目描述" name="description">
                                <TextArea rows={3} placeholder="请输入项目描述"/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </>
    )
}))

export default BasicInfo