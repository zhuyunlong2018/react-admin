import React, { Component } from 'react';
import { Table } from 'antd';
import PageContent from '@/layouts/page-content';
import { Operator, ToolBar } from "@/library/antd";
import config from '@/commons/config-hoc';
import RoleEdit from './RoleEdit';
import { getRoles, del } from '@/api/role'

@config({
    path: '/roles',
})
export default class RoleList extends Component {
    state = {
        role: void null,
        visible: false,
        dataSource: [],     // 表格数据
    };

    columns = [
        { title: '角色名称', dataIndex: 'name', key: 'name' },
        { title: '角色描述', dataIndex: 'description', key: 'description' },
        {
            title: '操作', dataIndex: 'operator', key: 'operator',
            render: (value, record) => {
                const { id, name } = record;
                const items = [
                    {
                        label: '编辑',
                        onClick: () => this.handleEdit(record),
                    },
                    {
                        label: '删除',
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
        this.fetchRoles()
    }

    /**
     * 获取角色列表
     */
    fetchRoles() {
        this.setState({ loading: true });
        getRoles()
            .then(roles => {
                this.setState({ dataSource: roles });
            })
            .finally(() => this.setState({ loading: false }));
    }


    handleAdd = () => {
        this.setState({ role: void null, visible: true });
    };

    handleDelete = (id) => {
        // TODO
        this.setState({ loading: true });
        del({ id }).then(() => {
            for (let index in this.state.dataSource) {
                if (this.state.dataSource[index].id === id) {
                    this.state.dataSource.splice(index, 1)
                }
            }
        })
            .finally(() => this.setState({ loading: false }));
    };

    handleEdit = (role) => {
        this.setState({ role, visible: true });
    };

    onOke(role) {
        if (this.state.role) {
            for (let index in this.state.dataSource) {
                if (this.state.dataSource[index].id === role.id) {
                    this.state.dataSource[index] = role
                }
            }
        } else {
            this.state.dataSource.push(role)
        }

        this.setState({ visible: false })
    }

    render() {
        const {
            dataSource,
            visible,
            role,
        } = this.state;
        return (
            <PageContent>
                <ToolBar
                    items={[
                        { type: 'primary', text: '添加角色', icon: 'plus', onClick: this.handleAdd }
                    ]}
                />

                <Table
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                    pagination={false}
                />
                <RoleEdit
                    role={role}
                    visible={visible}
                    onOk={(role) => this.onOke(role)}
                    onCancel={() => this.setState({ visible: false })}
                />
            </PageContent>
        );
    }
}
