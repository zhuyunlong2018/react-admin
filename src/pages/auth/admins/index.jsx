import React, { Component } from 'react';
import { Table, Tag } from 'antd';
import PageContent from '@/layouts/page-content';
import {
    Pagination,
    Operator,
    ToolBar,
} from "@/library/antd";
import AdminEdit from "./AdminEdit"
import { hasPermission } from '@/commons';
import config from '@/commons/config-hoc';
import { getAdmins, del } from "@/api/admin"

@config({
    path: '/admins',
})
export default class AdminCenter extends Component {
    state = {
        dataSource: [],     // 表格数据
        total: 0,           // 分页中条数
        pageSize: 10,       // 分页每页显示条数
        pageNum: 1,         // 分页当前页
        params: {},         // 查询条件
        collapsed: true,    // 是否收起
        admin: void null,    //选中要编辑的用户
        visible: false,     //添加、编辑框显示隐藏
    };

    queryItems = [];

    columns = [
        { title: '用户名', dataIndex: 'name', key: 'name' },
        { title: '描述', dataIndex: 'description', key: 'description' },
        {
            title: '绑定角色', dataIndex: 'roles', key: 'roles',
            render: (value, record) => {
                const roles = value.map((element) =>
                    <Tag key={element.id + element.name} color="magenta">{element.name}</Tag>
                );
                return (<div>{roles}</div>);
            }
        },
        {
            title: '操作', dataIndex: 'operator', key: 'operator',
            render: (value, record) => {
                const { id, name } = record;
                const items = [
                    {
                        label: '编辑',
                        visible: hasPermission('admin:admins:edit'),
                        onClick: () => this.handleEdit(record),
                    },
                    {
                        label: '删除',
                        visible: hasPermission('admin:admins:edit'),
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${name}"?`,
                            onConfirm: () => this.handleDelete(id),
                        },
                    }
                ];
                return <Operator items={items} />
            },
        }
    ];

    componentDidMount() {
        this.fetchAdmins()
    }

    /**
     * 获取所有用户列表
     */
    fetchAdmins() {
        this.setState({ loading: true })
        const { params, pageNum, pageSize } = this.state;
        params.page = pageNum
        params.pageSize = pageSize
        getAdmins(params).then(admins => {
            this.setState({ dataSource: admins.data, total: admins.total });
        })
            .finally(() => this.setState({ loading: false }));
    }

    handleSearch() {
        this.fetchAdmins()
    }

    handleAdd = () => {
        this.setState({ admin: void null, visible: true });
    }

    handleEdit = (admin) => {
        if (!admin.selectRoles) {
            let data = { ...admin, selectRoles: [] }
            admin.roles.forEach(element => {
                data.selectRoles.push(element.id)
            });
            this.setState({ admin: data, visible: true });
        } else {
            this.setState({ admin, visible: true });
        }
    };

    handleDelete(id) {
        this.setState({ loading: true })
        del({ id }).then(() => {
            this.setState({
                dataSource: this.state.dataSource.filter(e => e.id !== id)
            })
        })
            .finally(() => {
                this.setState({ loading: false })
            })
    }

    onOke(admin) {
        if (this.state.admin) {
            let dataSource = [...this.state.dataSource]
            for (let index in dataSource) {
                if (dataSource[index].id === admin.id) {
                    dataSource[index] = admin
                }
            }
            this.setState({
                dataSource
            })
        } else {
            this.setState({
                dataSource: [...this.state.dataSource, admin]
            })
        }
        this.setState({ visible: false })
    }
    render() {
        const {
            total,
            pageNum,
            pageSize,
            dataSource,
            admin,
            visible
        } = this.state;
        return (
            <PageContent>
                <ToolBar
                    items={[{
                        type: 'primary',
                        text: '添加管理员',
                        icon: 'admin-add',
                        onClick: this.handleAdd,
                        visible: hasPermission('admin:admins:add'),
                    }]}
                />

                <Table
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                    pagination={false}
                />

                <Pagination
                    total={total}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    onPageNumChange={pageNum => this.setState({ pageNum }, this.handleSearch)}
                    onPageSizeChange={pageSize => this.setState({ pageSize, pageNum: 1 }, this.handleSearch)}
                />

                <AdminEdit
                    admin={admin}
                    visible={visible}
                    onOk={(admin) => this.onOke(admin)}
                    onCancel={() => this.setState({ visible: false })}
                />
            </PageContent>
        );
    }
}
