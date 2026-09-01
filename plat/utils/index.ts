/*
 * @Description:
 * @Author: lidaxuan
 * @Date: 2026-09-01 16:54:01
 * @FilePath: plat/utils/index.ts
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-09-01 16:54:01
*/
// 判断是否跳转登录页

import {useSystemConfig} from "plat@/store/systemConfig.ts";

/**
 * 跳转 SSO 登录页（清除 token + 重定向）
 * 用于 401 等需要强制重新登录的场景
 * @param appConfig 应用配置
 */
export function redirectToLogin(appConfig: Record<string, any>): void {
    const systemConfig = useSystemConfig();
    systemConfig.clearUserData();

    let locationHref = window.location.href;
    if (!locationHref.includes("#")) {
        locationHref = locationHref + "/#/";
    }
    const urlParams = new URLSearchParams(appConfig);
    const redirectUri = window.envLoginUrl[window.__sso + 'LoginUrl'] + "?redirectUri=" + encodeURIComponent(locationHref) + "&" + urlParams;
    window.location.href = redirectUri;
}

/**
 * 检查登录状态，未登录则跳转 SSO
 * @param appConfig 应用配置
 * @param callback 已登录时执行的回调
 */
export function isGoToLogin(appConfig: Record<string, any>, callback: () => void): void {
    const systemConfig = useSystemConfig();
    const access_token = getQueryString("access_token");
    if (access_token) {
        systemConfig.setToken(access_token);
        callback();
        return;
    }
    if (systemConfig.token) {
        callback();
        return;
    }
    // 未登录，跳转 SSO（dev 模式下 redirectToLogin 内部会跳过重定向）
    // if (import.meta.env.DEV) {
    //     console.warn('[plat] dev 模式：跳过 SSO 登录重定向');
    //     callback();
    //     return;
    // }
    redirectToLogin(appConfig);
};

const redirectUrl = ()  => {

}

/**
 * 获取url全部查询参数（兼容hash模式 #/xxx?a=1&b=2）
 * @returns {Record<string, string>} 参数对象
 */
function getUrlParams(): Record<string, string> {
    const params: Record<string, string> = {}
    // hash模式： #/reportBuilderPage?access_token=xxx
    const hash = window.location.hash
    const questionIndex = hash.indexOf('?')
    if (questionIndex === -1) return params

    const queryStr = hash.slice(questionIndex + 1)
    const pairs = queryStr.split('&')

    for (const pair of pairs) {
        const [key, value] = pair.split('=')
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value ?? '')
        }
    }
    return params
}


function parseUrlParams(url: string): Record<string, string> {
    const paramsObj: Record<string, string> = {};
    (url.split('?')[1] || '').split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key) paramsObj[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
    return paramsObj;
}
/**
 * 获取问号? 前面的完整路径
 * @returns string 示例：http://localhost:5173/#/reportBuilderPage
 */
function getUrlPathBeforeQuestion(): string {
    const href = window.location.href
    const hashIndex = href.indexOf('#')

    // 拆分 base 和 hash 两部分
    const base = hashIndex === -1 ? href : href.slice(0, hashIndex)
    const hashPart = hashIndex === -1 ? '' : href.slice(hashIndex)

    // 分别去除 base 和 hash 中的 ? 及之后内容
    const baseQIdx = base.indexOf('?')
    const cleanBase = baseQIdx > -1 ? base.substring(0, baseQIdx) : base
    const hashQIdx = hashPart.indexOf('?')
    const cleanHash = hashQIdx > -1 ? hashPart.slice(0, hashQIdx) : hashPart

    return cleanBase + cleanHash
}

/**
 * 将 hex 颜色按比例混合
 * @param color1 第一个颜色 hex
 * @param color2 第二个颜色 hex
 * @param weight color1 的权重 (0-1)
 * @returns 混合后的 hex 颜色
 */
