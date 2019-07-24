# React Admin
基于[React](https://reactjs.org)、[Ant Design](https://ant.design/)的管理系统架构。

感谢开源社区，感谢Ant Design团队提供优秀的开源项目！
## 项目说明
本项目fork自

[react-admin]: https://github.com/sxfad/react-admin



在此基础上的修改：

1. mock数据修改为后端

   [laravel]: https://gitee.com/zhuyunlong2018/ReactAdmin-Laravel

   提供。

2. 权限交由后端控制，后端根据权限提供前端路由。

3. 整合axios请求到api目录。

4. 关闭development时脚本监听文件变化重新生成路由文件（因为开发状态下经常修改文件导致找不到路由，还未解决bug）。

5. 菜单路由为后端提供，国际化功能未整合完成。



以下为react-admin项目readme:


## 文档地址
最新文档[在这里](https://open.vbill.cn/react-admin)

## 项目预览
预览地址[在这里](https://open.vbill.cn/react-admin-live/)

注：由于是存静态发布，所有涉及到ajax请求的功能都会报404错误，属于正常现象。

## 项目截图
这里只提供了部分页面截图，根据文档[快速开始](https://open.vbill.cn/react-admin/START.html)进行项目的搭建，浏览项目丰富功能！

<table>
    <tr>
        <td><img src="docs/imgs/login.jpg" alt="登录"/></td>
        <td><img src="docs/imgs/home.jpg" alt="首页"/></td>
    </tr>
    <tr>
        <td><img src="docs/imgs/users.jpg" alt="用户"/></td>
        <td><img src="docs/imgs/menu.jpg" alt="菜单&权限"/></td>
    </tr>
    <tr>
        <td><img src="docs/imgs/401.jpg" alt="未登录"/></td>
        <td><img src="docs/imgs/404.jpg" alt="页面不存在"/></td>
    </tr>
</table>

## License

React Admin is licensed under the [Apache License](https://github.com/sxfad/react-admin/blob/master/LICENSE)
