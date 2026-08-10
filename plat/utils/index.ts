// 判断是否跳转登录页
// import EWebPlat from "plat@";

import {useSystemConfig} from "plat@/store/systemConfig.ts";

export function isGoToLogin(appConfig, callback) {
    const systemConfig = useSystemConfig();
    const access_token = getQueryString("access_token");
    if (access_token) {
        systemConfig.setToken(access_token);
        // const newUrl = getUrlPathBeforeQuestion();
        // 替换历史记录，不刷新页面，不会新增历史回退记录
        callback();
        // history.replaceState(null, '', newUrl);
        return;
    }
    if (systemConfig.token) {
        callback();
        return;
    }
    // entrySystem(routePath, next, query) {
    //   if (!routePath) {
    //     routePath = "/" + this.getFirstPermission();
    //   }
    //   window.history.pushState(null, null, this.getPath() + "/#" + routePath);
    //   delete query.access_token;
    //   delete query.refresh_token;
    //   next({ path: routePath, query: query });
    // }
    // return;
    // 清空缓存
    let locationHref = window.location.href;
    if (!locationHref.includes("#")) {
        locationHref = locationHref + "/#/";
    }
    const urlParams = new URLSearchParams(appConfig);
    const redirectUri = window.envLoginUrl[window.__sso + 'LoginUrl'] + "?redirectUri=" + encodeURIComponent(locationHref) + "&" + urlParams;
    window.location.href = redirectUri;
};

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


function parseUrlParams(url) {
    const paramsObj = {};
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

//获取url指定参数值
export function getQueryString(param) {
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
    serRootStyle(root, val, style) {
        let roots = document.querySelector(":" + root);
        return roots.style.setProperty(val, style);
    }

    // 锚点初始化
    goAnchorInit() {
        var layoutMain = document.getElementById("layout-main");
        if (layoutMain.scrollTop != null) layoutMain.scrollTop = 0;
    }

    // 锚点
    goAnchor(selector) {
        this.goAnchorInit();
        var anchor = document.querySelector(selector);
        // anchor.scrollIntoView({
        //   block: "end",
        //   behavior: "smooth",
        // });
    }

    // 唯一id
    guid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c == "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            }
        );
    }

    // js电话号码正则校验--座机和手机号
    // 移动 134(1349除外）135 136 137 138 139
    // 联通： 130 131 132 155 156 185 186  145
    // 电信：133 153 177 180 181 189
    // 固话 400-1001-1111： /^([0-9]{3,4}-)?[0-9]{3,4}-[0-9]{3,4}$/
    // 固话 0379-10011111：/^([0-9]{3,4}-)?[0-9]{7,8}$/
    checkTel(value) {
        var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        var isMob =
            /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
        if (isMob.test(value) || isPhone.test(value)) {
            return true;
        } else {
            return false;
        }
    }

    getModule(ks, value, modules, i, len) {
        modules = modules || {};
        if (i < len) {
            if (i == len - 1) {
                // 最后一层，赋值
                modules[ks[len - 1]] = value;
            } else {
                let m = {};
                // 在父级模块，是否存在对象
                if (modules[ks[i]] && modules[ks[i]]["modules"]) {
                    m = modules[ks[i]]["modules"];
                } else if (modules[ks[i]]) {
                    let pm = modules[ks[i]];
                    m = pm["modules"];
                    pm["namespaced"] = true;
                } else {
                    let pm = modules[ks[i]] || {};
                    modules[ks[i]] = pm;
                    pm["modules"] = m;
                    pm["namespaced"] = true;
                }

                i++;

                this.getModule(ks, value, m, i, len);
            }
        }
        return modules;
    }

    // 判断icon后缀css、js
    addLinkArr(srcArr, flag = true) {
        let arr = srcArr;
        arr.forEach((item) => {
            if (item.indexOf(".css") != -1) {
                this.addCssByLink(item);
            } else if (item.indexOf(".js") != -1) {
                this.addJsByScript(item, flag);
            }
        });
    }

    addCssByLink(url) {
        var doc = document;
        var link = doc.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", url);
        var heads = doc.getElementsByTagName("head");
        if (heads.length) heads[0].appendChild(link);
        else doc.documentElement.appendChild(link);
    }

    addJsByScript(url, flag = true) {
        const s = document.createElement("script");
        s.src = url;
        if (flag) {
            document.body.appendChild(s);
        } else {
            var heads = document.getElementsByTagName('head');
            if (heads.length) {
                heads[0].appendChild(s);
            }
        }
    }

    // 读取文件  正则后缀
    readFile(modulesFiles) {
        const modules = {};
        modulesFiles.keys().map((name) => {
            // 获取文件配置
            const componentConfig = modulesFiles(name);
            // 将被注册的组件名字,对获取的文件名进行处理
            const componentName = name
                .replace(/^\.\/_/, "")
                .replace(/\.\w+$/, "")
                .split("./")
                .join("");
            modules[componentName] = componentConfig.default || componentConfig;
        });
        return modules;
    }

    mergeExport(vueFiles) {
        let obj = {};
        Object.values(this.readFile(vueFiles)).map((item) => {
            obj = {...obj, ...item};
        });
        return obj;
    }

    getMenuItem(menuTree, menuCode, menuModules) {
        if (!menuTree || menuTree.length === 0) {
            return;
        }
        let result;
        for (let i = 0; i < menuTree.length; i++) {
            const item = menuTree[i];
            if (item.code === menuCode) {
                menuModules.unshift(item.name);
                result = item.name;
                break;
            }
            const childrenItem = this.getMenuItem(item.children, menuCode, menuModules);
            if (childrenItem && childrenItem.menuItem) {
                menuModules.unshift(item.name);
                result = childrenItem.menuItem;
                break;
            }
        }
        return {menuModules, menuItem: result};
    }

    exportFile(name, res, suffix) {
        let str = moment(new Date()).format("YYYY-MM-DD HH:ss");
        // 处理下载
        let elink = document.createElement("a");
        elink.download = `${name}${str}${suffix || '.xlsx'}`;
        elink.style.display = "none";
        let blob = new Blob([res]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
    }

    // 获取不同项目的id
    getProductId(enums, idArr = []) {
        let srcNameList = idArr;
        for (let i = 0; i < enums.length; i++) {
            // 如果是本项目的  不管
            // if (appId != enums[i].productId) {
            //   //  如果不存在在往数组里面添加
            //   if (!srcNameList.includes(enums[i].productId)) {
            //     srcNameList.push(enums[i].productId);
            //   }
            // }
            if (enums[i].srcName) {
                if (!srcNameList.includes(enums[i].srcName)) {
                    srcNameList.push(enums[i].srcName);
                }
            }
            if (enums[i].children && enums[i].children.length) {
                this.getProductId(enums[i].children, srcNameList);
            }
        }
        return srcNameList;
    }
}

export default new Utils();



