import { SearchUser, Department } from '@/types/user'

export type SelectProps = SearchUser & Department & {
    isUser?: boolean,
    checked?: boolean
}

export type DepartmentProps = Department