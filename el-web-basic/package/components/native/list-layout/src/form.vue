<!--
 * @Author: 段丽军
 * @Date: 2022-09-06 14:32:00
 * @LastEditTime: 2022-10-27 11:30:17
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/list-layout/src/form.vue
-->
<script lang="jsx">
import getSlot from './mixins/getSlot.js';
import actionAsyncMethod from './mixins/actionAsyncMethod.js';
import { gou as globalOperUtil, attrs as gouAttrs }  from './utils/globalOperUtil.js';
export default {
  mixins: [getSlot, actionAsyncMethod],
  props: {
    type: {
      validator(value) {
        return ['list', 'item'].includes(value)
      },
      default: 'item'
    },
    isCustomCondition: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      globalOperSlot: null,
      text: "",
      tipsFold: false, // 折叠控制变量
      // createElement: null, // 组件渲染器
      slotForm: null, // 插槽内 表单组件
    };
  },
  mounted() {
    // 注册监听，监听table组件列的总宽度。用于实现假滚动条
    this.actionAsyncMethod(globalOperUtil.addWatch.bind(globalOperUtil, gouAttrs.ltfi, ({ globalOperSlot, displayType, callback }) => {
      if(displayType  === this.type) {
        this.globalOperSlot = globalOperSlot;
      } else {
        this.globalOperSlot = null;
      }
      callback();
    }));
  },
  methods: {
    // 折叠切换
    foldChange() {
      this.tipsFold = !this.tipsFold;
      this.foldChangeUtil();
    },
    foldChangeUtil() {
      if(!this.tipsFold) {
        this.$nextTick(() => {
          if(this.$refs.formBody && this.$refs.formOper) {
            const children = this.$refs.formBody?.children?.[0]?.children;
            let itemCount = 0, firstChildCol;
            for (let i = 0; i < children.length; i++) {
              const col = children[i]?.attributes?.col?.nodeValue,
                colValue = col ? window.parseInt(col) : 1;
              itemCount += colValue;
              if(i === 0) {
                firstChildCol = colValue;
              }
            }
            const { height, width } = children?.[0]?.getBoundingClientRect() || {};
            const { height: operHeight } = this.$refs.formOper.getBoundingClientRect() || {};

            const countHeight = Math.ceil(itemCount/4)*height;
            const countLeft = itemCount%4*(width / firstChildCol);
            this.$refs.formOper.style.left = countLeft+'px';
            this.$refs.formOper.style.top = (countLeft === 0 ? countHeight : countHeight-operHeight-10)+'px';
            this.$refs.formBody.style.height = (countLeft === 0 ? countHeight+height : countHeight) +'px';
          }
        });
      } else {
        this.$refs.formBody.style.height = 'auto';
      }
    },
    // 获取「el-form」中所有的label和value的健值对集合
    formatFormLabelAndValue() {
      const { slotForm } = this;
      return slotForm?.componentOptions?.children?.map(item => this.getFormItemLabelAndValue(item)) || [];
    },
    // 获取「el-form-item」Vnode节点中的表单label值和录入框值
    getFormItemLabelAndValue(itemNode) {
      let label, value;
      label = itemNode?.componentOptions?.propsData?.label;
      let oldValue = itemNode?.componentOptions?.children?.[0].data.model.value
      value = this.isEmpty(oldValue) ? '-' : oldValue;
      return { label, value };
    },
    // 验证值为空
    isEmpty(val) {
      if(val === null || val === undefined || val === "") {
        return true;
      }
      if(val instanceof Array && val.length === 0) {
        return true;
      }
      return false;
    },
    // 渲染 表单操作按钮
    renderFormOper() {
      const { getSlot, query, reset, customCondition, isCustomCondition } = this;
      const formOper = getSlot('form-oper', {
        buttonAttr: { size: "small" },
        foldAttr: { button: { type: "text-primary", icon: "icon-F-F9", iconPosition: "right", style: "line-height: 32px;" } },
      });
      // return formOper ? <div class="form-oper" ref="formOper">{formOper}</div> : (
      //   <div class="form-oper" ref="formOper">
      //     <e-button-n type="primary" size="small" onClick={ query }>查询</e-button-n>
      //     <e-button-n type="default" size="small" onClick={ reset }>重置</e-button-n>
      //     <e-button-n size="small" onClick={ customCondition }>自定义筛选</e-button-n>
      //   </div>
      // );
      return (
        <div class="form-oper" ref="formOper">
          {formOper ? formOper : [
              (<e-button-n type="primary" size="small" onClick={ query }>查询</e-button-n>),
              (<e-button-n type="default" size="small" onClick={ reset }>重置</e-button-n>),
              isCustomCondition ? (<e-button-n size="small" onClick={ customCondition }>自定义筛选</e-button-n>) : null,
            ]
          }
        </div>
      );
      //   : (
      //   <div class="form-oper" ref="formOper">
      //     <e-button-n type="primary" size="small" onClick={ query }>查询</e-button-n>
      //     <e-button-n type="default" size="small" onClick={ reset }>重置</e-button-n>
      //     <e-button-n size="small" onClick={ customCondition }>自定义筛选</e-button-n>
      //   </div>
      // );

      // TODO: 待未来折叠 方案可行时放开
      // const { getSlot, tipsFold, foldChange } = this;
      // return formOper ? <div class="form-oper" ref="formOper">{formOper}</div> : (
      //   <div class="form-oper" ref="formOper">
      //     <e-button-n type="primary" size="small">查询</e-button-n>
      //     <e-button-n type="default" size="small">重置</e-button-n>
      //     <e-button-n size="small">自定义筛选</e-button-n>
      //     <e-button-n type="text-primary" icon="icon-F-F9" icon-position="right" onClick={ () => foldChange() }
      //       style="line-height: 32px;" isFold={tipsFold}>{`${tipsFold ? '展开' : '收起'}`}</e-button-n>
      //   </div>
      // );
    },
    // 渲染 表单内容
    renderFormBody(form) {
      const { renderFormOper, foldChangeUtil } = this;
      foldChangeUtil(); // 用于每次渲染表单时 实时刷新
      return (<div class="form-body" ref="formBody" v-resize={ ()=> foldChangeUtil() }>{form}{renderFormOper()}</div>);
    },
    // 渲染 表单Tag
    renderFormTag() {
      const { tipsFold, formatFormLabelAndValue, foldChange } = this;
      const array = formatFormLabelAndValue();
      return (
        <div class="form-tag">
          {array.map(item => <el-tag disable-transitions>{`${item.label}：${item.value}`}</el-tag>)}
          <e-button-n type="text-primary" onClick={ ()=> foldChange() } icon="icon-F-F9" icon-position="right"
            isFold={tipsFold}>展开</e-button-n>
        </div>
      );
    },
    // 渲染 全局操作按钮
    renderFormGlobalOper() {
      const { globalOperSlot } = this;
      const globalOper = globalOperSlot ? globalOperSlot({buttonAttr: { size: "small", type: 'primary' }}) : null;
      const newOper = globalOper?.filter(item=>
        ["ElButton", "EButtonN"].includes(item?.componentOptions?.Ctor?.extendOptions?.name));
      const commandClick = (index)=> {
        newOper?.[index]?.componentOptions?.listeners?.click();
      }

      let operDoc;
      if(newOper?.length > 1) {
        const displayButton =  newOper.splice(0, 1);
        operDoc = (
          <div class="global-oper">
            <el-dropdown trigger="click" onCommand={ (e)=> commandClick(e) }>
              <e-button-n size="small" icon-position="right" icon="icon-F-F9" style="margin-right: 10px;">更多</e-button-n>
              <el-dropdown-menu slot="dropdown">
                {
                  newOper.map((item, index)=> (
                    <el-dropdown-item command={ index } disabled={item.componentOptions.propsData.disabled || item.componentOptions.propsData.loading}
                      icon={item.componentOptions.propsData.loading ? "el-icon-loading" : "iconfont "+item.componentOptions.propsData.icon}>
                      {item.componentOptions.children[0].text}</el-dropdown-item>
                  ))
                }
              </el-dropdown-menu>
            </el-dropdown>
            {displayButton}
          </div>
        );
      } else {
        operDoc = newOper;
      }

      return globalOper ? (<div class="form-oper" style="width: 200px; text-align: right; padding-bottom: 10px;">{operDoc}</div>) : null;
    },
    query() {
      this.$emit('query');
    },
    reset() {
      this.$emit('reset');
    },
    customCondition() {
      this.$emit('customCondition');
    },
  },
  render() {
    // 获取插槽内元素，判断是否存存在表单组件
    // const form = this.getSlot('form', { queryFormAttr: {size: "small", labelWidth: '70px'}});
    const form = this.getSlot('form', { queryFormAttr: {size: "small", ref: "queryForm"}});
    this.slotForm = form?.find(item => item?.componentOptions?.tag === 'el-form');

    const {
      tipsFold,
      renderFormTag, // Tag
      renderFormBody, // 表单
      renderFormGlobalOper, // 全局操作
    } = this;

    const formGlobalOper = renderFormGlobalOper();

    // 判断是否存在表单组件
    // 1.存在，就格式化表单相关样式后，进行渲染
    // 2.不存在，直接渲染插槽内所有元素
    return formGlobalOper || form ? (
      <div class="e-list-layout-container form">
        <div class="form-content">
          {
            form?.some(item => item?.componentOptions?.tag === 'el-form') ?
            (tipsFold ? renderFormTag() : renderFormBody(form)) : form
          }
        </div>
        {renderFormGlobalOper()}
      </div>
    ) : null;
  }
}
</script>
<style lang="scss" scoped>
  @import '../../../../style/list-layout/form.scss';
  .e-list-layout-container {
    padding-bottom: 0!important;
    margin-bottom: 10px;
  }
  .form-body {
    position: relative;
    box-sizing: border-box;
    .form-oper {
      position: absolute;
      min-width: 225px;
    }
  }
  .global-oper {
    display: flex;
    justify-content: flex-end;
  }
</style>