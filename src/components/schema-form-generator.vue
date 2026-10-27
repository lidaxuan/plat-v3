<!--
 * @Description: 从 JSON 样本自动推断表单字段，生成 Element Plus 表单代码
 * @Author: lijixuan
 * @Date: 2026-10-27
 * @FilePath: src/components/schema-form-generator.vue
 *
 * 三栏流程：①粘贴 JSON → ②勾选必填/改控件 → ③生成代码
 * 仅支持一层数组子对象（如 list: [{a, b}]），嵌套普通对象暂跳过
 -->
<template>
  <div class="schema-form-generator">
    <el-button>展示||隐藏 1</el-button>
    <el-button>展示||隐藏 2</el-button>
    <el-button>展示||隐藏 3</el-button>
    <el-row :gutter="12">
      <!-- 左栏：输入 JSON 样本 -->
      <el-col :span="8">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>1. 粘贴数据结构</span>
              <div class="card-header-actions">
                <el-button size="small" @click="fillDemo">填示例</el-button>
                <el-button size="small" type="primary" @click="parse">解析字段</el-button>
              </div>
            </div>
          </template>
          <el-input v-model="raw" type="textarea" :rows="14" placeholder='{"userName":"张三","age":18,"status":"ENABLE","tags":["A"],"enable":true,"createTime":"2026-10-27 10:00:00","remark":""}'/>
        </el-card>
      </el-col>

      <!-- 中栏：字段配置表格 -->
      <el-col :span="9">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>2. 配置字段</span>
              <div class="card-header-actions">
                <el-button size="small" :disabled="!fields.length" @click="toggleExpandAll">{{ allExpanded ? '全部收起' : '全部展开' }}</el-button>
                <el-button size="small" type="success" :disabled="!fields.length" @click="generate">生成代码</el-button>
                <el-button size="small" :disabled="!code" @click="copy">复制</el-button>
              </div>
            </div>
          </template>
          <!--
            注意：Tree 模式(:tree-props) 和 type="expand" 列互斥（Element Plus 源码里是 if/else 分支）。
            Tree 模式下展开箭头自动渲染在第一列，只需用 row-key + children 即可。
            expand-row-keys 用于外部控制展开态，@expand-change 监听用户点击同步 expandedKeys。
          -->
          <el-table ref="tableRef" :data="fields" size="small" max-height="560" border row-key="path" :default-expand-all="false" :expand-row-keys="expandedKeys" @expand-change="onExpandChange" :tree-props="{ children: 'children' }">
            <!-- 第一列：字段名 + Tree 模式展开箭头（自动渲染） -->
            <el-table-column prop="key" label="字段" width="140" show-overflow-tooltip />

            <el-table-column label="中文名" width="130">
              <template #default="{ row }">
                <el-input v-model="row.label" size="small" />
              </template>
            </el-table-column>

            <el-table-column label="控件" width="120">
              <template #default="{ row }">
                <el-select v-model="row.widget" size="small">
                  <el-option v-for="item in widgetOptions" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column v-if="hasSelectWidget" label="选项" min-width="140">
              <template #default="{ row }">
                <el-input v-if="isSelectWidget(row.widget)" v-model="row.optionsText" size="small" placeholder="逗号分隔"/>
              </template>
            </el-table-column>

            <el-table-column prop="type" label="类型" width="65" />

            <el-table-column label="必填" width="55" align="center">
              <template #default="{ row }">
                <el-checkbox v-if="!row.children" v-model="row.required" />
              </template>
            </el-table-column>

            <el-table-column label="校验" width="55" align="center">
              <template #default="{ row }">
                <el-switch v-if="!row.children" v-model="row.useCustomValidator" />
              </template>
            </el-table-column>

            <el-table-column v-if="hasCustomValidator" label="Validator" min-width="180">
              <template #default="{ row }">
                <el-input
                  v-if="row.useCustomValidator"
                  v-model="row.validatorCode"
                  type="textarea"
                  :rows="2"
                  size="small"
                  placeholder="if (!value) return callback(new Error('必填'))&#10;callback()"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 右栏：生成结果（源码 / 渲染预览 切换） -->
      <el-col :span="7">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>3. 生成结果</span>
              <div class="card-header-actions">
                <el-radio-group v-model="resultView" size="small">
                  <el-radio-button value="preview">预览</el-radio-button>
                  <el-radio-button value="source">源码</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>

          <!-- 渲染预览 -->
          <div v-if="resultView === 'preview'">
            <component v-if="previewComp" :is="previewComp" />
            <el-empty v-else description="先生成代码" />
          </div>

          <!-- 源码 -->
          <pre v-else-if="code" class="code">{{ code }}</pre>
          <el-empty v-else description="先生成代码" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import * as Vue from 'vue'
