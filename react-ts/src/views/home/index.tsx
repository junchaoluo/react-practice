import imgSrc from '../../assets/images/logined-exhibition.png'
import styles from './index.module.scss'
import { useSelector } from 'react-redux'
import user from '../../store/user/index'

export default () => {
    return (
        <div style={{height: '100%', padding: '16px'}}>
            <div style={{fontSize: '18px'}}>你好，欢迎使用E-Lab!</div>
            <img src={imgSrc} alt="" className={styles.bgImg} />
        </div>
    )
}