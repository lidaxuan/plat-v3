/*
 * @Author: 段丽军
 * @Date: 2022-06-24 14:00:06
 * @LastEditTime: 2022-06-27 12:44:44
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/container-list-item/src/mainContent/tips.js
 */
/*
 * @Author: 段丽军
 * @Date: 2022-06-24 11:48:42
 * @LastEditTime: 2022-06-24 11:54:27
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/container-list-item/src/form.js
 */
export default {
  props: {
    defaultTipsFold: {
      type: Boolean,
      default: null,
    },
  },
  data() {
    return {
      inner_tipsFold: null
    };
  },
  computed: {
    tipsFoldComputed: {
      get: function() {
        if(!this.isEmpty(this.inner_tipsFold)) {
          return this.inner_tipsFold;
        }
        if(!this.isEmpty(this.defaultTipsFold)) {
          return this.defaultTipsFold;
        }
        return true;
      },
      set: function(val) {
        this.inner_tipsFold = val;
      }
    },
  },
  // methods: {
  //   // 提示信息
  //   tipsCom() {
  //     const self = this;
  //     let { tipsFoldComputed, formatScopedSlot, slotNames } = self;
  //     const tips = formatScopedSlot(slotNames.tips);
  //     const change = ()=> () => self.tipsFoldComputed = !tipsFoldComputed;
  //     return tips ? (
  //       <div class="e-cli__tips">
  //         <div class="e-cli__tips-content" style={`max-height: ${tipsFoldComputed ? 45 : 1000}px;`}>
  //           <e-button-n type="text-primary" onClick={ change() } icon="icon-F-F9" icon-position="right" isFold={tipsFoldComputed} style="line-height: 14px;"/>
  //           {tips}
  //           <div style="background-color: #F1F4FA; width: calc(100% - 32px); position: absolute; bottom: 0; height: 10px;" />
  //         </div>
  //       </div>
  //     ) : undefined;
  //   },
  // }
}