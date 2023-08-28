import { memo, PropsWithChildren, FC, useState, Fragment } from 'react';
import style from './index.module.scss'
import BasicInfo from '@/views/samplePool/editSample/components/basicInfo';
import DetectionInfo from '@/views/samplePool/editSample/components/detectionInfo';
import { Button, Checkbox } from 'antd'
import { AlertOutlined } from '@ant-design/icons'
import sampleInfoContext from '@/contexts/sample-pool/edit-sample'
import { SampleInfoContextProps } from '@/contexts/sample-pool/edit-sample'

const Template: FC<PropsWithChildren> = () => {
    const [sample, setSample] = useState<SampleInfoContextProps>({
        form: {},
        detectionTable: []
    })

          return (
            <sampleInfoContext.Provider value={sample}>
                <div className={style.container}>
                    <div className={style.content}>
                        <div className={style.basicForm}>
                            <BasicInfo/>
                        </div>
                        <div className={style.detection}>
                            <DetectionInfo/>
                        </div>
                    </div>
                    <div className={style.footer}>
                        <div>
                            <Checkbox>打印单据</Checkbox>
                            <Checkbox>
                            <AlertOutlined className='mr4' />
                                加急</Checkbox>
                        </div>
                        <div>
                            <Button className='mr8'>取消</Button>
                            <Button type="primary">确定</Button>
                        </div>
                    </div>
                </div>
            </sampleInfoContext.Provider>
       )
}

export default memo(Template)