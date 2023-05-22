export interface UserInfo {
    id: string,
    admin: boolean,
    sysAdmin: boolean,
    token: string,
    account: string,
    avator: string | null,
    status: number,
    nickname: string,
    logintime: number,
    uuid: string,
    researchRooms: string | null,
    location: string,
    departmentList: Array<string>,
    departmentName: string,
    pwdExpirationTime: string,
    remindDay: number,
    hasReminded: boolean,
    name?: string
}

export type Department = {
    id: string,
    account: string,
    code: string,
    email: string,
    name: string,
    status: number
}

export type SearchUser = UserInfo &  {
    avatar: string | null,
    createTime: string,
    department: string,
    departments: Array<Department>,
    id: string,
    isHaveJob: number,
    location: string,
    login: boolean,
    parentName: string,
    realName: string,
    role: string,
    sex: string,
    status: number
}