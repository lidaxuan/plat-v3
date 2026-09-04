import {useSystemConfig} from '../store/systemConfig'
import {platCreateService} from '../service/index'

// ==================== 类型声明 ====================

/** 原始菜单项（来自接口） */
interface RawMenuItem {
    id: number | string
    code: string
    productId: string
    name: string
    uri: string
    score: number
    iconUrl: string | null
    type: number
    children?: RawMenuItem[]
    srcName?: string
}

/** 格式化后的菜单项 */
interface FormattedMenuItem {
    id: string
    icon: string | null
    path?: string
    name: string
    code: string
    children: FormattedMenuItem[] | null
    disabled?: boolean
    srcName?: string
}

// ==================== 导出函数 ====================
export const loadMenus = async (platConfig: Record<string, any>): Promise<void> => {
    const systemConfig = useSystemConfig()
    let data: RawMenuItem[] = []

    if (platConfig.customerMenus && platConfig.customerMenus.length) {
        data = platConfig.customerMenus
    } else {
        let res: Record<string, any> = {}
        try {
            res = await platCreateService(platConfig.apiMap.userEnums, {appId: platConfig.appConfig.appId}, {}, platConfig.serviceConfig)
        } catch (error) {
            console.error(error)
            return
        }
        if (res.code) {
            console.error('[loadMenus] 接口返回错误:', res.msg)
            return;
        }
        data = [].concat(res.data || []);
    }
    if (!data.length) {
        return
    }
    const formatterMenu = platConfig.menuConfig?.formatterMenu || function (data: RawMenuItem[]) {return data}
    // 格式化菜单树「格式化数据格式，且仅筛选出菜单数据（不包含按钮）」
    const menuTree = formatterMenu(formatMenuTree(structuredClone(data)));
    const activeMenuCode = getFirstLeafCode(menuTree as FormattedMenuItem[]);


    // 格式化并缓存 认证编码集合「格式化和获取所有菜单（包含按钮）的编码」
    systemConfig.setMenusConfig('normalMenu', menuTree)
    systemConfig.setMenusConfig('authCodeArr', codeArrFormat(data))
    // 取菜单树第一个叶子节点的 code 作为默认激活菜单（与各处兜底逻辑统一）
    systemConfig.setMenusConfig('activeMenuCode', activeMenuCode);
}

// ==================== 内部函数 ====================

const codeArrFormat = (treeData: RawMenuItem[]): string[] => {
    let codes: string[] = []
    treeData.forEach((item) => {
        codes = [...codes, formatMenuCode(item.uri), ...codeArrFormat(item.children ?? [])]
    })
    return codes
}

// 格式化菜单code「从 user:manage 转换成 userManage」
const formatMenuCode = (code: string): string => {
    return code.split(':').map((item, index) => index > 0 ? item.slice(0, 1).toUpperCase() + item.slice(1) : item).join('')
}

// 取菜单树第一个叶子节点的 code（与 router/getFirstLeafCode、instance/fallbackFirstMenuCode 逻辑统一）
const getFirstLeafCode = (menuTree: FormattedMenuItem[]): string => {
    if (!menuTree || menuTree.length === 0) return ''
    const first = menuTree[0]
    if (!first.children || first.children.length === 0) {
        return first.code || ''
    }
    return getFirstLeafCode(first.children)
}

// 格式化菜单树「格式化数据格式，且仅筛选出菜单数据（不包含按钮）」
const formatMenuTree = (menuData: RawMenuItem[], parentItem?: RawMenuItem, ppid?: string | null): FormattedMenuItem[] | 2 => {
    if (!(menuData && menuData.length)) {
        return []
    }

    const result: FormattedMenuItem[] = []

    if (parentItem && !ppid) {
        result.push({
            id: parentItem.id + '-0',
            icon: parentItem.iconUrl,
            name: parentItem.name,
            code: formatMenuCode(parentItem.uri),
            disabled: true,
            srcName: parentItem.srcName,
        })
    }

    for (let i = 0; i < menuData.length; i++) {
        const item = menuData[i]
        // 不是菜单直接返回
        if (item.type !== 1 && item.type !== 10) {
            return 2
        }
        const childrenOrType = formatMenuTree(item.children, item, parentItem ? parentItem.id + '' : null)
        // 判断是否存在自己「菜单」
        const isChildren = item.children && item.children.length > 0 && childrenOrType !== 2
        // 格式化菜单code「从 user:manage 转换成 userManage」
        const code = formatMenuCode(item.uri)
        result.push({
            id: item.id + '',
            icon: item.iconUrl,
            path: '/' + code,
            name: item.name,
            code,
            children: isChildren ? childrenOrType : null,
            srcName: item.srcName,
        })
    }

    return result
}


export const loadUserInfo = async (platConfig: Record<string, any>): Promise<void> => {
    const systemConfig = useSystemConfig()
    let res: Record<string, any> = {}
    try {
        res = await platCreateService(platConfig.apiMap.userInfo, {appId: platConfig.appConfig.appId}, {}, platConfig.serviceConfig,)
    } catch (error) {
        console.error(error)
        return
    }
    if (res.code) {
        console.error('[loadUserInfo] 接口返回错误:', res.msg)
        return
    }
    systemConfig.setUserMsg(res.data || {})
}
