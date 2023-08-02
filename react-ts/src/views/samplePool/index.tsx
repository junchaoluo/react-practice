import { memo, PropsWithChildren, FC, useCallback } from 'react';
import { Form, Button } from 'antd'
import style from './index.module.scss'
import { useNavigate } from 'react-router-dom'

const SamplePool: FC<PropsWithChildren> = () => {
       const navigate = useNavigate()
       const addSample = () => {
              navigate('/sample-pool/edit-sample')
       }

       return (
              <div className={style.content}>
                     <Button type="primary" onClick={addSample}>新增送样</Button>
              </div>
       )
}

export default memo(SamplePool)