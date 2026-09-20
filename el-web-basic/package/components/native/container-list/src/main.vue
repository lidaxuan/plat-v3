<!--
 * @Author: your name
 * @Date: 2021-05-21 14:10:32
 * @LastEditTime: 2022-07-15 17:11:21
 * @LastEditors: 段丽军
 * @Description: In User Settings Edit
 * @FilePath: /el-web-basic/package/components/native/container-list/src/main.vue
-->
<script>
import EContainerListItemN from '../../container-list-item/src/main.vue';
import formCom from '../../container-list-item/src/mainContent/form';
export default {
  name: 'EContainerListN',
  components: {
    EContainerListItemN,
  },
  // provide() {
  //   return {
  //     eContainerList: this
  //   };
  // },
  mixins: [formCom],
  // provide() {
  //   return {
  //     eContainerListNBgc: this.background,
  //     eContainerListNPdg: this.padding,
  //   }
  // },
  props: {
    tabs: {
      type: Array,
      default: _=> [],
    },
    activeName: {
      type: String,
      default: '',
    },
    styleType: {
      type: String,
      default: null,
    },
    background: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: Boolean,
      default: false,
    },
    queryFormItemCount: {
      type: Number,
      default: void 0,
    },
    defaultTipsFold: {
      type: Boolean,
      default: null,
    },
    fullScreenScroll: {
      type: Boolean,
      default: undefined,
    },
  },
  data() {
    return {
      listSlotNames: {
        globalOper: "global-oper", // 默认
        tab: "tab", // 默认
        moduleQueryForm: "module-query-form", // 默认
        moduleTop: "module-top", // 默认
        module: "module", // 默认
      },
      itemSlotNames: {
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
      newActiveName: null,
      displayCondition: true,
      tableScrollDisplay: false,
      // 滚动相关（共子模块使用）
      scrollConfig: { bottom: true, top: false },
      scrollTime: null,
      containerElement: null,
    };
  },
  watch: {
    activeName: {
      handler(nv) {
        if(nv !== this.newActiveName) {
          this.newActiveName = nv;
        }
      },
      immediate: true,
    },
    newActiveName(nv) {
      this.$emit('update:activeName', nv);
    }
  },
  computed: {
    moduleTopStyle() {
      let styleStr = '';
      if(this.padding) {
        styleStr += 'padding: 10px 24px;';
      }
      if(this.background) {
        styleStr += 'background-color: white;';
      }
      return styleStr;
    },
    moduleStyle() {
      let styleStr = '';
      if(this.padding) {
        styleStr += 'padding: 10px 24px;';
      }
      if(this.background) {
        styleStr += 'background-color: white;';
      }
      return styleStr;
    },
    moduleQueryFormStyle () {
      return '';
    },
    fullScreenScrollComputed() {
      return (this.fullScreenScroll !== undefined ? this.fullScreenScroll : this.$EASYLIAO.fullScreenScroll) || false;
    },
    styleTypeComputed() {
      return this.styleType || this.$EASYLIAO.styleType || "base";
    },
  },
  mounted() {
    window.onresize = ()=> {
      this.preventShaking();
    }
    this.containerElement = this.getLayout(this.$el);
    this.containerElement.onscroll = ()=> {
      this.preventShaking();
    }
  },
  activated() {
    this.containerElement = this.getLayout(this.$el);
    this.containerElement.onscroll = ()=> {
      this.preventShaking();
    }
  },
  methods: {
    getLayout(element) {
      if(element.parentElement.id === "layout-main") {
        return element.parentElement;
      } else {
        return this.getLayout(element.parentElement);
      }
    },
    preventShaking() {
      if(this.scrollTime) { clearTimeout(this.scrollTime) }
      this.scrollTime = setTimeout(()=> {
        this.actionComputed(this.containerElement)
      }, 200)
    },
    actionComputed(target) {
      if(!this.fullScreenScrollComputed || !target) { return; }
      let childrenTarget = this.getElementsByClassName('e-cl__table-table', target.children);
      if(!childrenTarget) { return; }

      let { top: topPx, bottom: bottomPx } = target?.getBoundingClientRect();
      let { scrollTop, scrollHeight, offsetHeight } = target;
      let childrenTargetTop = childrenTarget?.getBoundingClientRect().top;

      let top = childrenTargetTop - topPx <= 0;
      let bottom = scrollHeight === scrollTop + offsetHeight;


      if(top != this.scrollConfig.top || bottom != this.scrollConfig.bottom) {
        this.scrollConfig = { top, topPx, bottom, bottomPx };
      }
    },
    getElementsByClassName(className, children) {
      for (var i = 0; i < children.length; i++) {
        let item = children[i]
        if(item?.className?.includes && item?.className?.includes(className)) { return item; }
        else {
          let result = this.getElementsByClassName(className, item.children);
          if(result) { return result; }
        }
      }
    },
    getMaxHeight() {
      if(this.$scopedSlots['module-query-form']) {
        let queryForm = this.$scopedSlots['module-query-form']();
        return Math.ceil(queryForm[0]?.componentOptions?.children?.length / 3) * 44;
      }
      // return 0;
    },

    globalOperCom() {
      const { formatScopedSlot, listSlotNames } = this;
      const globalOper = formatScopedSlot(listSlotNames.globalOper, { buttonAttr: { size: 'medium', type: 'primary', minWidth: true, } })
      // return globalOper ? (<div class="e-cl__global-oper">{globalOper}</div>) : null;
    },
    tabCom() {
      let { formatScopedSlot, listSlotNames, tabs, newActiveName } = this;
      const isTabs = tabs && tabs.length > 0;
      const tab = formatScopedSlot(listSlotNames.tab);

      const tabChagne = (e)=> this.newActiveName = e;
      return isTabs || tab ? (
        <div class="e-cl__tab">
          { tab ? tab : (
            <el-tabs value={newActiveName} onInput={value=> tabChagne(value) }>
              { tabs.map((item, index)=> (
                <el-tab-pane key={index} label={item.label} name={item.value}>
                  { item.tips ? (
                    <span slot='label'>
                      {item.label}
                      <el-tooltip placement="top">
                        <div slot="content">{item.tips}</div>
                        <strong class="el-icon-info" style="color: #909399;"/>
                      </el-tooltip>
                    </span>
                  ) : null }
                </el-tab-pane>
              ))}
            </el-tabs>
          )}
        </div>
      ) : null;
    },
    moduleTopCom() {
      const { formatScopedSlot, listSlotNames, moduleTopStyle } = this;
      const moduleTop = formatScopedSlot(listSlotNames.moduleTop, { buttonAttr: { size: 'medium', type: 'primary', minWidth: true, } })
      return moduleTop ? (<div class="e-cl__module-top" style={moduleTopStyle}>{moduleTop}</div>) : null;
    },
    ecilComp() {
      const self = this;
      const { formatScopedSlot, listSlotNames, itemSlotNames, moduleStyle, defaultTipsFold, queryFormItemCount, background, padding,
        fullScreenScrollComputed, styleTypeComputed, scrollConfig, preventShaking } = self;

      const bindValue = { defaultTipsFold, queryFormItemCount, background, padding, fullScreenScroll: fullScreenScrollComputed,
        styleType: styleTypeComputed, scrollConfig, preventShaking };
      const module = formatScopedSlot(listSlotNames.module, bindValue);

      const scopedSlots = {};
      for(const key in itemSlotNames) {
        scopedSlots[itemSlotNames[key]] = props=> formatScopedSlot(itemSlotNames[key], props);
      }

      return (
        <div class="e-cl__module" style={moduleStyle}>
          {module ? module : (
            <EContainerListItemN
              onQuery={self.$emit.bind(self, 'query')}
              onReset={self.$emit.bind(self, 'reset')}
              ref="EContainerListItemN"
              useType="inner"
              defaultTipsFold={defaultTipsFold}
              queryFormItemCount={queryFormItemCount}
              background={background}
              padding={padding}
              fullScreenScroll={fullScreenScrollComputed}
              styleType={styleTypeComputed}
              scrollConfig={scrollConfig}
              preventShaking={preventShaking}
              scopedSlots={scopedSlots}/>
          )}
        </div>
      );
    },
    // 格式化 作用域插槽
    formatScopedSlot(slotName, params={}) {
      return this.$scopedSlots[slotName] ? this.$scopedSlots[slotName](params) : void 0;
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

      let height = Math.ceil(queryForm?.[0]?.componentOptions?.children?.length / 3) * 44;
      // 查询表单
      return isQueryForm ? (
        <div class="e-cl__condition e-cl__condition-base" style={displayCondition ? 'height: 44px;' :`height: ${height}px;`}>
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
          isfold: self.displayCondition,
          foldCall: change(),
        },
      });

      let row = queryFormCount / 6;
      let height = (queryFormCount % 6 === 0 ? row+1 : Math.ceil(row)) * 44;
      let bottom = 11, right = 2;
      let operStyle = `bottom: ${bottom}px; right: ${right}px;`;
      if(queryFormCount <= 4) {
        operStyle = `bottom: ${bottom}px; left: calc(100% / 6 * ${queryFormCount});`;
      }
      // 查询表单
      return queryForm ? (
        <div class="e-cl__condition e-cl__condition-boss" style={displayCondition ? 'height: 44px;' :`height: ${height}px;`}>
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
      const { formatScopedSlot, slotNames } = this;
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
          let col = parseInt(b.data.attrs.col);
          countB = col > 6 ? 6 : col;
        }
        return a + countB;
      }, 0) || 0;
    }
  },
  render(h) {
    this.createElement = h;
    const { fullScreenScrollComputed, globalOperCom, tabCom, moduleTopCom, queryFormCom, ecilComp } = this;

    return (
      <div class={ fullScreenScrollComputed ? 'e-container-list-full' : 'e-container-list' }>
        {globalOperCom()}
        {tabCom()}
        {moduleTopCom()}
        {queryFormCom()}
        {ecilComp()}
      </div>
    );
  },
}
</script>

<style lang="scss" scoped>
@import '../../../../style/container-list/common.scss';
@import '../../../../style/container-list/list.scss';
</style>
