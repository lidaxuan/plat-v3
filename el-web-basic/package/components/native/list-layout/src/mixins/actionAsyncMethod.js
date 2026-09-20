/*
 * @Author: 段丽军
 * @Date: 2022-09-15 15:12:12
 * @LastEditTime: 2022-09-15 15:12:33
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/list-layout/src/mixins/actionAsyncMethod.js
 */
export default {
  //方法集合
  methods: {
    actionAsyncMethod(method, time) {
      setTimeout(() => {
        if(method) {
          method();
        } else {
          this.actionAsyncMethod();
        }
      }, time || 100);
    },
  }
}