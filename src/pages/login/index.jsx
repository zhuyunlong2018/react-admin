import React, { Component } from 'react'
import { Helmet } from 'react-helmet';
import { Form, Icon, Input, Button } from 'antd';
import { setLoginUser } from '@/commons';
import config from '@/commons/config-hoc';
import { ROUTE_BASE_NAME } from '@/router/AppRouter';
import { login } from "@/api/admin"
import './style.less'

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@Form.create()
@config({
    path: '/login',
    ajax: true,
    noFrame: true,
    noAuth: true,
    keepAlive: false,
})
export default class Login extends Component {
    state = {
        loading: false,
        message: '',
    };

    componentDidMount() {
        const { form: { validateFields, setFieldsValue } } = this.props;
        // 一开始禁用提交按钮
        validateFields(() => void 0);

        // 开发时方便测试，填写表单
        if (process.env.NODE_ENV === 'development') {
            setFieldsValue({ userName: 'admin', password: '123456' });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true, message: '' });

                // TODO 发送请求进行登录，一下为前端硬编码，模拟请求
                login(values, { noEmpty: true, successTip: '请求成功！' })
                    .then(user => {
                        this.setState({ loading: false });
                        setLoginUser(user);
                        // 跳转页面，优先跳转上次登出页面
                        const lastHref = window.sessionStorage.getItem('last-href');

                        // 强制跳转 进入系统之后，需要一些初始化工作，需要所有的js重新加载
                        window.location.href = lastHref || `${ROUTE_BASE_NAME}/`;
                        this.props.history.push(lastHref || '/');
                    })
                    .finally(() => {
                        this.setState({ loading: false });
                    });
            }
        });
    };

    render() {
        const {
            getFieldDecorator,
            getFieldsError,
            getFieldError,
            isFieldTouched,
        } = this.props.form;
        const { loading, message } = this.state;

        // Only show error after a field is touched.
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <div styleName="root" className="login-bg">
                <Helmet title="登录" />
                <div styleName="logo" />
                <div styleName="note" />
                <div styleName="box">
                    <div styleName="header">登录</div>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item
                            validateStatus={userNameError ? 'error' : ''}
                            help={userNameError || ''}
                        >
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: "请输入用户名" }],
                            })(
                                <Input allowClear autoFocus prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
                            )}
                        </Form.Item>
                        <Form.Item
                            validateStatus={passwordError ? 'error' : ''}
                            help={passwordError || ''}
                        >
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: "请输入密码" }],
                            })(
                                <Input.Password prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="密码" />
                            )}
                        </Form.Item>
                        <Button
                            styleName="submit-btn"
                            loading={loading}
                            type="primary"
                            htmlType="submit"
                            disabled={hasErrors(getFieldsError())}
                        >
                            登录
                        </Button>
                    </Form>
                    <div styleName="error-tip">{message}</div>
                    <div styleName="tip">
                        <span>用户名：admin </span>
                        <span>密码：123456</span>
                    </div>
                </div>
            </div>
        );
    }
}

