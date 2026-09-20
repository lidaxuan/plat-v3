<!--
 * @Author: your name
 * @Date: 2021-05-21 14:10:32
 * @LastEditTime: 2022-09-14 14:48:31
 * @LastEditors: 段丽军
 * @Description: In User Settings Edit
 * @FilePath: /el-web-basic/package/components/native/container-list-item/src/main.vue
-->
<script lang="jsx">
import formComp from "./mainContent/form";
import tableComp from "./mainContent/table";
import tipsComp from "./mainContent/tips.js";
export default {
  name: "EContainerListItemN",
  mixins:[formComp, tableComp, tipsComp],
  props: {
    // 样式类型：base 基本；boss BOSS系统；
    styleType: {
      type: String,
      default: null,
    },
    background: {
      type: Boolean,
      default: void 0,
    },
    padding: {
      type: Boolean,
      default: void 0,
    },
    queryFormItemCount: {
      type: Number,
      default: void 0,
    },
    fullScreenScroll: {
      type: Boolean,
      default: false,
    },
    scrollConfig: {
      type: Object,
      default: ()=> {},
    },
    preventShaking: {
      type: Function,
      default: ()=> {},
    },
    // 使用方式：outside 外部（多模块单独使用）；inner 内部（单模块使用）；
    useType: {
      type: String,
      default: "outside",
    },
  },
  data() {
    return {
      slotNames: {
        default: "default", // 默认
        asideTop: "aside-top", // 左侧树-顶部
        aside: "aside", // 左侧树
        tips: "tips", // 提示信息
        queryForm: "query-form", // 查询表单
        queryFormOper: "query-form-oper", // 查询表单操作
        tableAsideTop: "table-aside-top", // 表单树-顶部
        tableAside: "table-aside", // 表单树
        operBar: "oper-bar", // 操作栏
        tableOper: "table-oper", // 列表操作
        tableOperB: "table-oper-b", // 列表操作-B
        queryTable: "query-table", // 查询列表
        tablePage: "table-page", // 列表分页
      },

      createElement: null,

    };
  },
  computed: {
    styleTypeComputed() {
      return this.styleType || "base";
    },
  },
  watch: {
    scrollConfig: {
      handler(nv) {
        if(this.$refs.tableHeard) {
          this.$refs.tableHeard.style.top = nv.topPx+'px'
        }
      },
      deep: true
    },
    tableData() {
      this.$nextTick(()=> {
        this.reSize();
        this.preventShaking()
      })
    },
  },
  mounted() {
    this.initScroll();
  },
  methods: {
    isEmpty(val) {
      return val === undefined || val === null || val === "";
    },
    initScroll() {
      if(!this.fullScreenScroll) { return; }

      const table = this.$refs[this.tableBodyRef];
      const time = setInterval(()=> {
        if(!table) { return; }
        clearInterval(time);
        const tableBody = this.getElementsByClassName('el-table__body-wrapper', table.$el.children);
        const queryTableHeader = this.$refs?.[this.tableHeardRef];
        if(!queryTableHeader) { return; }
        const queryTableHeaderChildren = queryTableHeader.$el.children;
        if(!queryTableHeaderChildren) { return; }
        const topQueryTableHeader = this.getElementsByClassName('el-table__header', queryTableHeaderChildren)
        if(!topQueryTableHeader) { return; }
        const topQueryTableHeaderBody = this.getElementsByClassName('el-table__body-wrapper', queryTableHeaderChildren)
        if(!topQueryTableHeaderBody) { return; }
        const tableScroll = this.$refs.tableScroll;
        if(!topQueryTableHeaderBody) { return; }

        // 列表体 滚动事件
        tableBody.addEventListener('scroll', (e)=> {
          tableScroll.scrollLeft = e.target.scrollLeft; // 底部滚动条
          topQueryTableHeader.scrollLeft = e.target.scrollLeft; // 头部 表头
          topQueryTableHeaderBody.scrollLeft = e.target.scrollLeft; // 头部 表体
        })

        // 头部表头 滚动事件
        topQueryTableHeaderBody.addEventListener('scroll', (e)=> {
          tableBody.scrollLeft = e.target.scrollLeft; // 表体
          tableScroll.scrollLeft = e.target.scrollLeft; // 底部滚动条
        })

        // 底部滚动条 滚动事件
        this.$refs.tableScroll.addEventListener('scroll', (e)=> {
          tableBody.scrollLeft = e.target.scrollLeft; // 表体
          topQueryTableHeader.scrollLeft = e.target.scrollLeft; // 头部 表头
          topQueryTableHeaderBody.scrollLeft = e.target.scrollLeft; // 头部 表体
        })

        this.reSize();
        window.addEventListener('resize', this.reSize);
      }, 100);
    },
    // 重置宽度（重新计算 吸顶和吸底的宽度 及 吸低的滚动调长度）
    reSize() {
      this.preventShaking();
      const table = this.$refs[this.tableBodyRef];
      if(!table) { return; }
      const tableChildren = table.$el.children;
      if(!tableChildren) { return; }
      const tableHeader = this.getElementsByClassName('el-table__header-wrapper', tableChildren); // 表头
      if(!tableHeader) { return; }
      const tableBody = this.getElementsByClassName('el-table__body-wrapper', tableChildren); // 表体
      if(!tableBody) { return; }
      const tableBodyContent = this.getElementsByClassName('el-table__body', tableBody.children); // 表体 内容
      if(!tableBodyContent) { return; }
      const tableContainer = this.$refs.TableContainer; // 列表容器

      if(this.$refs.tableHeard) {
        this.$refs.tableHeard.style.width = tableHeader.getBoundingClientRect().width+'px' // 吸顶栏
      }
      if(this.$refs.tableScrollBar) {
        this.$refs.tableScrollBar.style.width = tableBodyContent.getBoundingClientRect().width+'px'; // 吸低滚动条
      }
      if(this.$refs.tableFooter) {
        this.$refs.tableFooter.style.width = tableContainer.getBoundingClientRect().width+'px' // 吸低栏
      }
    },
    getElementsByClassName(className, children) {
      if(!className || !children) { return; }
      for (var i = 0; i < children.length; i++) {
        const item = children[i]
        if(item?.className?.includes && item?.className?.includes(className)) { return item; }
        else {
          const result = this.getElementsByClassName(className, item?.children);
          if(result) { return result; }
        }
      }
    },
    // 左侧
    asideCom(asideName, asideTopName) {
      let asideTop = this.formatScopedSlot(asideTopName);
      let aside = this.formatScopedSlot(asideName);

      return aside || asideTop ? (
        <div class="e-cli__aside">
          {asideTop ? <div class="e-cli__aside-top">{asideTop}</div> : void 0}
          <div class="e-cli__aside-content">{aside}</div>
        </div>
      ) : (
        void 0
      );
    },
    // 查询列表（带左侧部分）
    queryAsideTableCom() {
      let { asideCom, queryTableCom, slotNames } = this;
      return (
        <div class="e-cli__main-table">
          {asideCom(slotNames.tableAside, slotNames.tableAsideTop)}
          {queryTableCom()}
        </div>
      );
    },
    // 查询表单、查询列表、默认模块 集合
    moduleCom() {
      const { tipsCom, queryFormCom, operBarCom, queryTableCom, queryAsideTableCom, formatScopedSlot, slotNames } = this;
      const isAside = formatScopedSlot(slotNames.tableAsideTop) || formatScopedSlot(slotNames.tableAside);
      const defaultSlot = formatScopedSlot(slotNames.default);
      return (
        <div class="e-cli__main">
          {tipsCom()}
          {queryFormCom()}
          {operBarCom()}
          {isAside ? queryAsideTableCom() : queryTableCom()}
          {defaultSlot}
        </div>
      );
    },

    // 格式化 作用域插槽
    formatScopedSlot(slotName, params={}) {
      return this.$scopedSlots[slotName] ? this.$scopedSlots[slotName](params) : void 0;
    },
    // 容器样式
    containerStyle() {
      let resultStyle = "";
      resultStyle += this.styleFormat(
        this.background,
        this.background,
        "background-color: white;"
      );
      resultStyle += this.styleFormat(
        this.padding,
        this.padding,
        "padding: 10px 15px; box-sizing: border-box;"
      );
      return resultStyle;
    },
    // 样式格式化
    styleFormat(valA, valB, resStr) {
      return (valA !== void 0 ? valA : valB) ? resStr : "";
    },







    // 提示信息
    tipsCom() {
      const self = this;
      let { tipsFoldComputed, formatScopedSlot, slotNames } = self;
      const tips = formatScopedSlot(slotNames.tips);
      const change = ()=> () => self.tipsFoldComputed = !tipsFoldComputed;
      return tips ? (
        <div class="e-cli__tips">
          <div class="e-cli__tips-content" style={`max-height: ${tipsFoldComputed ? 45 : 1000}px;`}>
            <e-button-n type="text-primary" onClick={ change() } icon="icon-F-F9" icon-position="right" isFold={tipsFoldComputed} style="line-height: 14px;"/>
            {tips}
            <div style="background-color: #F1F4FA; width: calc(100% - 32px); position: absolute; bottom: 0; height: 10px;" />
          </div>
        </div>
      ) : undefined;
    },





    heardSelectAll() {
      if(this.tableOperType === "body") {
        this.tableOperType = '';
        return;
      }
      this.tableOperType = 'heard';
      this.$refs[this.tableBodyRef].toggleAllSelection();
    },
    // 表头列宽设置
    heardHeaderDragend(newWidth, oldWidth, column, event) {
      this.setColumnWidth(newWidth, column, "body")
    },
    heardOper() {
      this.$refs[this.tableBodyRef].$emit("oper-click");
    },
    bodySelectionCahnge(selection) {
      if(this.tableOperType === "heard") {
        this.tableOperType = '';
        return;
      }

      this.tableOperType = 'body';
      if(selection.length === 0) {
        this.$refs[this.tableHeardRef]?.clearSelection();
        this.tableOperType = '';
      }
      else if(this.tableData.length === selection.length) {
        this.$refs[this.tableHeardRef]?.toggleAllSelection(true);
      }
      else if(this.tableData.length > selection.length) {
        this.$refs[this.tableHeardRef]?.clearSelection();
        this.$refs[this.tableHeardRef]?.toggleRowSelection(this.tableData[0], true);
        this.tableOperType = '';
      }
    },
    // 表体列宽设置
    bodyHeaderDragend(newWidth, oldWidth, column, event) {
      this.setColumnWidth(newWidth, column, "heard")
    },
    // 设置列宽
    setColumnWidth(newWidth, column, type) {
      const index = this.tableColumnData.findIndex(item=> item.label === column.label);
      const ref = type === "body" ? this.tableBodyRef : this.tableHeardRef;
      const table = this.$refs?.[ref]?.$refs?.table;
      const columnConfig = table.columns[index];
      columnConfig.width = columnConfig.realWidth = newWidth;
      table.store.scheduleLayout();
    },
    queryTableHeaderCom() {
      const self = this;
      const { formatScopedSlot, slotNames,  fullScreenScroll, scrollConfig } = self;
      const queryTable = formatScopedSlot(slotNames.queryTable, {
        queryTableAttr: {
          height: fullScreenScroll ? null : "100%", border: true,
        },
      });
      if(!queryTable) { return; }
      const { componentOptions, data } = queryTable[0] || {};
      const { attrs } = data || {};
      const { children } = componentOptions || {};

      const props = { ...(componentOptions?.propsData || {}) };
      const height = scrollConfig?.top ? '' : '0px';

      return this.createElement(componentOptions?.tag || 'e-table-sp', {
        props,
        attrs,
        on: {
          // ...componentOptions.listeners,
          'select-all': self.heardSelectAll,
          'header-dragend': self.heardHeaderDragend,
          'oper-click': self.heardOper,
        },
        ref: self.tableHeardRef,
        'class': {
          'e-table-sp-query-table-header': true
        },
        style: {
          width: '100%',
          height,
          overflow: "hidden"
          // display
        }
      }, children)
    },
    queryTableBodyCom() {
      const self = this;
      const { formatScopedSlot, slotNames,  fullScreenScroll, useType } = self;
      const queryTable = formatScopedSlot(slotNames.queryTable, {
        queryTableAttr: {
          height: fullScreenScroll ? null : "100%", border: true,
        },
      });
      if(!queryTable) { return; }
      const { componentOptions, data } = queryTable[0] || {};
      const { attrs, directives, scopedSlots, ref } = data || {};
      this.tableBodyRef = ref || this.tableBodyRef;
      const { children } = componentOptions || {};
      const props = { ...(componentOptions?.propsData || {}) };
      this.tableColumnData = props.tableColumnData;
      this.tableData = props?.data || attrs?.data || [];
      this.$nextTick(()=> {
        this.getParent(self, useType);
      })
      return this.createElement(componentOptions?.tag || 'e-table-sp', {
        props,
        attrs,
        directives,
        on: self.listenersFormat(componentOptions?.listeners || {}, {
          'selection-change': self.bodySelectionCahnge,
          'header-dragend': self.bodyHeaderDragend }),
        scopedSlots,
        ref: this.tableBodyRef,
      }, children)
    },
    listenersFormat(listeners, listeners2) {
      let events = {};
      for(const key in listeners) {
        events[key] = [listeners[key]];
      }
      for(const key in listeners2) {
        if(events[key]) {
          events[key].push(listeners2[key])
        } else {
          events[key] = [listeners2[key]];
        }
      }

      let result = {};
      for(const key in events) {
        result[key] = (...args)=> {
          events[key].forEach(item=> item(...args))
        }
      }
      return result;
    },
    getFormItemCount() {
      const { formatScopedSlot, slotNames } = this;
      const forms = formatScopedSlot(slotNames.queryForm, {});
    
      let form = null;
      if(Object.prototype.toString.call(forms).includes("Array")) {
        form = forms.find(item=> item?.componentOptions?.tag === 'el-form');
      } else {
        if(forms?.componentOptions?.tag === 'el-form') {
          form = forms;
        }
      }
      return form?.componentOptions?.children?.length || 0;
    },
    // 列表操作条
    tableOperBarCom() {
      const self = this;
      const { formatScopedSlot, slotNames, getFormItemCount, styleType } = self;

      const queryForm = formatScopedSlot(slotNames.queryForm, {
        queryFormAttr: { size: "small", ref: "queryForm", labelWidth: "0" },
      });

      // 查询表单操作-插槽
      const queryFormOper = formatScopedSlot(slotNames.queryFormOper, {
        shape: "basic", // 形态：complete 完整；simple 简单；basic 基本；
        buttonAttr: { size: "small" },
        foldAttr: { button: { type: "text-primary", icon: "icon-F-F9", iconPosition: "right", style: "line-height: 32px;" } },
      });

      // 获取实际查询条件数量
      const queryFormCount = getFormItemCount();
      // 询条件数量小于3大于0
      const isQueryForm = this.queryFormItemCount ? this.queryFormItemCount < 3 && this.queryFormItemCount > 0 :
        queryFormCount < 3 && queryFormCount > 0 && queryForm && styleType === 'base';

      return isQueryForm ? (
        <div class="e-cl__table-oper-bar">
          <div class="e-cl__table-oper">
            { queryForm }
            { queryFormOper ? (queryFormOper) : ( <e-button-n size="small" type="primary" icon="icon-C-C5" onClick={ self.$emit.bind(self, "query") }/> ) }
          </div>
        </div>
      ) : undefined
    },
    // 列表浮动顶部条
    tableFloatTopBarCom() {
      const self = this;
      const { fullScreenScroll, queryTableHeaderCom, } = self;

      return fullScreenScroll ? 
        (
          <div class="e-cl__table-heard" ref="tableHeard">
            { queryTableHeaderCom() }
          </div>
        ) : undefined
    },
    // 列表浮动底部条
    tableFloatBottomBarCom() {
      const self = this;
      const { fullScreenScroll, scrollConfig, formatTableBottom } = self;

      // 是否显示低栏
      const isDisplay = scrollConfig?.bottom;

      return fullScreenScroll ? 
        (
          <div class="e-cl__table-floor" ref="tableFooter" style={ isDisplay ? 'display: none' : '' }>
            <div class="table-scroll" ref="tableScroll">
              <div class="table-scroll-bar" ref="tableScrollBar"/>
            </div>
            { formatTableBottom() }
          </div>
        ) : undefined
    },
    formatTableBottom() {
      const self = this;
      const { formatScopedSlot, slotNames, formatTableOper } = self;
      // 列表操作
      const tableOper = formatScopedSlot(slotNames.tableOper, {
        buttonAttr: { size: "mini", type: "primary", minWidth: true },
      });
      // 列表操作B
      const tableOperB = formatScopedSlot(slotNames.tableOperB, {
        buttonAttr: { size: "mini", type: "primary", minWidth: true },
      });
      // 列表分页
      const tablePage = formatScopedSlot(slotNames.tablePage, {
        tablePageAttr: {
          background: true,
          pageSizes: [15, 20, 50, 100],
          layout: "total, sizes, prev, pager, next, jumper",
        },
      });

      return tablePage || tableOper || tableOperB ?
        (
          <div class="e-cl__table-bottom-bar">
            {formatTableOper(tableOper, tableOperB)}
            <div class="e-cl__tbb-page">{ tablePage }</div>
          </div>
        )
      : undefined;
    },
    formatTableOper(tableOper, tableOperB) {
      const newTableOper = tableOper?.filter(item=> item?.componentOptions?.Ctor?.extendOptions?.name === "EButtonN");
      const commandClick = (index)=> {
        newTableOper?.[index]?.componentOptions?.listeners?.click();
      }

      let tableOperDoc = newTableOper;
      if(newTableOper?.length > 2) {
        let displayButton =  newTableOper.splice(0, 2);
        tableOperDoc = (
          <div>
            {displayButton}
            <el-dropdown trigger="click" onCommand={ (e)=> commandClick(e) }>
              <e-button-n size="mini" type="defalut" icon="icon-F-F18"  style="margin-left: 10px;"/>
              <el-dropdown-menu slot="dropdown">
                {
                  newTableOper.map((item, index)=> (
                    <el-dropdown-item command={ index } disabled={item.componentOptions.propsData.disabled || item.componentOptions.propsData.loading}
                      icon={item.componentOptions.propsData.loading ? "el-icon-loading" : "iconfont "+item.componentOptions.propsData.icon}>
                      {item.componentOptions.children[0].text}</el-dropdown-item>
                  ))
                }
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        )
      }
      return (
        <div class="e-cl__tbb-oper">
          {tableOperDoc}
          <div style={ tableOperDoc ? "margin-left: 20px;" : "" }>{tableOperB}</div>
        </div>
      );
    },
    // 查询列表
    queryTableCom() {
      const self = this;
      const { formatScopedSlot, slotNames, fullScreenScroll, formatTableBottom, queryTableBodyCom, tableOperBarCom, tableFloatTopBarCom, tableFloatBottomBarCom, getFormItemCount, queryFormItemCount } = self;
      // 查询条件
      const queryForm = formatScopedSlot(slotNames.queryForm);
      // 列表操作
      const tableOper = formatScopedSlot(slotNames.tableOper, {
        buttonAttr: { size: "mini", type: "primary", minWidth: true },
      });
      // 列表操作B
      const tableOperB = formatScopedSlot(slotNames.tableOperB, {
        buttonAttr: { size: "mini", type: "primary", minWidth: true },
      });
      // 查询列表
      const queryTable = formatScopedSlot(slotNames.queryTable);
      // 列表分页
      const tablePage = formatScopedSlot(slotNames.tablePage, {
        tablePageAttr: {
          background: true,
          pageSizes: [10, 20, 50, 100],
          layout: "total, sizes, prev, pager, next, jumper",
        },
      });

      // 获取查询条件个数
      const queryFormCount = getFormItemCount();
      // 询条件数量小于3大于0
      const isQueryForm = queryFormItemCount ? queryFormItemCount < 3 && queryFormItemCount > 0 :
        queryFormCount < 3 && queryFormCount > 0 && queryForm;
      // 
      const isModule = isQueryForm || tableOper || tableOperB || queryTable || tablePage;

      return isModule ? (
        <div class="e-cl__table" ref="TableContainer" style={ fullScreenScroll ? 'min-height: auto;' : ''}>
          { tableOperBarCom() }
          { queryTable ? <div class="e-cl__table-table" style={fullScreenScroll ? '' : 'flex: 1; min-height: 0;'}>{ queryTableBodyCom() }</div> : undefined }
          { formatTableBottom() }
          { tableFloatTopBarCom() }
          { tableFloatBottomBarCom() }
        </div>
      ) : undefined;
    },
    getParent(self, useType) {
      if(!self || !useType) { return; }

      let tag;
      // 单一组件
      if(useType === 'inner') {
        tag = "e-container-list-n";
      }
      // 多模块
      else if(useType === 'outside') {
        tag = "e-container-list-item-n";
      } else {
        return;
      }

      if(self.$vnode.componentOptions?.tag === tag && self.$parent.$refs) {
        self.$parent.$refs[this.tableBodyRef] = this.$refs?.[this.tableBodyRef];
      } else {
        this.getParent(self?.$parent, useType);
      }
    },




    // 查询表单
    queryFormCom() {
      return this[this.styleTypeComputed+'QueryFormCom']();
    },
    // 查询表单
    baseQueryFormCom() {
      const self = this;
      const { formatScopedSlot, slotNames, listSlotNames, queryFormItemCount } = self;

      let slotForm, slotFormOper;
      let comName = self?.$options?.name;
      if(comName === "EContainerListN") {
        slotForm = listSlotNames.moduleQueryForm;
        slotFormOper = listSlotNames.moduleQueryFormOper;
      }
      else if(comName === "EContainerListItemN") {
        slotForm = slotNames.queryForm;
        slotFormOper = slotNames.queryFormOper;
      } else {
        console.error("组件使用错误", self.$options);
        return;
      }

      const queryForm = formatScopedSlot(slotForm, {
        queryFormAttr: { size: "small", ref: "queryForm", labelWidth: "0" },
      });
      const queryFormCount = this.baseGetFormItemCount(slotForm); // 实际查询条件个数
      const isQueryForm = queryFormItemCount ? queryFormItemCount >= 3 : queryFormCount >= 3 && queryForm;
      const isQueryFormFold = queryFormItemCount ? queryFormItemCount > 3 : queryFormCount > 3 && queryForm;

      const displayCondition = self.displayCondition;

      const change = ()=> () => self.displayCondition = !self.displayCondition;

      // 查询表单操作-插槽
      const queryFormOper = formatScopedSlot(slotFormOper, {
        shape: isQueryForm && isQueryFormFold ? "complete" : "simple", // 形态：complete 完整；simple 简单；basic 基本；
        buttonAttr: { size: "small" },
        foldAttr: {
          button: {
            type: "text-primary",
            icon: "icon-F-F9",
            iconPosition: "right",
            style: "line-height: 32px;",
          },
          isfold: self.displayCondition,
          foldCall: change(),
        },
      });

      let height = (displayCondition ? 44 : Math.ceil(queryForm?.[0]?.componentOptions?.children?.length / 3) * 44) + 12;
      // 查询表单
      return isQueryForm ? (
        <div class="e-cl__condition e-cl__condition-base" style={`height: ${height}px;`}>
          {queryForm}
          <div class="e-cl__condition-oper">
            {queryFormOper ? (queryFormOper) : (<e-button-n size="small" type="primary" onClick={self.$emit.bind(self, "query")}>查询</e-button-n>)}
            {queryFormOper ? (void 0) : (<e-button-n size="small" onClick={self.$emit.bind(self, "reset")}>重置</e-button-n>)}
            {!queryFormOper && isQueryFormFold ? (
              <e-button-n type="text-primary" onClick={change()} icon="icon-F-F9" icon-position="right" style="line-height: 32px; float: right;" isFold={displayCondition}/>
            ) : (void 0)}
          </div>
        </div>
      ) : undefined;
    },
    baseGetFormItemCount(slotForm) {
      const { formatScopedSlot } = this;
      const forms = formatScopedSlot(slotForm);
    
      let form = null;
      if(Object.prototype.toString.call(forms).includes("Array")) {
        form = forms.find(item=> item?.componentOptions?.tag === 'el-form');
      } else {
        if(forms?.componentOptions?.tag === 'el-form') {
          form = forms;
        }
      }
      return form?.componentOptions?.children?.length || 0;
    },
    // 查询表单
    bossQueryFormCom() {
      const self = this;
      const { formatScopedSlot, slotNames, listSlotNames } = self;

      let slotForm, slotFormOper;
      let comName = self.$options?.name;
      if(comName === "EContainerListN") {
        slotForm = listSlotNames.moduleQueryForm;
        slotFormOper = listSlotNames.moduleQueryFormOper;
      }
      else if(comName === "EContainerListItemN") {
        slotForm = slotNames.queryForm;
        slotFormOper = slotNames.queryFormOper;
      } else {
        console.error("组件使用错误", self.$options);
        return;
      }

      const queryForm = formatScopedSlot(slotForm, {
        queryFormAttr: { size: "small", ref: "queryForm", labelWidth: "0" },
      });
      const queryFormCount = this.bossGetFormItemCount(slotForm); // 实际查询条件个数
      const isQueryFormFold = queryFormCount > 5 && queryForm;

      const displayCondition = self.displayCondition;

      const change = ()=> () => self.displayCondition = !self.displayCondition;

      // 查询表单操作-插槽
      const queryFormOper = formatScopedSlot(slotFormOper, {
        buttonAttr: { size: "small" },
        foldAttr: {
          button: { type: "text-primary", icon: "icon-F-F9", iconPosition: "right", style: "line-height: 32px;" },
          isfold: displayCondition,
          foldCall: change(),
        },
      });

      let row = queryFormCount / 6;
      let height = (displayCondition ? 44 : (queryFormCount % 6 === 0 ? row+1 : Math.ceil(row)) * 44) + 12;
      let bottom = 11, right = 2;
      let operStyle = `bottom: ${bottom}px; right: ${right}px;`;
      if(queryFormCount <= 4) {
        operStyle = `bottom: ${bottom}px; left: calc(100% / 6 * ${queryFormCount});`;
      }
      // 查询表单
      return queryForm ? (
        <div class="e-cl__condition e-cl__condition-boss" style={`height: ${height}px;`}>
          {queryForm}
          <div class="e-cl__condition-oper" style={operStyle}>
            {queryFormOper ? (queryFormOper) : (<e-button-n size="small" type="primary" onClick={self.$emit.bind(self, "query")}>查询</e-button-n>)}
            {queryFormOper ? (void 0) : (<e-button-n size="small" onClick={self.$emit.bind(self, "reset")}>重置</e-button-n>)}
            {!queryFormOper && isQueryFormFold ? (
              <e-button-n type="text-primary" onClick={change()} icon="icon-F-F9" icon-position="right" style="line-height: 32px; float: right;" isFold={displayCondition}/>
            ) : (void 0)}
          </div>
        </div>
      ): null;
    },
    bossGetFormItemCount(slotForm) {
      const { formatScopedSlot } = this;
      const forms = formatScopedSlot(slotForm);
    
      let form = null;
      if(Object.prototype.toString.call(forms).includes("Array")) {
        form = forms.find(item=> item?.componentOptions?.tag === 'el-form');
      } else {
        if(forms?.componentOptions?.tag === 'el-form') {
          form = forms;
        }
      }
      return form?.componentOptions?.children.reduce((a, b)=> {
        let countB = 1;
        if(b?.data?.attrs?.col && !isNaN(b.data.attrs.col)) {
          let col = parseInt(b?.data?.attrs?.col || 24);
          countB = col > 6 ? 6 : col;
        }
        return a + countB;
      }, 0) || 0;
    },

    // 操作栏
    operBarCom() {
      const self = this;
      const { formatScopedSlot, slotNames } = self;
      const operBar = formatScopedSlot(slotNames.operBar, {
        buttonAttr: { size: "mini", type: "primary", minWidth: true },
      });
      return (<div class="e-cl-box">{operBar}</div>);
    },
  },
  render(h) {
    this.createElement = h;
    const { containerStyle, asideCom, moduleCom, slotNames, fullScreenScroll, reSize } = this;

    return (
      <div class={ `e-container-list-item ${ fullScreenScroll && "e-container-list-item-full"}` } style={containerStyle()} v-resize={ ()=> { reSize()} }>
        {asideCom(slotNames.aside, slotNames.asideTop)}
        {moduleCom()}
      </div>
    );
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../style/container-list/common.scss';
@import '../../../../style/container-list/item-list.scss';
</style>
