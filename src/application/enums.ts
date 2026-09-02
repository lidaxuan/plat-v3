/*
 * @Description:
 * @Author: lidaxuan
 * @Date: 2026-09-02 16:35:49
 * @FilePath: src/application/enums.ts
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-09-02 16:35:49
*/

export interface MenuItem {
  id: number | string
  code: string
  productId: string
  name: string
  uri: string
  score: number
  iconUrl: string | null
  type: number
  children?: MenuItem[]
}

const menus: MenuItem[] = [
  {
    id: 17371238,
    code: 'reportBuilderPage',
    productId: '10000',
    name: 'BI 报表',
    uri: 'reportBuilderPage',
    score: 1,
    iconUrl: 'icon-BI-report-manage',
    type: 1,
  },
  {
    "id": 17378,
    "code": "chat",
    "productId": "10000",
    "name": "对话列表",
    "uri": "chat",
    "score": 1,
    "iconUrl": "icon-yiji-duihualiebiao",
    "type": 1
  },
  {
    "id": 17379,
    "code": "homeIndex/chatRecord",
    "productId": "10000",
    "name": "消息记录",
    "uri": "homeIndex/chatRecord",
    "score": 1,
    "iconUrl": "icon-yiji-xiaoxijilu",
    "type": 1
  },
  {
    "id": 17380,
    "code": "test1",
    "productId": "10000",
    "name": "名片管理",
    "uri": "test1",
    "score": 1,
    "iconUrl": "icon-yiji-mingpianguanli",
    "type": 1
  },
  {
    "id": 17381,
    "code": "config",
    "productId": "10000",
    "name": "设置中心",
    "uri": "config",
    "score": 1,
    "iconUrl": "icon-yiji-shezhizhongxin",
    "type": 1,
    "children": [
      {
        "id": "173811",
        "code": "test2",
        "productId": "10000",
        "name": "部门管理",
        "uri": "test2",
        "score": 1,
        "iconUrl": null,
        "type": 10,
        "children": []
      },
      {
        "id": "173812",
        "code": "test3",
        "productId": "10000",
        "name": "客服分组管理",
        "uri": "test3",
        "score": 2,
        "iconUrl": "",
        "type": 10,
        "children": []
      },
    ]
  },
  {
    "id": 17382,
    "code": "test4",
    "productId": "10000",
    "name": "矩阵账号test4",
    "uri": "test4",
    "score": 1,
    "iconUrl": "icon-yiji-juzhenzhanghao",
    "type": 1
  },
  {
    "id": 17384,
    "code": "menuList",
    "productId": "10000",
    "name": "功能导航",
    "uri": "menuList",
    "score": 1,
    "iconUrl": "icon-yiji-gongnengdaohang",
    "type": 1
  },
];

export default menus
