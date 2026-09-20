/*
 * @Author: 段丽军
 * @Date: 2022-06-24 14:13:01
 * @LastEditTime: 2022-06-25 01:27:45
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/container-list-item/src/mainContent/bossForm.js
 */
export default {
  // // 查询表单
  // bossQueryFormCom() {
  //   const self = this;
  //   const { formatScopedSlot, slotNames, listSlotNames } = self;

  //   let slotForm, slotFormOper;
  //   let comName = self.$options?.name;
  //   if(comName === "EContainerListN") {
  //     slotForm = listSlotNames.moduleQueryForm;
  //     slotFormOper = listSlotNames.moduleQueryFormOper;
  //   }
  //   else if(comName === "EContainerListItemN") {
  //     slotForm = slotNames.queryForm;
  //     slotFormOper = slotNames.queryFormOper;
  //   } else {
  //     console.error("组件使用错误", self.$options);
  //     return;
  //   }

  //   const queryForm = formatScopedSlot(slotForm, {
  //     queryFormAttr: { size: "small", ref: "queryForm", labelWidth: "0" },
  //   });
  //   const queryFormCount = bossGetFormItemCount(slotForm); // 实际查询条件个数
  //   const isQueryFormFold = queryFormCount > 5 && queryForm;

  //   const displayCondition = self.displayCondition;

  //   const change = ()=> () => self.displayCondition = !self.displayCondition;

  //   // 查询表单操作-插槽
  //   const queryFormOper = formatScopedSlot(slotFormOper, {
  //     buttonAttr: { size: "small" },
  //     foldAttr: {
  //       button: { type: "text-primary", icon: "icon-F-F9", iconPosition: "right", style: "line-height: 32px;" },
  //       isfold: self.displayCondition,
  //       foldCall: change(),
  //     },
  //   });

  //   let row = queryFormCount / 6;
  //   let height = (queryFormCount % 6 === 0 ? row+1 : Math.ceil(row)) * 44;
  //   let bottom = 11, right = 2;
  //   let operStyle = `bottom: ${bottom}px; right: ${right}px;`;
  //   if(queryFormCount <= 4) {
  //     operStyle = `bottom: ${bottom}px; left: calc(100% / 6 * ${queryFormCount});`;
  //   }
  //   // 查询表单
  //   return queryForm ? (
  //     <div class="e-cl__condition e-cl__condition-boss" style={displayCondition ? 'height: 44px;' :`height: ${height}px;`}>
  //       {queryForm}
  //       <div class="e-cl__condition-oper" style={operStyle}>
  //         {queryFormOper ? (queryFormOper) : (<e-button-n size="small" type="primary" onClick={self.$emit.bind(self, "query")}>查询</e-button-n>)}
  //         {queryFormOper ? (void 0) : (<e-button-n size="small" onClick={self.$emit.bind(self, "reset")}>重置</e-button-n>)}
  //         {!queryFormOper && isQueryFormFold ? (
  //           <e-button-n type="text-primary" onClick={change()} icon="icon-F-F9" icon-position="right" style="line-height: 32px; float: right;" isFold={displayCondition}/>
  //         ) : (void 0)}
  //       </div>
  //     </div>
  //   ): null;
  // },
  // bossGetFormItemCount(slotForm) {
  //   const { formatScopedSlot, slotNames } = this;
  //   const forms = formatScopedSlot(slotForm);
  
  //   let form = null;
  //   if(Object.prototype.toString.call(forms).includes("Array")) {
  //     form = forms.find(item=> item?.componentOptions?.tag === 'el-form');
  //   } else {
  //     if(forms?.componentOptions?.tag === 'el-form') {
  //       form = forms;
  //     }
  //   }
  //   return form?.componentOptions?.children.reduce((a, b)=> {
  //     let countB = 1;
  //     if(b?.data?.attrs?.col && !isNaN(b.data.attrs.col)) {
  //       let col = parseInt(b.data.attrs.col);
  //       countB = col > 6 ? 6 : col;
  //     }
  //     return a + countB;
  //   }, 0) || 0;
  // }
}