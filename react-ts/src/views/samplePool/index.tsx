import { memo, PropsWithChildren, FC } from 'react';
import { Form, Button } from 'antd'

const SamplePool: FC<PropsWithChildren> = () => {
       return (
              <div className={style.content}></div>
       )
}

export default memo(SamplePool)