import React, { Component } from 'react';
import { Modal, Form, Button } from 'antd';
import { FormElement } from "@/library/antd";
import { add, edit } from "@/api/user"

@Form.create()
export default class UserEdit extends Component {
    constructor(...props) {
        super(...props);
    }

    state = {
        loading: false,
        data: {},
        loading: false,
    };

    componentDidMount() {
        // console.log('UserEdit.js componentDidMount');
        this.windowHeight = document.body.clientHeight;
    }

    componentDidUpdate(prevProps) {
        const { visible, user, form: { resetFields } } = this.props;

        // 打开弹框
        if (!prevProps.visible && visible) {
            // 重置表单，接下来填充新的数据
            resetFields();

            // 重新获取数据
            if (!user) {
                // 添加操作
                this.setState({ data: {} });
            } else {
                this.setState({ data: user })
            }
        }
    }

    handleOk = () => {
        const { loading } = this.state;
        if (loading) return;
        const { onOk, form: { validateFieldsAndScroll } } = this.props;

        validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { id } = values;
                const ajax = id ? edit(values) : add(values);

                this.setState({ loading: true });
                ajax.then((user) => {
                    if (onOk) onOk(user);
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
        // console.log('render UserEdit.jsx');
        const { visible } = this.props;
        const { loading, data } = this.state;
        const FormElement = this.FormElement;
        return (
            <Modal
                destroyOnClose
                width="40%"
                confirmLoading={loading}
                visible={visible}
                title={data.id ? '编辑用户' : '添加用户'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form style={{ width: 300 }} onSubmit={this.handleSubmit}>
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
                        label="年龄"
                        field="age"
                        min={0}
                        step={1}
                        decorator={{
                            initialValue: data.age,
                            rules: [
                                { required: true, message: '请输入年龄！' },
                            ],
                        }}
                    />
                    <FormElement
                        label="手机号"
                        field="mobile"
                        decorator={{
                            initialValue: data.mobile,
                            rules: [
                                { required: true, message: '请输入手机号码！' },
                            ],
                        }}
                    />
                </Form>
            </Modal>
        );
    }
}

