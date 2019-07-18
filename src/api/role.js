import { sxAjax } from "@/commons/ajax"

//获取角色列表
export const getRoles = params => sxAjax.get("admin/roles/getRoles", params)

//添加角色
export const add = params => sxAjax.post("admin/roles/add", params)

//编辑角色
export const edit = params => sxAjax.put("admin/roles/edit", params)

//删除角色
export const del = params => sxAjax.del("admin/roles/del", params)