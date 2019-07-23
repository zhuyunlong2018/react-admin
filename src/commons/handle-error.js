import {notification} from 'antd';
import {getCurrentLocal} from '@/i18n';
import {toLogin} from './index';

/**
 * 尝试获取错误信息 errorTio > resData.message > error.message > '未知系统错误'
 *
 * @param error
 * @param errorTip
 * @returns {*}
 */
function getErrorTip({error, errorTip}) {
    const ajaxTip = getCurrentLocal()?.ajaxTip || {};
    if (errorTip && errorTip !== true) return errorTip;

    if (error && error.response) {
        const {status, data} = error.response;

        if (data.code === 4002) { // 需要登录
            return toLogin();
        }

        // 后端自定义信息
        if (data.msg) return data.msg;

        if (status === 403) {
            return ajaxTip.noAccess;
        }

        if (status === 404) {
            return ajaxTip.notFound;
        }

        if (status === 504) {
            return ajaxTip.serverBusy;
        }

        if (status === 500) {
            return ajaxTip.serverBusy;
        }
    }

    if (error && error.message && error.message.startsWith('timeout of')) return ajaxTip.timeOut;

    if (error) return error.message;

    return ajaxTip.serverBusy;
}

export default function handleError({error, errorTip}) {
    const ajaxTip = getCurrentLocal()?.ajaxTip || {};

    if (errorTip === false) return;

    const description = getErrorTip({error, errorTip});
    console.log(ajaxTip.error)
    console.log(description)
    notification.error({
        message: ajaxTip.error,
        description,
    });
}
