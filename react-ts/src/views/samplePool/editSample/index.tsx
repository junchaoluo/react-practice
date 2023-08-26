import { memo, PropsWithChildren, FC, useState, Fragment } from 'react';
import style from './index.module.scss'
import BasicInfo from '@/views/samplePool/editSample/components/basicInfo';
import DetectionInfo from '@/views/samplePool/editSample/components/detectionInfo';
import { Button } from 'antd'

const Template: FC<PropsWithChildren> = () => {
          return (
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
                    <Button type="primary">取消</Button>
                    <Button type="primary">确定</Button>
                </div>
            </div>
       )
}

export default memo(Template)