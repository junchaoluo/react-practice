import style from './index.module.scss'
import { Card, Form, Row, Col,  Select, Input, AutoComplete, DatePicker, Cascader } from 'antd'
import { ForwardedRef, useEffect, useState, useImperativeHandle } from 'react'
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

type BasicFormProps = {
    id: string,
    name: string,
    code: string,
    productId: string,
    productCode: string,
    departmentId: string,
    departmentName: string,
    startTime: string,
    endTime: string,
    description: string,
    projectType: string
}

const BasicInfo = memo(forwardRef((props: IProps, ref: ForwardedRef) => {
    useImperativeHandle(ref, () => ({
        basicForm: basicForm,
        form
    }))

    const projectTypeList: Array<{
        value: string
    }> = [
        { value: 'B类' },
        { value: 'A类' },
        { value: '自主立项' },
        { value: 'FTE类' },
        { value: 'C类' }
    ] // 项目类型
    const [productOptions, setProductOptions] = useState<Array<{
        pdNo: string,
        id: string
    }>>([]) // 产品数据
    const [loadMoreProductPageNum, setLoadMoreProductPageNum] = useState(1) // 下拉产品数据
    const [departmentOptions, setDepartmentOptions] = useState([]) // 部门
    
    const[form] = Form.useForm()
    const [basicForm, setBasicForm] = useState<BasicFormProps>({
        id: '',
        name: '',
        code: '',
        productId: '',
        productCode: '',
        departmentId: '',
        departmentName: '',
        startTime: '',
        endTime: '',
        description: '',
        projectType: ''
    })
    const [initialValues, setInitialValues] = useState({
        departmentId: []
    })

    // 进入页面进行渲染
    useEffect(() => {
        // 查询下拉框数据 产品下拉框、部门下拉框
        getProductList(true)
        getDepartmentOptions()
    }, [])

    useEffect(() => {
        // 默认的部门
        const departmentId: string[] = Array.from(props.projectInfo.departments, item => item.id)
        const departmentName: string = props.projectInfo.departments.map(item => item.name)[props.projectInfo.departments.length - 1]
        setInitialValues(Object.assign({}, initialValues, {
            departmentId: departmentId
        }))
        form.setFieldValue('departmentId', departmentId)
        setBasicForm({...basicForm, departmentName: departmentName, departmentId: departmentId[departmentId.length - 1]})
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

    // 有值改变
    const onValuesChange = (changedValues, allValues) => {
        const fields = Object.keys(changedValues)?Object.keys(changedValues)[0]:''
        if(fields) {
            switch(fields) {
                case 'productId':
                    {
                        const product: Array<{
                            pdNo: string,
                            id: string
                        }> = productOptions.filter((item: {
                            pdNo: string,
                            id: string
                        }) => item.id === changedValues[fields])
                        if(product && product.length > 0){
                            setBasicForm({...basicForm, productCode: product[0].pdNo})
                        }
                    }
                    break;
                default: break;
            }
        }
    }

    const changeDepartmentIds = useCallback((value: Array<string>, selectedOptions) => {
        setBasicForm({
            ...basicForm, 
            departmentName: selectedOptions.map(item => item.name)[selectedOptions.length - 1],
            departmentId: value[value.length - 1]
        })
    }, [basicForm])

    return (
        <>
            <Card title="基础信息" size="small">
                <Form form={form} initialValues={initialValues} onValuesChange={onValuesChange}>
                    <Row gutter={20}>
                        <Col span={8}>
                            <Form.Item {...layout} label="产品号" name="productId" rules={[{ required: true,message: '请选择产品号' }]}>
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
                            <Form.Item {...layout} label="项目编号" name="code" rules={[{ required: true,message: '请选择项目编号' }]}>
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
                            <Form.Item {...layout} label="项目周期" name="cycle" rules={[{ required: true,message: '请选择项目周期' }]}>
                                <RangePicker format="YYYY-MM-DD" placeholder={['开始日期', '结束日期']} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item {...layout} label="所属部门" name="departmentId">
                                <Cascader onChange={changeDepartmentIds} options={departmentOptions} placeholder="请选择" fieldNames={{label: 'name', value: 'id', children: 'childNode'}}></Cascader>
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