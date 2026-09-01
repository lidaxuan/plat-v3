# plat-v3
```javascript
npm install --save-dev oxlint@~1.73.0

npm install --save-dev sass

npm i pinia-plugin-persistedstate

```



This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

---

## Plat 共享平台封装计划

### 一、背景与目标

公司多个项目（webcall、bossFront、trust、report 等）共用一套后台管理框架，包括 Layout 布局、登录鉴权、路由管理、状态管理、API 服务层、通用工具函数等。目前这些代码散落在各项目中，存在以下问题：

- 重复代码多，每个项目都要拷贝一份 Layout、路由守卫、Store 模块
- 修复 Bug 或新增功能需要在所有项目中同步，维护成本高
- 没有统一的版本管理，各项目版本不一致

**目标**：将通用能力抽离为独立的 `@easyliao/plat` npm 包，各项目通过依赖引入，改一处全部生效。

### 二、现有 Plat 目录分析

当前 `src/plat/` 目录结构（基于 Vue 2 + Vuex + Element UI）：

```
src/plat/
├── index.ts                    # 入口，EWebPlat 构造函数，挂载到 window
├── api/index.ts                # API 聚合
├── assets/                     # 样式、图片
│   ├── base/common/            # 通用 SCSS（color、flex、border、wh 等）
│   ├── base/reset/             # 重置样式
│   ├── img/                    # 静态图片（404、logo 等）
│   └── style/                  # 主题样式（element-variables、layout 等）
├── commonPage/                 # 通用页面（App.vue、401/403/404/500）
├── components/
│   ├── icon/                   # 图标组件（IconClass、IconSvg、IconCode）
│   ├── layouts/                # 核心布局组件
│   │   ├── index.vue           # 布局主入口（Header + Side + Main + Tag）
│   │   └── src/
│   │       ├── layoutHeader/   # 顶部栏（Left、Right、Search、UpdatePassword）
│   │       ├── layoutSetting/  # 主题设置面板（色系、布局切换）
│   │       ├── LayoutBreadcrumb.vue
│   │       ├── LayoutSide.vue  # 侧边菜单
│   │       ├── LayoutSideItem.vue
│   │       └── LayoutTag.vue   # 标签页
│   └── Login.vue               # 登录页
├── createApp/                  # Vue 实例创建 + mixin
│   ├── index.ts
│   └── mixin.js
├── directives/                 # 自定义指令（resize 等）
├── instance/                   # 初始化逻辑（路由、Store、Service、App 组装）
│   ├── index.ts                # initMixin 原型方法
│   └── baseConfig.js           # 基础配置（iconLink 等）
├── router/                     # 路由管理
│   ├── index.ts                # 路由创建 + 守卫（登录态、权限、菜单加载）
│   └── overAll.ts              # 通用路由（404、登录等）
├── service/                    # API 服务层
│   ├── index.ts                # Axios 封装、请求拦截、响应处理
│   └── request.js              # 请求核心逻辑
├── store/                      # Vuex 状态管理
│   ├── index.ts                # Store 创建 + vuex-persistedstate
│   ├── getters.js
│   ├── types.js
│   └── modules/
│       ├── user.js             # 用户信息、Token、主题设置
│       ├── layoutMenus.js      # 菜单、面包屑、标签页、权限码
│       ├── appConfig.js        # 应用配置
│       ├── setting.js          # 主题默认值
│       └── home.js             # 首页状态
├── utils/                      # 工具函数
│   ├── index.ts                # 工具集（readFile、getProductId、addLinkArr 等）
│   ├── auth.ts                 # 认证相关（Token、菜单、权限校验）
│   ├── findData.js / safeGet.js / safeSet.js
│   ├── getargv.js
│   └── watermark.js
└── theme/                      # Element UI 主题 CSS（按需覆盖）
```

### 三、升级方案

#### 3.1 技术栈升级

