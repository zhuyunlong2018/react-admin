import React, { Component } from 'react';
import { Modal, Form } from 'antd';
import { FormElement } from "@/library/antd";
import { add, edit } from "@/api/admin"
import { getRoles } from "@/api/role"

@Form.create()
export default class AdminEdit extends Component {

    state = {
        loading: false,
        data: {},
        roles: [],
    };

    componentDidMount() {
        this.windowHeight = document.body.clientHeight;
        this.getRoles()
    }

    /**
     * 从后台获取系统的角色列表
     */
    getRoles() {
        if(this.state.roles.length===0) {
            this.setState({ loading: true })
            getRoles().then(roles => {
                let data = [];
                roles.forEach(element => {
                    data.push({
                        label: element.name, value: element.id
                    })
                });
                this.setState({ roles: data })
            })
            .finally(() => { this.setState({ loading: false })})
        }
    }

    componentDidUpdate(prevProps) {
        const { visible, admin, form: { resetFields } } = this.props;

        // 打开弹框
        if (!prevProps.visible && visible) {
            // 重置表单，接下来填充新的数据
            resetFields();

            // 重新获取数据
            if (!admin) {
                // 添加操作
                this.setState({ data: {} });
            } else {
                this.setState({ data: admin })
            }
        }
    }

    handleOk = () => {
        const { loading } = this.state;
        if (loading) return;
        const { onOk, form: { validateFieldsAndScroll } } = this.props;

        validateFieldsAndScroll((err, values) => {
            console.log(values)
            if (!err) {
                const { id } = values;
                const ajax = id ? edit(values) : add(values);

                this.setState({ loading: true });
                ajax.then((admin) => {
                    if (onOk) onOk(admin);
                })
                    .finally(() => this.setState({ loading: false }))
            }
        });
    };

    handleCancel = () => {
        const { onCancel } = this.props;
        if (onCancel) onCancel();
    };

    FormElement = (props) => <FormElement form={this.props.form} labelWidth={100} {...props} />;

    render() {
        // console.log('render adminEdit.jsx');
        const { visible } = this.props;
        const { loading, data } = this.state;
        const FormElement = this.FormElement;

        function onChange(checkedValues) {
            console.log('checked = ', checkedValues);
        }
        return (
            <Modal
                destroyOnClose
                width="40%"
                confirmLoading={loading}
                visible={visible}
                title={data.id ? '编辑管理员' : '添加添加管理员'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form style={{ width: "90%" }} onSubmit={this.handleSubmit}>
                    {data.id ? <FormElement type="hidden" field="id" decorator={{ initialValue: data.id }} /> : null}
                    <FormElement
                        label="姓名"
                        field="name"
                        decorator={{
                            initialValue: data.name,
                            rules: [
                                { required: true, message: '请输入姓名！' },
                            ],
                        }}
                    />
                    <FormElement
                        label="描述"
                        field="description"
                        decorator={{
                            initialValue: data.description,
                            rules: [
                                { required: true, message: '请输入描述！' },
                            ],
                        }}
                    />
                    <FormElement
                        type="checkbox-group"
                        label="绑定角色"
                        field="selectRoles"
                        options={this.state.roles} onChange={onChange}
                        decorator={{
                            initialValue: data.selectRoles,
                            rules: [
                                { required: true, message: '请选择绑定角色！' },
                            ],
                        }}
                    />

                </Form>
            </Modal>
        );
    }
}

