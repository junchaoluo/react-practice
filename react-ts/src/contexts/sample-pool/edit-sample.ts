import { createContext } from 'react'

export type SampleInfoContextProps = {
    form: object,
    detectionTable: Array<object>
}

const sampleInfoContext = createContext({
    form: {},
    detectionTable: []
} as SampleInfoContextProps)

export default sampleInfoContext