import { computed, defineComponent, h, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { ElTable } from 'element-plus'
import { parse as parseSfc, compileTemplate } from '@vue/compiler-sfc'

// ==================== 常量 ====================

/** 控件类型选项，控件值即生成代码时的 type 标记 */
const widgetOptions = [
  { label: '输入框', value: 'input' },
  { label: '多行文本', value: 'textarea' },
  { label: '数字', value: 'number' },
  { label: '开关', value: 'switch' },
  { label: '日期', value: 'date' },
  { label: '日期时间', value: 'datetime' },
  { label: '下拉单选', value: 'select' },
  { label: '下拉多选', value: 'multiSelect' },
  { label: '单选框', value: 'radio' },
] as const

/** 示例 JSON，点"填示例"时注入 */
const DEMO_JSON = `{
  "userName": "张三",
  "mobile": "13800000000",
  "age": 18,
  "status": "ENABLE",
  "tags": ["A", "B"],
  "list": [{"a": 1, "b": 2, "c": 3}],
  "enable": true,
  "createTime": "2026-10-27 10:00:00",
  "remark": ""
}`

// ==================== 状态 ====================

const raw = ref(DEMO_JSON)          // 左栏 JSON 输入
const fields = ref<FieldNode[]>([]) // 中栏字段列表（树形）
const code = ref('')                // 右栏生成结果
/** 表格 ref，用于 Tree 模式下直接操作展开态 */
const tableRef = ref<InstanceType<typeof ElTable> | null>(null)

/** 展开行的 path 集合：
 *  - 手动点击 → Element Plus 内部 toggleTreeExpansion 改内部 treeData，同时 emit expand-change
 *  - 外部按钮 → 改 expand-row-keys prop → watch 触发 updateTreeData 重算
 *  我们在两处同步 expandedKeys 保证按钮文案和 prop 一致。
 */
const expandedKeys = ref<string[]>([])
/** 是否全部数组块都展开了（按钮文案切换） */
const allExpanded = computed(() => {
  const blockPaths = fields.value.filter((f) => f.isArrayBlock).map((f) => f.path)
  return blockPaths.length > 0 && blockPaths.every((p) => expandedKeys.value.includes(p))
})
/** 展开/收起全部数组块（改 prop 触发 Element Plus 内部重算） */
function toggleExpandAll(): void {
  if (allExpanded.value) {
    expandedKeys.value = []
  } else {
    expandedKeys.value = fields.value.filter((f) => f.isArrayBlock).map((f) => f.path)
  }
}
/** 监听用户手动展开/收起，同步 expandedKeys（保证按钮文案正确） */
function onExpandChange(row: FieldNode, expanded: boolean): void {
  if (expanded) {
    if (!expandedKeys.value.includes(row.path)) expandedKeys.value.push(row.path)
  } else {
    expandedKeys.value = expandedKeys.value.filter((p) => p !== row.path)
  }
}

/** 右栏视图切换：源码 / 渲染预览 */
const resultView = ref<'preview' | 'source'>('source')
/** 渲染预览组件（把生成的 SFC 字符串编译成可挂载的组件） */
const previewComp = computed(() => {
  if (!code.value) return null
  try {
    return compileSfc(code.value)
  } catch (e) {
    // 编译失败时降级为源码视图，避免页面崩
    console.warn('[schema-form-generator] 预览编译失败，已切换源码视图：', (e as Error).message)
    resultView.value = 'source'
    return null
  }
})

/**
 * 把生成的 SFC 字符串编译成可渲染的组件
 *
 * compileTemplate 产出代码的完整结构：
 *   import { resolveComponent as _resolveComponent, ... } from "vue"   ← Vue helper
 *   const _hoisted_1 = { class: "xxx" }                               ← 提升的静态节点
 *   const _hoisted_2 = ...
 *   export function render(_ctx, _cache) { ...引用 _hoisted_1... }
 *
 * 所以 eval 时必须保留 hoisted const（render 依赖它们），只去掉 import 和 export。
 * Vue helper 通过 new Function 参数注入（因为 import 语法不能在 new Function 里执行）。
 */
function compileSfc(source: string) {
  const { descriptor } = parseSfc(source)
  if (!descriptor.template) return null

  const { code: renderCode } = compileTemplate({
    source: descriptor.template.content,
    filename: 'preview.vue',
    id: 'preview-component',
  })

  // ① 解析 import 行，拿到 alias → Vue 原属性名的映射
  //    例：`resolveComponent as _resolveComponent` → alias="_resolveComponent", orig="resolveComponent"
  const importMatch = renderCode.match(/^\s*import\s*\{([^}]+)\}\s*from\s*["']vue["']/m)
  const aliases: string[] = []
  const values: unknown[] = []
  if (importMatch) {
    const pairs = importMatch[1].split(',').map((s) => s.trim()).filter(Boolean)
    for (const pair of pairs) {
      const asMatch = pair.match(/^(\w+)\s+as\s+(\w+)$/)
      if (asMatch) {
        aliases.push(asMatch[2])
        values.push((Vue as Record<string, unknown>)[asMatch[1]])
      } else {
        aliases.push(pair)
        values.push((Vue as Record<string, unknown>)[pair])
      }
    }
  }

  // ② 清理源码：去掉 import 行和 export 关键字
  //    保留所有 const _hoisted_N = ...（它们定义在 render 外但被 render 引用）
  const cleanedCode = renderCode
    .replace(/^\s*import\s*\{[^}]+\}\s*from\s*["']vue["'];?\s*$/m, '')
    .replace(/^\s*export\s+/gm, '')
    .trim()

  // ③ 整段丢进 new Function：alias 作形参，Vue helper 做实参
  //    hoisted const 和 render function 都在同一个闭包里，render 能正常引用 _hoisted_N
  // eslint-disable-next-line no-new-func
  const factory = new Function(...aliases, cleanedCode + '; return render;')
  const renderFn = factory(...values)

  // 从 script 里提取 mock 数据，让 template 里的 v-model / :model / v-for 有值可渲染
  const mockForm = buildMockForm(descriptor.script?.content || '')

  return defineComponent({
    name: 'FormPreview',
    setup() {
      return {
        formRef: ref(null),
        form: reactive(mockForm.form),
        rules: reactive(mockForm.rules),
        submit: () => ElMessage.info('这是预览，不是真提交'),
        reset: () => {},
        ...mockForm.arrayFns,
        ...mockForm.optionsConsts,
      }
    },
    render: renderFn,
  })
}

/**
 * 从生成的 script 里提取 mock 数据，让 template 里引用的变量有值
 * 简单实现：匹配 reactive({ ... }) / const rules = { ... } / const xxxOptions = [...] / function addXxxItem / function removeXxxItem
 * 然后 eval（可控输入，只 eval 生成器产出的代码）
 */
function buildMockForm(scriptContent: string) {
  const result: {
    form: Record<string, unknown>
    rules: Record<string, unknown>
    optionsConsts: Record<string, unknown>
    arrayFns: Record<string, unknown>
  } = { form: {}, rules: {}, optionsConsts: {}, arrayFns: {} }

  if (!scriptContent) return result

  // 提取 reactive({ ... }) 里的对象字面量
  const formMatch = scriptContent.match(/const form = reactive\(([\s\S]*?)\)/)
  if (formMatch) {
    try {
      // eslint-disable-next-line no-new-func
      result.form = new Function(`return (${formMatch[1].trim()})`)()
    } catch {}
  }

  // 提取 const rules = { ... }
  const rulesMatch = scriptContent.match(/const rules = (\{[\s\S]*?\})/)
  if (rulesMatch) {
    try {
      // eslint-disable-next-line no-new-func
      result.rules = new Function(`return (${rulesMatch[1]})`)()
    } catch {}
  }

  // 提取 const xxxOptions = [...]
  const optRegex = /const (\w+Options) = (\[[\s\S]*?\])/g
  let m: RegExpExecArray | null
  while ((m = optRegex.exec(scriptContent))) {
    try {
      // eslint-disable-next-line no-new-func
      result.optionsConsts[m[1]] = new Function(`return (${m[2]})`)()
    } catch {}
  }

  // 提取 function addXxxItem / removeXxxItem（用 placeholder，不真操作 form）
  const fnRegex = /function (add\w+Item|remove\w+Item)\([^)]*\) \{[\s\S]*?\n\}/g
  while ((m = fnRegex.exec(scriptContent))) {
    result.arrayFns[m[1]] = () => {}
  }

  return result
}

// ==================== 类型 ====================

/** 字段节点：叶子字段 或 数组块 */
interface FieldNode {
  /** JSON key 名 */
  key: string
  /** 完整路径，如 list.0.a */
  path: string
  /** 中文标签（用户可改） */
  label: string
  /** JSON 值的原始类型 */
  type: string
  /** 推断/用户选定的控件类型 */
  widget: string
  /** 是否必填（正则推断，用户可改） */
  required: boolean
  /** 选择控件的默认选项 */
  options: string[]
  /** 用户手动输入的选项文本，优先于 options */
  optionsText: string
  /** 是否启用自定义 validator（true 时用 validatorCode 替代普通 rules） */
  useCustomValidator: boolean
  /** 自定义校验器代码体（不含 function 签名和 callback 调用） */
  validatorCode: string
  /** 是否为数组块节点（含 children） */
  isArrayBlock: boolean
  /** 所属数组块的 path（数组块自身为 null） */
  parentArray: string | null
  /** 数组块的子字段 */
  children?: FieldNode[]
}

// ==================== 控件判定 ====================

const SELECT_WIDGETS = new Set(['select', 'multiSelect', 'radio'])
/** 是否为选择类控件 */
const isSelectWidget = (widget: string) => SELECT_WIDGETS.has(widget)
/** 中栏表格是否需要显示"选项"列（存在任一选择控件） */
const hasSelectWidget = computed(() => fields.value.some((f) => isSelectWidget(f.widget)))
/** 中栏表格是否需要显示"Validator 代码"列（存在任一字段开启自定义校验） */
const hasCustomValidator = computed(() => fields.value.some((f) => f.useCustomValidator))

// ==================== 字段推断 ====================

/**
 * 根据 key/value/type 推断最匹配的控件类型
 * 优先级：boolean → number → 数组 → 日期/时间 → 关键词正则 → 默认 input
 */
function inferWidget(key: string, value: unknown, type: string): string {
  if (type === 'boolean') return 'switch'
  if (type === 'number') return 'number'
  if (Array.isArray(value)) return 'multiSelect'
  if (type === 'string') {
    const strVal = value as string
    if (/date|time/i.test(key) || /^\d{4}-\d{2}-\d{2}$/.test(strVal)) return 'date'
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(strVal)) return 'datetime'
    if (strVal.length > 60 || /remark|desc|description|note|content/i.test(key)) return 'textarea'
    if (/status|state|type|level|category/i.test(key)) return 'select'
    return 'input'
  }
  return 'input'
}

/**
 * 根据控件类型推断默认选项值（仅选择类控件）
 * 优先用数组样本值，其次用关键词正则兜底
 */
function defaultOptions(key: string, value: unknown): string[] {
  if (Array.isArray(value) && value.length && value.every((v) => typeof v === 'string'))
    return value as string[]
  if (/status|state/i.test(key)) return ['ENABLE', 'DISABLE']
  if (/type/i.test(key)) return ['TYPE_A', 'TYPE_B']
  return ['OPTION_A', 'OPTION_B']
}

/**
 * 把父路径和当前 key 拼成完整路径（用 . 分隔）
 */
function joinPath(prefix: string, key: string): string {
  return prefix ? `${prefix}.${key}` : key
}

/**
 * 构造一个叶子字段节点
 */
function makeLeaf(
  key: string,
  value: unknown,
  prefix: string,
  parentArray: string | null,
): FieldNode {
  const path = joinPath(prefix, key)
  const type = Array.isArray(value) ? 'array' : value === null ? 'string' : typeof value
  const widget = inferWidget(key, value, type)
  return reactive({
    key,
    path,
    label: key,
    type,
    widget,
    // 必填推断：关键词正则匹配常用必填字段
    required: /name|title|status|type|userName|mobile|phone/i.test(key),
    options: isSelectWidget(widget) ? defaultOptions(key, value) : [],
    optionsText: '',
    useCustomValidator: false,
    validatorCode: '',
    isArrayBlock: false,
    parentArray,
  })
}

/**
 * 深度遍历 JSON 对象，产出 FieldNode 树
 * 数组若含对象首项则视为"数组块"（可展开行内编辑），否则视为多选字段
 * 嵌套普通对象暂跳过（避免模型/校验复杂度爆炸）
 */
function walk(node: Record<string, unknown>, prefix: string, parentArray: string | null): FieldNode[] {
  const rows: FieldNode[] = []
  let skippedNested = 0

  for (const [key, value] of Object.entries(node)) {
    if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) {
      rows.push(makeLeaf(key, value, prefix, parentArray))
    } else if (Array.isArray(value)) {
      const first = value[0]
      // 数组首项是纯对象 → 数组块（行内编辑）
      if (value.length && first && typeof first === 'object' && !Array.isArray(first)) {
        const blockPath = joinPath(prefix, key)
        rows.push(
          reactive({
            key,
            path: blockPath,
            label: key,
            isArrayBlock: true,
            parentArray: null,
            widget: '',
            type: 'array',
            required: false,
            options: [],
            optionsText: '',
            children: walk(first as Record<string, unknown>, '', blockPath),
          }),
        )
      } else {
        // 数组首项是原始值 → 多选字段
        rows.push(makeLeaf(key, value, prefix, parentArray))
      }
    } else if (typeof value === 'object') {
      // 嵌套普通对象暂跳过
      skippedNested++
    }
  }

  if (skippedNested) ElMessage.warning(`已忽略 ${skippedNested} 个嵌套对象字段（暂不支持）`)
  return rows
}

