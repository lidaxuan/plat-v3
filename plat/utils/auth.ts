import {useSystemConfig} from '../store/systemConfig'
import {platCreateService} from '../service/index'

export const loadMenus = async (platConfig: Record<string, any>) => {
    const systemConfig = useSystemConfig()
    let data: any[] = []

    if (!platConfig.customerMenus && platConfig.customerMenus?.length) {
        data = platConfig.customerMenus
    } else {
        let res: any = {}
        try {
            res = await platCreateService(
                platConfig.apiMap.userEnums,
                {appId: platConfig.appConfig.appId},
                {},
                platConfig.serviceConfig,
            )
        } catch (error) {
            console.error(error)
            return
        }
        if (res.code) {
            (this as any).$message.error(res.msg);
            return;
        }
        const formatterMenu =
            platConfig.menuConfig?.formatterMenu || function (data: any) {
                return data
            }
        data = [].concat(formatterMenu([].concat(res.data || [])) || [])
    }

    if (!data.length) {
        return
    }

    // 格式化菜单树「格式化数据格式，且仅筛选出菜单数据（不包含按钮）」
    const menuTree = formatMenuTree(structuredClone(data)).map((item: any, index: number) => {
        item.countId = index.toString()
        return item
    });

    // 格式化并缓存 认证编码集合「格式化和获取所有菜单（包含按钮）的编码」
    systemConfig.setMenusConfig('authCodeArr', codeArrFormat(data))
    systemConfig.setMenusConfig('leftMenus', menuTree)

    // 取第一个菜单，递归找到最后一个子级的 code 作为默认激活菜单
    const activeMenuCode = getLastChildCode(menuTree);
    systemConfig.setMenusConfig('activeMenuCode', activeMenuCode);
}

const codeArrFormat = (treeData: any[]): string[] => {
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

// 取第一个菜单，递归找到最后一个子级的 code
const getLastChildCode = (menuTree: any[]): string => {
    if (!menuTree || menuTree.length === 0) return ''
    const first = menuTree[0]
    if (!first.children || first.children.length === 0) {
        return first.code || ''
    }
    return getLastChildCode(first.children)
}

// 格式化菜单树「格式化数据格式，且仅筛选出菜单数据（不包含按钮）」
const formatMenuTree = (menuData: any[], parentItem?: any, ppid?: string | null): any[] | 2 => {
    if (!(menuData && menuData.length)) {
        return []
    }

    const result: any[] = []

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


export const loadUserInfo = async (platConfig: Record<string, any>) => {
    const systemConfig = useSystemConfig()
    let res: any = {}
    try {
        res = await platCreateService(platConfig.apiMap.userInfo, {appId: platConfig.appConfig.appId}, {}, platConfig.serviceConfig,)
    } catch (error) {
        console.error(error)
        return
    }
    if (res.code) {
        (this as any).$message.error(res.msg);
        return
    }
    systemConfig.setUserMsg(res.data || {})
}
