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
    id: 12345,
    code: 'workOrderWorkbench',
    productId: '10000',
    name: '工单工作台',
    uri: 'workOrderWorkbench',
    score: 1,
    iconUrl: 'icon-BI-report-manage',
    type: 1,
  },
  {
    id: 123455,
    code: 'systemSetting',
    productId: '10000',
    name: '系统设置',
    uri: 'systemSetting',
    score: 1,
    iconUrl: 'icon-yiji-duihualiebiao',
    type: 1
  }
];

export default menus