/**
 * 把原始 JSON 解析成 FieldNode 列表
 * 支持单对象 或 对象数组（取首项推断）
 */
function inferFields(sample: unknown): FieldNode[] {
  const obj = Array.isArray(sample) ? sample[0] : sample
  if (!obj || typeof obj !== 'object') throw new Error('请粘贴 JSON 对象，或对象数组')
  return walk(obj as Record<string, unknown>, '', null)
}

// ==================== 按钮事件 ====================

/** 左栏"解析字段"：解析 JSON → 填充中栏表格 */
function parse(): void {
  try {
    const sample = JSON.parse(raw.value)
    fields.value = inferFields(sample)
    code.value = ''
    ElMessage.success(`解析成功：${fields.value.length} 个字段`)
  } catch (e) {
    ElMessage.error(`JSON 解析失败：${(e as Error).message}`)
  }
}

/** 左栏"填示例"：注入示例 JSON 并自动解析 */
function fillDemo(): void {
  raw.value = DEMO_JSON
  parse()
}

/** 右栏"复制代码"：写入剪贴板 */
async function copy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(code.value)
    ElMessage.success('已复制')
  } catch (e) {
    ElMessage.error('复制失败，请手动选择复制')
  }
}

// ==================== 代码生成工具 ====================

/** 所有叶子字段（跳过数组块本身，递归展开 children） */
function collectLeaves(rows: FieldNode[]): FieldNode[] {
  return rows.flatMap((r) => (r.isArrayBlock && r.children ? collectLeaves(r.children) : [r]))
}

