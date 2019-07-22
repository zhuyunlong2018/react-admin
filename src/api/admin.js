import { sxAjax } from "@/commons/ajax"

//管理员登录
export const login = (params, options) => sxAjax.post("admin/login", params, options)

//获取管理员列表，有分页参数
export const getAdmins = params => sxAjax.get("admin/admins/getAdmins", params)

//添加一名管理员
export const add = params => sxAjax.post("admin/admins/add", params)

//编辑一名管理员
export const edit = params => sxAjax.put("admin/admins/edit", params)

//删除一名管理员
export const del = params => sxAjax.del("admin/admins/del", params)
