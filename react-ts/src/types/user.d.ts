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
    hasReminded: boolean
}