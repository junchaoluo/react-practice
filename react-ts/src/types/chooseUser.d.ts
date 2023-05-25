import { SearchUser, Department } from '@/types/user'

export type DepartmentProps = Department & {
    isUser?: boolean,
    checked?: boolean
}

export type SearchUserProps = SearchUser & {
    isUser?: boolean,
    checked?: boolean
}

export type SelectProps = SearchUserProps | DepartmentProps
