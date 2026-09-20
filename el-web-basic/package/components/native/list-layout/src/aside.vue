<!--
 * @Author: 段丽军
 * @Date: 2022-10-09 17:00:05
 * @LastEditTime: 2023-11-02 15:49:44
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /web_basic_v2/package/components/native/list-layout/src/aside.vue
-->
<script lang="jsx">
import getSlot from './mixins/getSlot.js';
import actionAsyncMethod from './mixins/actionAsyncMethod.js';
import scrollUtil from './utils/scrollUtil.js';
export default {
  mixins: [getSlot, actionAsyncMethod],
  data() {
    return {
      tipsFold: true,
      isNull: true,
    };
  },
  mounted() {
    this.$nextTick(() => {
      // 设置内容区域高度
      this.computeHeight();

      // 初始化「table」浮动相关
      this.actionAsyncMethod(scrollUtil?.addWatch?.bind(scrollUtil, 'change', ({ parentTop }) => {

        const parent = this.$refs.parent;
        const container = this.$refs.container;

        // 设置容器部分是否浮动
        const { top: parentTop2, width: parentWidth2 } = parent.getBoundingClientRect();
        if(parentTop2 < parentTop) {
          container.style.position = 'fixed';
          container.style.top = parentTop+'px';
          container.style.width = parentWidth2+'px';

          // 设置内容区域高度
          this.computeHeight();

        } else {
          container.style.position = null;
          container.style.top = null;
          container.style.width = null;

          // 设置内容区域高度
          this.computeHeight();
        }
      }));

      // // 初始化「table」浮动相关
      // this.actionAsyncMethod(scrollUtil?.addWatch?.bind(scrollUtil, 'scroll', ({ event }) => {
      //   if(event.target.scrollTop === 0) {
      //     // 设置内容区域高度
      //     this.computeHeight();
      //   }
      // }));
    });
  },
  methods: {
    // 设置内容区域高度
    computeHeight() {
      const container = this.$refs.container;
      if(container) {
        const { top: containerTop } = container.getBoundingClientRect();
        const { clientHeight } = document.documentElement || document.body || { clientHeight: 0 };
        container.style.height = (clientHeight - containerTop)+'px';
      }
    },
    resize () {
      const parent = this.$refs.parent;
      const container = this.$refs.container;
      if(parent && container) {
        const { width } = container.getBoundingClientRect();
        parent.style.minWidth = width+'px';
        this.computeHeight();
      }
    },
  },
  render() {
    const { getSlot, resize } = this;
    const asideSlot = getSlot('aside');
    const asideTopSlot = getSlot('aside-top');
    this.isNull = !!asideSlot || !!asideTopSlot;
    return (
      <div class="container-parent" ref="parent" v-resize={ (e)=> resize(e) }>
        <div class="e-list-layout-container" ref="container">
          <div class="top">{asideTopSlot}</div>
          <div class="content">{asideSlot}</div>
        </div>
      </div>
    );
  }
}
</script>
<style lang="scss" scoped>
  .container-parent {
    min-width: 200px;
    margin-right: 10px;
    .e-list-layout-container {
      padding: 10px;
      background-color: white;
      display: flex;
      flex-direction: column;
      .content {
        margin-top: 10px;
        flex: 1;
        min-height: 0;
        // overflow: auto;
      }
    }
  }
</style>