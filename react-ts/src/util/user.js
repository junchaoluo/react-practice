export function getUserDept(user) {
    if (!user || !user.departments || user.departments.length === 0) return ''
    let result = []
    user.departments.map(d => {
      result.push(d.name?d.name:d.deptName)
    })
    return result.join(' / ')
}