| 模块 | 当前（Vue 2） | 升级后（Vue 3） |
|------|-------------|----------------|
| 框架 | Vue 2 | Vue 3.5+ |
| 状态管理 | Vuex + vuex-persistedstate | Pinia + pinia-plugin-persistedstate |
| UI 库 | Element UI | Element Plus |
| 路由 | Vue Router 3 | Vue Router 4 |
| 构建 | Webpack | Vite |
| 语言 | JavaScript | TypeScript |
| HTTP | Axios（封装） | Axios（封装，加类型标注） |

#### 3.2 包结构设计

```
@easyliao/plat/
├── src/
│   ├── index.ts                    # 包入口，导出所有模块
│   ├── types/                      # 公共类型声明
│   │   └── index.ts
│   ├── createApp/                  # createPlatApp() 初始化入口
│   │   └── index.ts                # 接收配置，返回 app 实例
│   ├── layouts/                    # 布局组件
│   │   ├── PlatLayout.vue          # 主布局（Header + Side + Main + Tag）
│   │   ├── PlatHeader.vue          # 顶部栏
│   │   ├── PlatSide.vue            # 侧边菜单
│   │   ├── PlatBreadcrumb.vue      # 面包屑
│   │   ├── PlatTag.vue             # 标签页
│   │   └── PlatSetting.vue         # 主题设置
│   ├── components/                 # 通用组件
│   │   ├── icons/                  # 图标组件
│   │   ├── commonPages/            # 通用页面（401/403/404/500）
│   │   └── Login.vue
│   ├── router/                     # 路由工厂
│   │   ├── index.ts                # createRouter(config)
│   │   └── guards.ts               # 路由守卫（登录、权限）
│   ├── stores/                     # Pinia Store
│   │   ├── user.ts                 # 用户信息、Token
│   │   ├── menus.ts                # 菜单、权限、标签页
│   │   ├── app.ts                  # 应用配置
│   │   └── setting.ts              # 主题设置
│   ├── service/                    # API 服务层
│   │   ├── index.ts                # createService(config)
│   │   └── request.ts              # Axios 封装
│   ├── utils/                      # 工具函数
│   │   ├── auth.ts                 # 认证
│   │   ├── storage.ts              # 本地存储
│   │   └── index.ts
│   └── styles/                     # 样式
│       ├── base/                   # 基础样式
│       ├── theme/                  # 主题变量
│       └── layouts/                # 布局样式
├── package.json
├── tsconfig.json
└── vite.config.ts                  # 库模式构建
```

### 四、分模块设计

#### 4.1 初始化入口 — `createPlatApp()`

各项目唯一需要调用的入口函数，接收配置，完成全部初始化：

```typescript
// 各项目 src/main.ts
import { createPlatApp } from '@easyliao/plat'

const app = createPlatApp({
  appConfig: {
    appName: '易聊科技',
    logoIconFont: 'icon-doutuilogo',
    appId: 10000,
  },
  routes: [...],               // 项目自定义路由
  storeModules: { ... },       // 项目自定义 Store
  apiMap: { ... },             // 项目 API 模块
  apiConfig: [...],            // API 配置
  serviceConfig: {             // 请求拦截/响应处理
    responseSuccess,
    responseError,
    requestSuccess,
  },
  layoutSetting: {
    tag: true,
    breadcrumb: true,
  },
  loginUrl: '/login',
})
app.mount('#app')
```

`createPlatApp` 内部自动完成：
1. 创建 Pinia 实例 + 注册持久化插件
2. 创建 Router + 注入路由守卫
3. 注册全局组件（布局、图标、通用页面）
4. 注册自定义指令
5. 挂载全局样式
6. 初始化 Service 层

#### 4.2 布局组件 — `PlatLayout`

对外暴露的布局组件，支持插槽自定义：

```vue
<PlatLayout>
  <template #logo>...</template>           <!-- 自定义 Logo -->
  <template #headerRight>...</template>    <!-- 自定义顶部右侧 -->
  <template #actionBar>...</template>      <!-- 自定义操作栏 -->
  <template #content>...</template>        <!-- 自定义内容区 -->
</PlatLayout>
```

