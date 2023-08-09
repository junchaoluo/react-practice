import { memo, PropsWithChildren, FC, useState, Fragment } from 'react';
import style from './index.module.scss'
import BasicInfo from '@/views/samplePool/editSample/components/basicInfo';
import detectionInfo from '@/views/samplePool/editSample/components/detectionInfo';

const Template: FC<PropsWithChildren> = () => {
          return (
        <div className={style.content}>
            <div className={style.basicForm}>
                <BasicInfo/>
            </div>
            <div className={style.detection}>
                <detectionInfo/>
            </div>
        </div>
       )
}

export default memo(Template)