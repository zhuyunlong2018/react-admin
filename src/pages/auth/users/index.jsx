import React, { Component } from 'react';
import { Button, Table } from 'antd';
import PageContent from '@/layouts/page-content';
import FixBottom from '@/layouts/fix-bottom';
import {
    QueryBar,
    QueryItem,
    Pagination,
    Operator,
    ToolBar,
} from "@/library/antd";
import UserEdit from "./UserEdit"
import config from '@/commons/config-hoc';
import { getUsers, del } from "@/api/user"

@config({
    path: '/users',
})
export default class UserCenter extends Component {
    state = {
        dataSource: [],     // 表格数据
        total: 0,           // 分页中条数
        pageSize: 10,       // 分页每页显示条数
        pageNum: 1,         // 分页当前页
        params: {},         // 查询条件
        jobs: [],           // 工作下拉数据
        positions: [],      // 职位下拉数据
        collapsed: true,    // 是否收起
        user: void null,    //选中要编辑的用户
        visible: false,     //添加、编辑框显示隐藏
    };

    queryItems = [
        [
            {
                type: 'select',
                field: 'position',
                label: '职位',
                placeholder: '请选择职位',
                itemStyle: { flex: '0 0 200px' }, // 固定宽度
            },
            {
                type: 'select',
                field: 'job',
                label: '工作',
                placeholder: '请选择工作',
                itemStyle: { flex: '0 0 200px' }, // 固定宽度
            },
        ],
        [
            {
                collapsedShow: true, // 收起时显示
                type: 'input',
                field: 'name',
                label: '用户名',
                placeholder: '请输入用户名',
                itemStyle: { flex: '0 0 200px' }, // 固定宽度
            },
            {
                collapsedShow: true,
                type: 'number',
                field: 'age',
                label: '年龄',
                min: 0,
                max: 150,
                step: 1,
                placeholder: '请输入年龄',
                itemStyle: { flex: '0 0 200px' }, // 固定宽度
            },
        ],
    ];

    columns = [
        { title: '用户名', dataIndex: 'name', key: 'name' },
        { title: '年龄', dataIndex: 'age', key: 'age' },
        {
            title: '工作', dataIndex: 'job', key: 'job',
            render: (value) => {
                const job = this.state.jobs.find(item => item.value === value);
                return job ? job.label : '';
            }
        },
        {
            title: '职位', dataIndex: 'position', key: 'position',
            render: (value) => {
                const position = this.state.positions.find(item => item.value === value);
                return position ? position.label : '';
            }
        },
        {
            title: '操作', dataIndex: 'operator', key: 'operator',
            render: (value, record) => {
                const { id, name } = record;
                const items = [
                    {
                        label: '编辑',
                        // onClick: () => this.props.history.push(`/users/_/UserEdit/${id}?name=${name}`),
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
        this.fetchUsers()
    }

    /**
     * 获取所有用户列表
     */
    fetchUsers() {
        this.setState({ loading: true })
        const { params, pageNum, pageSize } = this.state;
        params.page = pageNum
        params.pageSize = pageSize
        getUsers(params).then(users => {
            this.setState({ dataSource: users.data, total: users.total });
        })
            .finally(() => this.setState({ loading: false }));
    }

    fetchOptions = () => {
        const jobs = [
            { value: '11', label: '产品经理' },
            { value: '22', label: '测试专员' },
            { value: '33', label: '前端开发' },
            { value: '44', label: '后端开发' },
        ];

        const positions = [
            { value: '11', label: 'CEO' },
            { value: '22', label: 'CFO' },
            { value: '33', label: 'CTO' },
            { value: '44', label: 'COO' },
        ];

        this.setState({ jobs, positions });

        return Promise.resolve({ job: jobs, position: positions })
    };

    handleSearch() {
        this.fetchUsers()
    }

    handleAdd = () => {
        // this.props.history.push('/users/_/UserEdit/:id');
        this.setState({ user: void null, visible: true });
    }

    handleEdit = (user) => {
        this.setState({ user, visible: true });
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

    onOke(user) {
        if (this.state.user) {
            let dataSource = [ ...this.state.dataSource ]
            for (let index in dataSource) {
                if (dataSource[index].id === user.id) {
                    dataSource[index] = user
                }
            }
            this.setState({
                dataSource
            })
        } else {
            this.setState({
                dataSource: [...this.state.dataSource, user]
            })
        }
        this.setState({ visible: false })
    }

    render() {
        const {
            total,
            pageNum,
            pageSize,
            collapsed,
            dataSource,
            user,
            visible
        } = this.state;
        return (
            <PageContent>
                <QueryBar
                    showCollapsed
                    collapsed={collapsed}
                    onCollapsedChange={collapsed => this.setState({ collapsed })}
                >
                    <QueryItem
                        collapsed={collapsed}
                        loadOptions={this.fetchOptions}
                        items={this.queryItems}
                        onSubmit={params => this.setState({ params }, this.handleSearch)}
                    // extra={<Button type="primary" icon="user-add" onClick={this.handleAdd}>添加用户</Button>}
                    />
                </QueryBar>

                <ToolBar
                    items={[
                        { type: 'primary', text: '添加用户', icon: 'user-add', onClick: this.handleAdd }
                    ]}
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

                <FixBottom>
                    <Button>导出当前页</Button>
                    <Button type="primary">导出所有</Button>
                </FixBottom>

                <UserEdit
                    user={user}
                    visible={visible}
                    onOk={(user) => this.onOke(user)}
                    onCancel={() => this.setState({ visible: false })}
                />
            </PageContent>
        );
    }
}
