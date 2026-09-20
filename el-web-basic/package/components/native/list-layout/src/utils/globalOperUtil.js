/*
 * @Author: 段丽军
 * @Date: 2022-09-19 14:50:57
 * @LastEditTime: 2022-10-20 15:08:38
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/list-layout/src/utils/globalOperUtil.js
 */
export const attrs = {
  ltfi: 'LAYOUTTOFORMINIT', // layout to form init 事件
};

export const gou =  {
  globalOperSlot: null,
  displayType: 'list',
  initS: false,
  init ({ globalOperSlot, displayType }) {
    this.globalOperSlot = globalOperSlot;
    this.displayType = displayType;
    this.initS = true;
    this.actionWatch(attrs.ltfi, {globalOperSlot, displayType, callback: ()=> {
      this.initS = false;
    }});
    this.initTime();
  },
  initTime() {
    setTimeout(()=> {
      if(this.initS) {
        const { globalOperSlot, displayType } = this;
        this.actionWatch(attrs.ltfi, {globalOperSlot, displayType, callback: ()=> {
          this.initS = false;
        }});
        this.initTime();
      }
    }, 100);
  },
  // tableScrollLeft: null,
  // bbc: false,
  // bodyWidth: null,
  watchFun: {},
  // setTableScrollLeft(tableScrollLeft) {
  //   if(this.tableScrollLeft === tableScrollLeft) {
  //     return;
  //   }
  //   this.tableScrollLeft = tableScrollLeft;
  //   this.actionWatch(attrs.ttbs, {tableScrollLeft});
  // },
  // setBBarScrollLeft(tableScrollLeft) {
  //   if(this.tableScrollLeft === tableScrollLeft) {
  //     return;
  //   }
  //   this.tableScrollLeft = tableScrollLeft;
  //   this.actionWatch(attrs.btts, {tableScrollLeft});
  // },
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

    this.watchFun[attr].forEach(item=> item(params));
  },
  // // 
  // setButtomBarConfig({bodyWidth}) {
  //   this.bbc = true;
  //   this.bodyWidth = bodyWidth;
  //   this.actionBBC();
  //   this.setBBCTime();
  // },
  // actionBBC() {
  //   this.actionWatch(attrs.ttbi, {bodyWidth: this.bodyWidth, callback: ()=> {
  //     this.bbc = false;
  //   }});
  // },
  // setBBCTime() {
  //   setTimeout(()=> {
  //     if(this.bbc) {
  //       this.setBBCTime();
  //     }
  //   }, 100);
  // },
};