/** 首字母大写，用于 addXxxItem / removeXxxItem 函数命名 */
function cap(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

/** 选择控件的最终选项：用户输入优先，否则用推断值 */
function optionsOf(field: FieldNode): string[] {
  const fromText = (field.optionsText || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return fromText.length ? fromText : field.options
}

/** 生成值的默认值字面量（reactive 初始化 / addItem push 共用） */
function defaultVal(field: FieldNode): string {
  if (field.widget === 'number') return 'undefined'
  if (field.widget === 'switch') return 'false'
  if (field.widget === 'multiSelect') return '[]'
  return "''"
}

/** el-form-item rules 的 trigger 推断 */
function triggerOf(field: FieldNode): string {
  return isSelectWidget(field.widget) || ['date', 'datetime', 'switch'].includes(field.widget)
    ? 'change'
    : 'blur'
}

/** 必填校验的 message 文案：选择控件 → 请选择，其余 → 请输入 */
function messageOf(field: FieldNode): string {
  const action = isSelectWidget(field.widget) || ['date', 'datetime'].includes(field.widget)
    ? '请选择'
    : '请输入'
  return `${action}${field.label}`
}

/** HTML 属性转义，防止 label/option 含引号破坏模板 */
function escapeAttr(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** 把 JS 值序列化成模板里的 :value 属性值 */
function bindValueAttr(value: unknown): string {
  return JSON.stringify(value).replace(/"/g, '&quot;')
}

// ==================== 模板片段生成 ====================

/**
 * 生成 el-option / el-radio 片段
 * radio 用 <el-radio :value>，select/multiSelect 用 <el-option>
 */
function renderOptions(field: FieldNode): string {
  const options = optionsOf(field)
  if (field.widget === 'radio') {
    return options
      .map((o) => `      <el-radio :value="${bindValueAttr(o)}">${escapeAttr(o)}</el-radio>`)
      .join('\n')
  }
  return options
    .map((o) => `        <el-option label="${escapeAttr(o)}" :value="${bindValueAttr(o)}" />`)
    .join('\n')
}

/**
 * 生成单个 el-form-item 片段（纯表单项，不含栅格包裹）
 * @param field 叶子字段
 * @param valueScope v-model 前缀，默认 form.；数组块内传 item.
 * @param propPrefix prop 属性前缀，数组子项需传 list.${idx}.
 */
function renderItemPure(field: FieldNode, valueScope = 'form.', propPrefix = ''): string {
  const label = escapeAttr(field.label || field.key)
  const v = `${valueScope}${field.path}`
  const prop = `${propPrefix}${field.path}`

  // 数组子项的规则必须内联到 el-form-item，全局 rules 匹配不到 list.0.a
  // 开启自定义 validator 时用 validator 函数替代普通 rules
  const inlineRules = (() => {
    if (!field.parentArray || !field.required) return ''
    if (field.useCustomValidator && field.validatorCode.trim()) {
      const fn = escapeAttr(field.validatorCode.trim())
      return ` :rules="[{ required: true, validator: (rule, value, callback) => { ${fn} } }]"`
    }
    return ` :rules="[{ required: true, message: '${messageOf(field)}', trigger: '${triggerOf(field)}' }]"`
  })()

  /** 控件部分：根据 widget 返回对应的 el-xxx 组件 */
  const control = (() => {
    switch (field.widget) {
      case 'textarea':
        return `<el-input v-model="${v}" type="textarea" :rows="3" placeholder="请输入${label}" />`
      case 'number':
        return `<el-input-number v-model="${v}" placeholder="请输入${label}" controls-position="right" style="width: 100%" />`
      case 'switch':
        return `<el-switch v-model="${v}" active-text="开启" inactive-text="关闭" />`
      case 'date':
        return `<el-date-picker v-model="${v}" type="date" value-format="YYYY-MM-DD" placeholder="请选择${label}" style="width: 100%" />`
      case 'datetime':
        return `<el-date-picker v-model="${v}" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择${label}" style="width: 100%" />`
      case 'select':
        return `<el-select v-model="${v}" placeholder="请选择${label}" style="width: 100%">
${renderOptions(field)}
        </el-select>`
      case 'multiSelect':
        return `<el-select v-model="${v}" multiple collapse-tags collapse-tags-tooltip placeholder="请选择${label}" style="width: 100%">
${renderOptions(field)}
        </el-select>`
      case 'radio':
        return `<el-radio-group v-model="${v}">
${renderOptions(field)}
        </el-radio-group>`
      default:
        return `<el-input v-model="${v}" placeholder="请输入${label}" />`
    }
  })()

  return `        <el-form-item label="${label}" prop="${prop}"${inlineRules}>
          ${control}
        </el-form-item>`
}

/**
 * 生成带栅格包裹的 el-form-item（顶层叶子字段：两列布局）
 * textarea / datetime 占满 24 列，其他占 12 列
 */
function renderItem(field: FieldNode): string {
  const span = ['textarea', 'datetime'].includes(field.widget) ? '24' : '12'
  const inner = renderItemPure(field, 'form.', '')
  return `        <el-col :span="${span}">
${inner}
        </el-col>`
}

/**
 * 生成数组块片段（含 v-for / 新增 / 删除）
 * 数组块独立卡片化，内部子字段两列栅格，删除按钮绝对定位
 * 生成源码里 idx 是模板变量本身，所以 prop 前缀直接写字面量 ${idx}
 */
function renderArrayBlock(block: FieldNode): string {
  const addFn = `add${cap(block.key)}Item`
  const removeFn = `remove${cap(block.key)}Item`
  // 数组子项也走 renderItemPure + el-col，实现栅格布局
  const items = (block.children || [])
    .map((c) => {
      const span = ['textarea', 'datetime'].includes(c.widget) ? '12' : '12'
      const inner = renderItemPure(c, 'item.', `${block.key}.\${idx}.`)
      return `              <el-col :span="${span}">
${inner}
              </el-col>`
    })
    .join('\n')

  return `    <el-divider content-position="left">${escapeAttr(block.label)}</el-divider>
    <div
      v-for="(item, idx) in form.${block.key}"
      :key="idx"
      class="array-item"
    >
      <el-row :gutter="16">
${items}
      </el-row>
      <div class="array-item-footer">
        <el-button type="danger" plain size="small" @click="${removeFn}(idx)">删除此行</el-button>
      </div>
    </div>
    <el-button class="add-btn" size="small" @click="${addFn}">新增一行</el-button>`
}

// ==================== 组装最终代码 ====================

/** 生成 reactive form 对象的初始值片段 */
function buildModel(fields: FieldNode[]): string {
  return fields
    .map((f) => {
      if (!f.isArrayBlock) return `  ${f.path}: ${defaultVal(f)}`
      // 数组块：首行默认值
      const row = (f.children || []).map((c) => `      ${c.path}: ${defaultVal(c)}`).join(',\n')
      return `  ${f.key}: [\n    {\n${row}\n    }\n  ]`
    })
    .join(',\n')
}

/** 生成全局 rules 对象
 * 普通必填字段 → { required: true, message, trigger }
 * 开启自定义 validator → { required: true, validator: (rule, value, callback) => { ... } }
 * 数组子项的行内 rules 已在 renderItemPure 里处理，这里只处理顶层叶子字段
 */
function buildRules(fields: FieldNode[]): string {
  const ruleLines = fields
    .filter((f) => !f.isArrayBlock && f.required)
    .map((f) => {
      if (f.useCustomValidator && f.validatorCode.trim()) {
        // 自定义 validator：把用户写的代码体包进 validator 函数
        // callback() 由用户在代码里手动调用，生成器不自动加
        const body = f.validatorCode.trim().split('\n').map((l) => `    ${l}`).join('\n')
        return `  ${f.path}: [{ required: true, validator: (rule, value, callback) => {\n${body}\n  } }]`
      }
      return `  ${f.path}: [{ required: true, message: '${messageOf(f)}', trigger: '${triggerOf(f)}' }]`
    })
    .join(',\n')
  return ruleLines ? `{\n${ruleLines}\n}` : '{}'
}

/** 生成选择控件的 Options 常量（如 const statusOptions = ["ENABLE","DISABLE"]） */
function buildOptionsConsts(fields: FieldNode[]): string {
  return collectLeaves(fields)
    .filter((f) => isSelectWidget(f.widget))
    .map((f) => `const ${f.key}Options = ${JSON.stringify(optionsOf(f))}`)
    .join('\n')
}

/** 生成数组块的 add/remove 函数 */
function buildArrayFns(fields: FieldNode[]): string {
  return fields
    .filter((f) => f.isArrayBlock)
    .map((f) => {
      const row = (f.children || []).map((c) => `${c.path}: ${defaultVal(c)}`).join(', ')
      return `function add${cap(f.key)}Item() {
  form.${f.key}.push({ ${row} })
}
function remove${cap(f.key)}Item(index) {
  form.${f.key}.splice(index, 1)
}`
    })
    .join('\n')
}

/** 右栏"生成 Form 代码"：把 FieldNode 树拼成完整 SFC 代码 */
function generate(): void {
  if (!fields.value.length) {
    ElMessage.warning('请先解析字段')
    return
  }

  // ① 顶层叶子字段 → el-col 包裹，数组块 → 独立卡片化
  const topLeaves = fields.value.filter((f) => !f.isArrayBlock).map(renderItem).join('\n')
  const arrayBlocks = fields.value.filter((f) => f.isArrayBlock).map(renderArrayBlock).join('\n')

  // ② script 各段落
  const model = buildModel(fields.value)
  const rules = buildRules(fields.value)
  const consts = buildOptionsConsts(fields.value)
  const arrayFns = buildArrayFns(fields.value)

  // ③ 拼成完整 SFC：el-card + el-row 栅格 + 按钮区 + scoped style
  code.value = `<template>
  <div class="generated-form-page">
    <el-card class="generated-form-card" shadow="hover" header="表单">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="110px"
        label-position="right"
      >
        <el-row :gutter="20">
${topLeaves}
        </el-row>

${arrayBlocks ? `${arrayBlocks}\n` : ''}
        <el-form-item class="form-actions">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
${consts ? `${consts}\n` : ''}const formRef = ref(null)

const form = reactive({
${model}
})

const rules = ${rules}

${arrayFns ? `${arrayFns}\n` : ''}async function submit() {
  try {
    await formRef.value.validate()
    console.log('submit:', form)
    ElMessage.success('校验通过')
  } catch (e) {
    ElMessage.warning('请先完善必填项')
  }
}

function reset() {
  formRef.value?.resetFields()
}
<\/script>

<style scoped>
/* 页面容器：居中 + 轻灰背景 */
.generated-form-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100%;
}

/* 表单卡片 */
.generated-form-card {
  max-width: 1080px;
  margin: 0 auto;
  border-radius: 8px;
  border: none;
}

.generated-form-card :deep(.el-card__header) {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 1px solid #f0f0f0;
}

/* 数组块：卡片化（浅灰底 + 虚线边框 + 内边距） */
.array-item {
  position: relative;
  padding: 16px 16px 48px;
  margin-bottom: 12px;
  background: #fafbfc;
  border: 1px dashed #e4e7ed;
  border-radius: 6px;
}

.array-item-footer {
  position: absolute;
  right: 12px;
  bottom: 10px;
}

/* 新增按钮：全宽虚线 */
.add-btn {
  margin-top: 4px;
  border-style: dashed;
  width: 100%;
}

/* 按钮区：右对齐 + 顶部分割线 */
.form-actions {
  margin-top: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}
</style>`
}
</script>

<style scoped>
.schema-form-generator {
  padding: 12px;
}

.action-row {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

.code {
  margin: 0;
  max-height: 70vh;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 12px;
  line-height: 1.6;
  background: #0f172a;
  color: #e5e7eb;
  padding: 12px;
  border-radius: 6px;
}
</style>