内置功能：
- 侧边栏/顶部菜单切换
- 菜单折叠
- 面包屑
- 标签页（TagView）
- 主题色切换
- 全屏模式

#### 4.3 路由管理 — `createRouter()`

```typescript
createRouter(config: {
  routes: RouteRecordRaw[]
  loginUrl?: string
  homePath?: string
})
```

内置路由守卫：
- 登录态校验（Token + 菜单信息）
- 权限校验（authCodeArr）
- 动态路由注册
- 进度条（NProgress）

#### 4.4 状态管理 — Pinia Stores

| Store             | 职责                                                                         |
|-------------------|----------------------------------------------------------------------------|
| `systemStore`     | Token、用户信息、登录状态、退出登录  主题色、布局模式、表格设置、tag/breadcrumb 开关   应用名称、Logo、appId、jumpContext  菜单树、面包屑、标签页、权限码、侧边菜单 |

每个 Store 默认开启 `persist` 持久化（sessionStorage）。

#### 4.5 API 服务层 — `createService()`

```typescript
createService(config: {
  apiMap: ApiMap
  apiConfig: ApiConfig[]
  responseSuccess?: (res) => any
  responseError?: (err) => any
  requestSuccess?: (config) => any
})
```

- 自动拼接上下文路径（本地代理 / 线上路径）
- 统一请求/响应拦截
- 错误码处理
- 支持 FormData / 文件上传

#### 4.6 通用页面

| 页面 | 说明 |
|------|------|
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 页面不存在 |
| 500 | 服务器错误 |

### 五、发布策略

#### 5.1 npm 包发布

```
@easyliao/plat
```

- 使用 Vite Library Mode 构建，输出 ESM + UMD
- 版本号遵循语义化版本（SemVer）
- 通过 GitLab CI/CD 自动发布

#### 5.2 版本管理

```
@easyliao/plat@1.0.0  → 首个 Vue 3 版本
@easyliao/plat@1.1.0  → 新增功能
@easyliao/plat@1.1.1  → Bug 修复
@easyliao/plat@2.0.0  → 破坏性变更
```

### 六、各项目接入方式

```typescript
// 1. 安装依赖
npm install @easyliao/plat

// 2. 项目入口 main.ts
import { createPlatApp } from '@easyliao/plat'
import App from './App.vue'
import routes from './router'
import apiMap from './api'

const app = createPlatApp({
  appConfig: { appName: 'XX系统', appId: 10001 },
  routers,
  apiMap,
  loginUrl: '/login',
})

app.mount('#app')
```

### 七、实施步骤

| 阶段 | 内容 | 产出 |
|------|------|------|
| 1. 基础搭建 | 创建 plat 包项目结构，配置 Vite/TS | 包骨架 |
| 2. 核心迁移 | Layout → Pinia Store → Router → Service → Utils | 核心可用 |
| 3. 样式迁移 | SCSS 主题变量、布局样式、Element Plus 覆盖 | 样式完整 |
| 4. 类型完善 | 所有导出接口加 TypeScript 类型标注 | 类型安全 |
| 5. 项目接入 | 选一个项目（如 webcall）接入 plat，验证流程 | 验证通过 |
| 6. 文档完善 | 编写使用文档、API 文档、迁移指南 | 文档齐全 |
| 7. 全量推广 | 所有项目逐步接入，下线旧代码 | 全面落地 |

### 八、注意事项

1. **向后兼容**：首个版本不需要完全兼容旧的 `EWebPlat` 原型链写法，新项目直接使用新 API
2. **按需引入**：利用 Tree Shaking，避免全量打包
3. **样式隔离**：plat 的 CSS 变量使用 `--plat-` 前缀，避免与项目样式冲突
4. **类型导出**：所有公开 API 必须导出类型，方便各项目使用
5. **最小依赖**：plat 包的 peerDependencies 只包含 `vue`、`vue-router`、`pinia`、`element-plus`，避免重复打包
