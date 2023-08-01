import axios from 'axios';
import {getTokenAUTH} from '@/utils/auth';
import {ElMessage} from "element-plus";
function myAxios(axiosConfig: any, customOptions: any) {
    const service = axios.create({
        baseURL: 'http://localhost:8080', // 设置统一的请求前缀
        timeout: 10000, // 设置统一的超时时长
    });

    // 自定义配置
    let custom_options = Object.assign({
        repeat_request_cancel: false, // 是否开启取消重复请求, 默认为 false
        error_message_show: true, // 是否开启接口错误信息展示，默认为true
    }, customOptions);

    //请求数据处理
    service.interceptors.request.use(
        config => {
            removePending(config);
            custom_options.repeat_request_cancel && addPending(config);
            if (getTokenAUTH() && typeof window !== "undefined") {
                // 设置请求头
                // config.headers['token'] = getTokenAUTH();
                let token = getTokenAUTH();
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            // return Promise.reject(error)；
            // httpErrorStatusHandle(error);
            custom_options.error_message_show && httpErrorStatusHandle(error);  // 处理错误状态码

            return Promise.reject(error); // 错误继续返回给到具体页面

        }
    );



    //返回数据处理
    service.interceptors.response.use(
        response => {
            removePending(response.config);
            let res = response.data;
            // 如果是返回的文件
            if (response.config.responseType === 'blob') {
                return response
            }
            // 兼容服务端返回的字符串数据
            if (typeof res === 'string') {
                res = res ? JSON.parse(res) : res;
                response.data = res;
            }
            return response;
        },
        error => {
            error.config && removePending(error.config);
            const elmes = custom_options.error_message_show && httpErrorStatusHandle(error);  // 处理错误状态码
            // return Promise.reject(error);
            ElMessage({message:elmes,type:"error"})
            return Promise.reject(error)
        }
    )
    return service(axiosConfig)
}

const pendingMap = new Map();

/**
 * 生成每个请求唯一的键
 * @param {*} config
 * @returns string
 */
function getPendingKey(config: any) {
    let {url, method, params, data} = config;
    // if(typeof data === 'string') data = JSON.parse(data); // response里面返回的config.data是个字符串对象
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
}

/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param {*} config
 */
function addPending(config: any) {
    const pendingKey = getPendingKey(config);
    config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
        if (!pendingMap.has(pendingKey)) {
            pendingMap.set(pendingKey, cancel);
        }
    });
}

/**
 * 删除重复的请求
 * @param {*} config
 */
function removePending(config: any) {
    const pendingKey = getPendingKey(config);
    if (pendingMap.has(pendingKey)) {
        const cancelToken = pendingMap.get(pendingKey);
        cancelToken(pendingKey);
        pendingMap.delete(pendingKey);
    }
}

/**
 * 处理异常
 * @param {*} error
 */
function httpErrorStatusHandle(error: any) {
    // 处理被取消的请求
    if (axios.isCancel(error)) return console.error('请求的重复请求：' + error.message);
    let message = '';
    if (error && error.response) {
        switch (error.response.status) {
            case 302:
                message = '接口重定向了！';
                break;
            case 400:
                message = '参数不正确！';
                break;
            case 401:
                message = '您未登录，或者登录已经超时，请先登录！';
                window.location.href = '/login';
                break;
            case 403:
                message = '您没有权限操作！';
                break;
            case 404:
                message = `请求地址出错: ${error.response.config.url}`;
                break; // 在正确域名下
            case 408:
                message = '请求超时！';
                break;
            case 409:
                message = '系统已存在相同数据！';
                break;
            case 500:
                message = '服务器内部错误！';
                break;
            case 501:
                message = '服务未实现！';
                break;
            case 502:
                message = '网关错误！';
                break;
            case 503:
                message = '服务不可用！';
                break;
            case 504:
                message = '服务暂时无法访问，请稍后再试！';
                break;
            case 505:
                message = 'HTTP版本不受支持！';
                break;
            default:
                message = '异常问题，请联系管理员！';
                break
        }
    }
    if (error.message.includes('timeout')) message = '网络请求超时！';
    if (error.message.includes('Network')) message = window.navigator.onLine ? '服务端异常！' : '您断网了！';

    // const ElMessage = ({
    //     message
    // })
   return message
}

export default myAxios;