function mixColor(color1: string, color2: string, weight: number): string {
    const hex2rgb = (hex: string): [number, number, number] => {
        const h = hex.replace('#', '')
        return [
            parseInt(h.substring(0, 2), 16),
            parseInt(h.substring(2, 4), 16),
            parseInt(h.substring(4, 6), 16),
        ]
    }
    const [r1, g1, b1] = hex2rgb(color1)
    const [r2, g2, b2] = hex2rgb(color2)
    const w = Math.round(weight * 255)
    const r = Math.round((r1 * w + r2 * (255 - w)) / 255)
    const g = Math.round((g1 * w + g2 * (255 - w)) / 255)
    const b = Math.round((b1 * w + b2 * (255 - w)) / 255)
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

/**
 * 设置 Element Plus 主题色及其派生变量
 * Element Plus 的 hover/active/disabled 等状态使用 light-N / dark-N 派生变量
 * @param primary 主题色 hex，如 '#3585FB'
 */
export function setElementThemeColor(primary: string): void {
    const el = document.documentElement
    el.style.setProperty('--el-color-primary', primary)
    // light-N: mix(white, primary, N*10%) — 用于 hover / disabled / 背景等
    const lightLevels = [3, 5, 7, 8, 9] as const
    lightLevels.forEach(level => {
        const weight = level / 10
        el.style.setProperty(`--el-color-primary-light-${level}`, mixColor('#ffffff', primary, weight))
    })
    // dark-2: mix(black, primary, 20%) — 用于 active 状态
    el.style.setProperty('--el-color-primary-dark-2', mixColor('#000000', primary, 0.2))
}

//获取url指定参数值
export function getQueryString(param: string): string | null {
    const regex = new RegExp('[?&]' + param + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(window.location.href);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

class Utils {
    // 全局设置
    serRootStyle(root: string, val: string, style: string): void {
        const roots = document.querySelector(':' + root) as HTMLElement
        roots.style.setProperty(val, style)
    }

    // 锚点初始化
    goAnchorInit(): void {
        const layoutMain = document.getElementById('layout-main')
        if (layoutMain && layoutMain.scrollTop != null) layoutMain.scrollTop = 0
    }

    // 锚点
    goAnchor(selector: string): void {
        this.goAnchorInit()
        document.querySelector(selector)
    }

    // 唯一id
    guid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function (c) {
                const r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8
                return v.toString(16)
            },
        )
    }

    // js电话号码正则校验--座机和手机号
    checkTel(value: string): boolean {
        const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/
        const isMob =
            /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/
        if (isMob.test(value) || isPhone.test(value)) {
            return true
        } else {
            return false
        }
    }

    getModule(ks: string[], value: unknown, modules: Record<string, any> = {}, i: number = 0, len?: number): Record<string, any> {
        if (len === undefined) len = ks.length
        if (i < len) {
            if (i == len - 1) {
                modules[ks[len - 1]] = value
            } else {
                let m: Record<string, any> = {}
                if (modules[ks[i]] && modules[ks[i]]['modules']) {
                    m = modules[ks[i]]['modules']
                } else if (modules[ks[i]]) {
                    const pm = modules[ks[i]]
                    m = pm['modules']
                    pm['namespaced'] = true
                } else {
                    const pm = modules[ks[i]] || {}
                    modules[ks[i]] = pm
                    pm['modules'] = m
                    pm['namespaced'] = true
                }
                i++
                this.getModule(ks, value, m, i, len)
            }
        }
        return modules
    }

    // 判断icon后缀css、js
    addLinkArr(srcArr: string[], flag = true): void {
        const arr = srcArr
        arr.forEach((item) => {
            if (item.indexOf('.css') != -1) {
                this.addCssByLink(item)
            } else if (item.indexOf('.js') != -1) {
                this.addJsByScript(item, flag)
            }
        })
    }

    addCssByLink(url: string): void {
        const doc = document
        const link = doc.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('type', 'text/css')
        link.setAttribute('href', url)
        const heads = doc.getElementsByTagName('head')
        if (heads.length) heads[0].appendChild(link)
        else doc.documentElement.appendChild(link)
    }

    addJsByScript(url: string, flag = true): void {
        const s = document.createElement('script')
        s.src = url
        s.onerror = () => console.warn(`[plat] 资源加载失败: ${url}`)
        if (flag) {
            document.body.appendChild(s)
        } else {
            const heads = document.getElementsByTagName('head')
            if (heads.length) {
                heads[0].appendChild(s)
            }
        }
    }

    // 读取文件  正则后缀
    readFile(modulesFiles: Record<string, any>): Record<string, any> {
        const modules: Record<string, any> = {}
        modulesFiles.keys().map((name: string) => {
            const componentConfig = modulesFiles(name)
            const componentName = name
                .replace(/^\.\/_/, '')
                .replace(/\.\w+$/, '')
                .split('./')
                .join('')
            modules[componentName] = componentConfig.default || componentConfig
        })
        return modules
    }

    mergeExport(vueFiles: Record<string, any>): Record<string, any> {
        let obj: Record<string, any> = {}
        Object.values(this.readFile(vueFiles)).map((item: any) => {
            obj = { ...obj, ...item }
        })
        return obj
    }

    getMenuItem(menuTree: any[], menuCode: string, menuModules: string[] = []): { menuModules: string[]; menuItem: any } | undefined {
        if (!menuTree || menuTree.length === 0) {
            return
        }
        let result: any
        for (let i = 0; i < menuTree.length; i++) {
            const item = menuTree[i]
            if (item.code === menuCode) {
                menuModules.unshift(item.name)
                result = item.name
                break
            }
            const childrenItem = this.getMenuItem(item.children, menuCode, menuModules)
            if (childrenItem && childrenItem.menuItem) {
                menuModules.unshift(item.name)
                result = childrenItem.menuItem
                break
            }
        }
        return { menuModules, menuItem: result }
    }

    exportFile(name: string, res: BlobPart, suffix?: string): void {
        const str = moment(new Date()).format('YYYY-MM-DD HH:ss')
        const elink = document.createElement('a')
        elink.download = `${name}${str}${suffix || '.xlsx'}`
        elink.style.display = 'none'
        const blob = new Blob([res])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
    }

    // 获取不同项目的id
    getProductId(enums: any[], idArr: string[] = []): string[] {
        const srcNameList = idArr
        for (let i = 0; i < enums.length; i++) {
            if (enums[i].srcName) {
                if (!srcNameList.includes(enums[i].srcName)) {
                    srcNameList.push(enums[i].srcName)
                }
            }
            if (enums[i].children && enums[i].children.length) {
                this.getProductId(enums[i].children, srcNameList)
            }
        }
        return srcNameList
    }
}

export default new Utils();



