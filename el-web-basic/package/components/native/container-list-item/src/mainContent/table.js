/*
 * @Author: 段丽军
 * @Date: 2022-06-24 11:52:58
 * @LastEditTime: 2022-06-27 12:45:31
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/container-list-item/src/mainContent/table.js
 */
export default {
  data() {
    return {
      tableOperType: '', // heard/body
      tableData: [], // 
      tableColumnData: [],
      tableBodyRef: "queryTable",
      tableHeardRef: "queryTableHeader",
    };
  },
  // methods: {
  //   heardSelectAll() {
  //     if(this.tableOperType === "body") {
  //       this.tableOperType = '';
  //       return;
  //     }
  //     this.tableOperType = 'heard';
  //     this.$refs[this.tableBodyRef].toggleAllSelection();
  //   },
  //   // 表头列宽设置
  //   heardHeaderDragend(newWidth, oldWidth, column, event) {
  //     this.setColumnWidth(newWidth, column, "body")
  //   },
  //   heardOper() {
  //     this.$refs[this.tableBodyRef].$emit("oper-click");
  //   },
  //   bodySelectionCahnge(selection) {
  //     if(this.tableOperType === "heard") {
  //       this.tableOperType = '';
  //       return;
  //     }

  //     this.tableOperType = 'body';
  //     if(selection.length === 0) {
  //       this.$refs[this.tableHeardRef]?.clearSelection();
  //       this.tableOperType = '';
  //     }
  //     else if(this.tableData.length === selection.length) {
  //       this.$refs[this.tableHeardRef]?.toggleAllSelection(true);
  //     }
  //     else if(this.tableData.length > selection.length) {
  //       this.$refs[this.tableHeardRef]?.clearSelection();
  //       this.$refs[this.tableHeardRef]?.toggleRowSelection(this.tableData[0], true);
  //       this.tableOperType = '';
  //     }
  //   },
  //   // 表体列宽设置
  //   bodyHeaderDragend(newWidth, oldWidth, column, event) {
  //     this.setColumnWidth(newWidth, column, "heard")
  //   },
  //   // 设置列宽
  //   setColumnWidth(newWidth, column, type) {
  //     const index = this.tableColumnData.findIndex(item=> item.label === column.label);
  //     const ref = type === "body" ? this.tableBodyRef : this.tableHeardRef;
  //     const table = this.$refs?.[ref]?.$refs?.table;
  //     const columnConfig = table.columns[index];
  //     columnConfig.width = columnConfig.realWidth = newWidth;
  //     table.store.scheduleLayout();
  //   },
  //   queryTableHeaderCom() {
  //     let self = this;
  //     let { formatScopedSlot, slotNames,  fullScreenScroll, scrollConfig } = self;
  //     let queryTable = formatScopedSlot(slotNames.queryTable, {
  //       queryTableAttr: {
  //         height: fullScreenScroll ? null : "100%", border: true,
  //       },
  //     });
  //     if(!queryTable) { return; }
  //     let { componentOptions, data } = queryTable[0];
  //     let { attrs } = data;
  //     let { children } = componentOptions;

  //     let props = { ...componentOptions.propsData };
  //     // let display = scrollConfig.top ? '' : 'none';
  //     let height = scrollConfig?.top ? '' : '0px';

  //     return this.createElement(componentOptions.tag, {
  //       props,
  //       attrs,
  //       on: {
  //         // ...componentOptions.listeners,
  //         'select-all': self.heardSelectAll,
  //         'header-dragend': self.heardHeaderDragend,
  //         'oper-click': self.heardOper,
  //       },
  //       ref: self.tableHeardRef,
  //       'class': {
  //         'e-table-sp-query-table-header': true
  //       },
  //       style: {
  //         width: '100%',
  //         height,
  //         overflow: "hidden"
  //         // display
  //       }
  //     }, children)
  //   },
  //   queryTableBodyCom() {
  //     let self = this;
  //     let { formatScopedSlot, slotNames,  fullScreenScroll, useType } = self;
  //     let queryTable = formatScopedSlot(slotNames.queryTable, {
  //       queryTableAttr: {
  //         height: fullScreenScroll ? null : "100%", border: true,
  //       },
  //     });
  //     if(!queryTable) { return; }
  //     let { componentOptions, data } = queryTable[0];
  //     let { attrs, directives, scopedSlots, ref } = data;
  //     this.tableBodyRef = ref || this.tableBodyRef;
  //     let { children } = componentOptions;
  //     let props = { ...componentOptions.propsData };
  //     this.tableColumnData = props.tableColumnData;
  //     this.tableData = props.data;
  //     this.$nextTick(()=> {
  //       this.getParent(self, useType);
  //     })
  //     return this.createElement(componentOptions.tag, {
  //       props,
  //       attrs,
  //       directives,
  //       on: self.listenersFormat(componentOptions.listeners, {
  //         'selection-change': self.bodySelectionCahnge,
  //         'header-dragend': self.bodyHeaderDragend }),
  //       scopedSlots,
  //       ref: this.tableBodyRef,
  //     }, children)
  //   },
  //   listenersFormat(listeners, listeners2) {
  //     let events = {};
  //     for(const key in listeners) {
  //       events[key] = [listeners[key]];
  //     }
  //     for(const key in listeners2) {
  //       if(events[key]) {
  //         events[key].push(listeners2[key])
  //       } else {
  //         events[key] = [listeners2[key]];
  //       }
  //     }

  //     let result = {};
  //     for(const key in events) {
  //       result[key] = (...args)=> {
  //         events[key].forEach(item=> item(...args))
  //       }
  //     }
  //     return result;
  //   },
  //   getFormItemCount() {
  //     const { formatScopedSlot, slotNames } = this;
  //     const forms = formatScopedSlot(slotNames.queryForm, {});
    
  //     let form = null;
  //     if(Object.prototype.toString.call(forms).includes("Array")) {
  //       form = forms.find(item=> item?.componentOptions?.tag === 'el-form');
  //     } else {
  //       if(forms?.componentOptions?.tag === 'el-form') {
  //         form = forms;
  //       }
  //     }
  //     return form?.componentOptions?.children?.length || 0;
  //   },
  //   // 列表操作条
  //   tableOperBarCom() {
  //     const self = this;
  //     const { formatScopedSlot, slotNames, getFormItemCount, styleType } = self;

  //     const queryForm = formatScopedSlot(slotNames.queryForm, {
  //       queryFormAttr: { size: "small", ref: "queryForm", labelWidth: "0" },
  //     });

  //     // 查询表单操作-插槽
  //     const queryFormOper = formatScopedSlot(slotNames.queryFormOper, {
  //       shape: "basic", // 形态：complete 完整；simple 简单；basic 基本；
  //       buttonAttr: { size: "small" },
  //       foldAttr: { button: { type: "text-primary", icon: "icon-F-F9", iconPosition: "right", style: "line-height: 32px;" } },
  //     });

  //     // 获取实际查询条件数量
  //     const queryFormCount = getFormItemCount();
  //     // 询条件数量小于3大于0
  //     const isQueryForm = this.queryFormItemCount ? this.queryFormItemCount < 3 && this.queryFormItemCount > 0 :
  //       queryFormCount < 3 && queryFormCount > 0 && queryForm && styleType === 'base';

  //     return isQueryForm ? (
  //       <div class="e-cl__table-oper-bar">
  //         <div class="e-cl__table-oper">
  //           { queryForm }
  //           { queryFormOper ? (queryFormOper) : ( <e-button-n size="small" type="primary" icon="icon-C-C5" onClick={ self.$emit.bind(self, "query") }/> ) }
  //         </div>
  //       </div>
  //     ) : undefined
  //   },
  //   // 列表浮动顶部条
  //   tableFloatTopBarCom() {
  //     const self = this;
  //     const { fullScreenScroll, queryTableHeaderCom, } = self;

  //     return fullScreenScroll ? 
  //       (
  //         <div class="e-cl__table-heard" ref="tableHeard">
  //           { queryTableHeaderCom() }
  //         </div>
  //       ) : undefined
  //   },
  //   // 列表浮动底部条
  //   tableFloatBottomBarCom() {
  //     const self = this;
  //     const { fullScreenScroll, scrollConfig, formatTableBottom } = self;

  //     // 是否显示低栏
  //     const isDisplay = scrollConfig?.bottom;

  //     return fullScreenScroll ? 
  //       (
  //         <div class="e-cl__table-floor" ref="tableFooter" style={ isDisplay ? 'display: none' : '' }>
  //           <div class="table-scroll" ref="tableScroll">
  //             <div class="table-scroll-bar" ref="tableScrollBar"/>
  //           </div>
  //           { formatTableBottom() }
  //         </div>
  //       ) : undefined
  //   },
  //   formatTableBottom() {
  //     const self = this;
  //     const { formatScopedSlot, slotNames, formatTableOper } = self;
  //     // 列表操作
  //     const tableOper = formatScopedSlot(slotNames.tableOper, {
  //       buttonAttr: { size: "mini", type: "primary", minWidth: true },
  //     });
  //     // 列表操作B
  //     const tableOperB = formatScopedSlot(slotNames.tableOperB, {
  //       buttonAttr: { size: "mini", type: "primary", minWidth: true },
  //     });
  //     // 列表分页
  //     const tablePage = formatScopedSlot(slotNames.tablePage, {
  //       tablePageAttr: {
  //         background: true,
  //         pageSizes: [10, 20, 50, 100],
  //         layout: "total, sizes, prev, pager, next, jumper",
  //       },
  //     });

  //     return tablePage || tableOper || tableOperB ?
  //       (
  //         <div class="e-cl__table-bottom-bar">
  //           {formatTableOper(tableOper, tableOperB)}
  //           <div class="e-cl__tbb-page">{ tablePage }</div>
  //         </div>
  //       )
  //     : undefined;
  //   },
  //   formatTableOper(tableOper, tableOperB) {
  //     const newTableOper = tableOper?.filter(item=> item?.componentOptions?.Ctor?.extendOptions?.name === "EButtonN");
  //     const commandClick = (index)=> {
  //       newTableOper?.[index]?.componentOptions?.listeners?.click();
  //     }

  //     let tableOperDoc = newTableOper;
  //     if(newTableOper?.length > 2) {
  //       let displayButton =  newTableOper.splice(0, 2);
  //       tableOperDoc = (
  //         <div>
  //           {displayButton}
  //           <el-dropdown trigger="click" onCommand={ (e)=> commandClick(e) }>
  //             <e-button-n size="mini" type="defalut" icon="icon-F-F18"  style="margin-left: 10px;"/>
  //             <el-dropdown-menu slot="dropdown">
  //               {
  //                 newTableOper.map((item, index)=> (
  //                   <el-dropdown-item command={ index } disabled={item.componentOptions.propsData.disabled || item.componentOptions.propsData.loading}
  //                     icon={item.componentOptions.propsData.loading ? "el-icon-loading" : "iconfont "+item.componentOptions.propsData.icon}>
  //                     {item.componentOptions.children[0].text}</el-dropdown-item>
  //                 ))
  //               }
  //             </el-dropdown-menu>
  //           </el-dropdown>
  //         </div>
  //       )
  //     }
  //     return (
  //       <div class="e-cl__tbb-oper">
  //         {tableOperDoc}
  //         <div style={ tableOperDoc ? "margin-left: 20px;" : "" }>{tableOperB}</div>
  //       </div>
  //     );
  //   },
  //   // 查询列表
  //   queryTableCom() {
  //     const self = this;
  //     const { formatScopedSlot, slotNames, fullScreenScroll, formatTableBottom, queryTableBodyCom, tableOperBarCom, tableFloatTopBarCom, tableFloatBottomBarCom, getFormItemCount, queryFormItemCount } = self;
  //     // 查询条件
  //     const queryForm = formatScopedSlot(slotNames.queryForm);
  //     // 列表操作
  //     const tableOper = formatScopedSlot(slotNames.tableOper, {
  //       buttonAttr: { size: "mini", type: "primary", minWidth: true },
  //     });
  //     // 列表操作B
  //     const tableOperB = formatScopedSlot(slotNames.tableOperB, {
  //       buttonAttr: { size: "mini", type: "primary", minWidth: true },
  //     });
  //     // 查询列表
  //     const queryTable = formatScopedSlot(slotNames.queryTable);
  //     // 列表分页
  //     const tablePage = formatScopedSlot(slotNames.tablePage, {
  //       tablePageAttr: {
  //         background: true,
  //         pageSizes: [10, 20, 50, 100],
  //         layout: "total, sizes, prev, pager, next, jumper",
  //       },
  //     });

  //     // 获取查询条件个数
  //     const queryFormCount = getFormItemCount();
  //     // 询条件数量小于3大于0
  //     const isQueryForm = queryFormItemCount ? queryFormItemCount < 3 && queryFormItemCount > 0 :
  //       queryFormCount < 3 && queryFormCount > 0 && queryForm;
  //     // 
  //     const isModule = isQueryForm || tableOper || tableOperB || queryTable || tablePage;

  //     return isModule ? (
  //       <div class="e-cl__table" ref="TableContainer" style={ fullScreenScroll ? 'min-height: auto;' : ''}>
  //         { tableOperBarCom() }
  //         { queryTable ? <div class="e-cl__table-table" style={fullScreenScroll ? '' : 'flex: 1; min-height: 0;'}>{ queryTableBodyCom() }</div> : undefined }
  //         { formatTableBottom() }
  //         { tableFloatTopBarCom() }
  //         { tableFloatBottomBarCom() }
  //       </div>
  //     ) : undefined;
  //   },
  //   getParent(self, useType) {
  //     if(!self || !useType) { return; }

  //     let tag;
  //     // 单一组件
  //     if(useType === 'inner') {
  //       tag = "e-container-list-n";
  //     }
  //     // 多模块
  //     else if(useType === 'outside') {
  //       tag = "e-container-list-item-n";
  //     } else {
  //       return;
  //     }

  //     if(self.$vnode.componentOptions.tag === tag && self.$parent.$refs) {
  //       self.$parent.$refs[this.tableBodyRef] = this.$refs?.[this.tableBodyRef];
  //     } else {
  //       this.getParent(self?.$parent, useType);
  //     }
  //   },
  // }
}