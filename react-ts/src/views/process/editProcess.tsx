/**
* @file  editProcess
* @date 2023-06-10
*/


import {memo, PropsWithChildren} from 'react';
import type { FC } from 'react';
import { useSearchParams } from 'react-router-dom'

const EditProcess: FC<PropsWithChildren> = (props) => {
    const [searchParams, setSearchParams] = useSearchParams()

    console.log(searchParams.get('type'))

    return <div>EditProcess</div>
};

export default memo(EditProcess);
