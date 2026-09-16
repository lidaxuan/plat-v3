/*
 * @Description:
 * @Author: lidaxuan
 * @Date: 2026-09-08 19:02:14
 * @FilePath: plat/directives/index.ts
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-09-08 19:02:14
*/
const vueFiles = import.meta.glob('./src/**/*.js', { eager: true })

const directives: Record<string, any> = {}
Object.entries(vueFiles).forEach(([filePath, mod]) => {
  // mod 是模块，默认导出就是指令对象
  const directive = (mod as any).default ?? mod
  // 提取文件名作为指令名，你可以自定义规则
  const name = filePath.match(/([^/]+)\.js$/)?.[1]
  if(name) {
    directives[name] = directive
  }
})

export default {
  // @ts-ignore
  install(app) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    })
  }
}

