/*
 * @Author: 段丽军
 * @Date: 2022-06-24 14:32:01
 * @LastEditTime: 2022-06-27 11:44:22
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/container-list-item/src/mainContent/baseForm.js
 */
export default {
  // methods: {
  //   // 查询表单
  //   baseQueryFormCom() {
  //     const self = this;
  //     const { formatScopedSlot, slotNames, listSlotNames, queryFormItemCount } = self;

  //     let slotForm, slotFormOper;
  //     let comName = self?.$options?.name;
  //     if(comName === "EContainerListN") {
  //       slotForm = listSlotNames.moduleQueryForm;
  //       slotFormOper = listSlotNames.moduleQueryFormOper;
  //     }
  //     else if(comName === "EContainerListItemN") {
  //       slotForm = slotNames.queryForm;
  //       slotFormOper = slotNames.queryFormOper;
  //     } else {
  //       console.error("组件使用错误", self.$options);
  //       return;
  //     }

  //     const queryForm = formatScopedSlot(slotForm, {
  //       queryFormAttr: { size: "small", ref: "queryForm", labelWidth: "0" },
  //     });
  //     const queryFormCount = this.baseGetFormItemCount(slotForm); // 实际查询条件个数
  //     const isQueryForm = queryFormItemCount ? queryFormItemCount >= 3 : queryFormCount >= 3 && queryForm;
  //     const isQueryFormFold = queryFormItemCount ? queryFormItemCount > 3 : queryFormCount > 3 && queryForm;

  //     const displayCondition = self.displayCondition;

  //     const change = ()=> () => self.displayCondition = !self.displayCondition;

  //     // 查询表单操作-插槽
  //     const queryFormOper = formatScopedSlot(slotFormOper, {
  //       shape: isQueryForm && isQueryFormFold ? "complete" : "simple", // 形态：complete 完整；simple 简单；basic 基本；
  //       buttonAttr: { size: "small" },
  //       foldAttr: {
  //         button: {
  //           type: "text-primary",
  //           icon: "icon-F-F9",
  //           iconPosition: "right",
  //           style: "line-height: 32px;",
  //         },
  //         isfold: self.displayCondition,
  //         foldCall: change(),
  //       },
  //     });

  //     let height = Math.ceil(queryForm?.[0]?.componentOptions?.children?.length / 3) * 44;

  //     console.log("baseQueryFormCom ------------ end", height);
  //     // 查询表单
  //     return isQueryForm ? (
  //       <div class="e-cl__condition e-cl__condition-base" style={displayCondition ? 'height: 44px;' :`height: ${height}px;`}>
  //         {queryForm}
  //         <div class="e-cl__condition-oper">
  //           {queryFormOper ? (queryFormOper) : (<e-button-n size="small" type="primary" onClick={self.$emit.bind(self, "query")}>查询</e-button-n>)}
  //           {queryFormOper ? (void 0) : (<e-button-n size="small" onClick={self.$emit.bind(self, "reset")}>重置</e-button-n>)}
  //           {!queryFormOper && isQueryFormFold ? (
  //             <e-button-n type="text-primary" onClick={change()} icon="icon-F-F9" icon-position="right" style="line-height: 32px; float: right;" isFold={displayCondition}/>
  //           ) : (void 0)}
  //         </div>
  //       </div>
  //     ) : undefined;
  //   },
  //   baseGetFormItemCount(slotForm) {
  //     const { formatScopedSlot } = this;
  //     const forms = formatScopedSlot(slotForm);
    
  //     let form = null;
  //     if(Object.prototype.toString.call(forms).includes("Array")) {
  //       form = forms.find(item=> item?.componentOptions?.tag === 'el-form');
  //     } else {
  //       if(forms?.componentOptions?.tag === 'el-form') {
  //         form = forms;
  //       }
  //     }
  //     return form?.componentOptions?.children?.length || 0;
  //   }
  // }
}