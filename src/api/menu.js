import { sxAjax } from "@/commons/ajax"

//获取后台系统菜单
export const getMenus = params => sxAjax.get("admin/menus/getMenus", params)

//添加菜单
export const add = params => sxAjax.post("admin/menus/add", params)

//编辑菜单
export const edit = params => sxAjax.put("admin/menus/edit", params)