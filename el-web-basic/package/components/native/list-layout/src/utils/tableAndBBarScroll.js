/*
 * @Author: 段丽军
 * @Date: 2022-09-15 15:44:49
 * @LastEditTime: 2022-09-28 16:47:23
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/list-layout/src/utils/tableAndBBarScroll.js
 */
export const attrs = {
  ttbs: 'TABLETOBBARSCROLL', // table to bottom-bar scroll 事件
  btts: 'BBARTOTABLESCROLL', // bottom-bar to table scroll 事件
  ttbi: 'TABLETOBBARINIT', // table to bottom-bar init 事件
};

export const tbs = {
  tableScrollLeft: null,
  bbc: false,
  bodyWidth: null,
  watchFun: {},
  destroyed() {
    this.tableScrollLeft = null;
    this.bbc = false;
    this.bodyWidth = null;
    this.watchFun = {};
  },
  setTableScrollLeft(tableScrollLeft) {
    if(this.tableScrollLeft === tableScrollLeft) {
      return;
    }
    this.tableScrollLeft = tableScrollLeft;
    this.actionWatch(attrs.ttbs, {tableScrollLeft});
  },
  setBBarScrollLeft(tableScrollLeft) {
    if(this.tableScrollLeft === tableScrollLeft) {
      return;
    }
    this.tableScrollLeft = tableScrollLeft;
    this.actionWatch(attrs.btts, {tableScrollLeft});
  },
  isExixts(attr) {
    for(const key in attrs) {
      if(attrs[key] === attr) {
        return true;
      }
    }
    return false;
  },
  addWatch(attr, watchFun) {
    if(!this.isExixts(attr)) {
      console.error(`监听类型「${attr}」不存在！`);
      return;
    }

    if(!this.watchFun[attr] || this.watchFun[attr].length === 0) {
      this.watchFun[attr] = [watchFun];
    } else {
      this.watchFun[attr].push(watchFun);
    }
  },
  actionWatch(attr, params) {
    if(!this.watchFun[attr] || this.watchFun[attr].length === 0) {
      return;
    }
    this.watchFun[attr].forEach(item=> {
      item(params);
    });
  },
  // 
  setButtomBarConfig({bodyWidth}) {
    this.bbc = true;
    this.bodyWidth = bodyWidth;
    this.actionBBC();
    this.setBBCTime();
  },
  actionBBC() {
    this.actionWatch(attrs.ttbi, {bodyWidth: this.bodyWidth, callback: ()=> {
      this.bbc = false;
    }});
  },
  setBBCTime() {
    setTimeout(()=> {
      if(this.bbc) {
        this.actionBBC();
        this.setBBCTime();
      }
    }, 100);
  },
};