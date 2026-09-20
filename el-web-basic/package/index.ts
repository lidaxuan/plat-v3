/*
 * @Author: 段丽军
 * @Date: 2021-05-21 14:17:09
 * @LastEditTime: 2022-12-21 17:50:54
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/index.js
 */

import ELEMENT from "element-ui";
import draggable from "vuedraggable";

// 组件
import EBigDataSelectBatchSp from "./components/secondary-packaging/big-data-select-batch/index.js";
import BigDataSelectSp from "./components/secondary-packaging/big-data-select/index.js";
import DrawerSp from "./components/secondary-packaging/drawer/index.js";
import SelectTreeSp from "./components/secondary-packaging/select-tree/index.js";
import SwitchSp from "./components/secondary-packaging/switch/index.js";
import TableSp from "./components/secondary-packaging/table/index.js";
import ChatRecordSp from "./components/secondary-packaging/chat-record/index.js";
import AudioPlaySp from "./components/secondary-packaging/audio-play/index.js";
import TreeSp from "./components/secondary-packaging/tree/index.js";
import DialogSp from "./components/secondary-packaging/dialog/index.js";
import DetailSp from "./components/secondary-packaging/detail/index.js";

import IconFontN from "./components/native/icon-font/index.js";
import loadIconFont from "./components/native/icon-font/src/load.js"; //
import SelectFileN from "./components/native/select-file/index.js";
import PreviewImageN from "./components/native/preview-image/index.js";
import timerN from "./components/native/timer/index.js";
import UserCenterIframeN from "./components/native/user-center-iframe/index.js";
import EImageCropperN from "./components/native/image-cropper/index.js";
import EScrollPaneN from "./components/native/scroll-pane/index.js";
import EEditorN from "./components/native/editor/index.js";
import EEmojiPicker from "./components/native/emojiPicker/index.js";
import EButtonN from "./components/native/button/index.js";
// import EContainerListN from "./components/native/container-list/index.js";
import EContainerListItemN from "./components/native/container-list-item/index.js";
import EShowResizeN from "./components/native/show-resize/index.js";
import ECountDownN from "./components/native/count-down/index.js";
import ECountToN from "./components/native/count-to/index.js";
import ECountTimeN from "./components/native/count-time/index.js";
import EListLayoutN from "./components/native/list-layout/index.js";
import EListLayoutItemN from "./components/native/list-layout-item/index.js";

// 获取指令
let directives = {};
// 自动加载该目录下的所有文件
// const files = require.context("./directives", true, /\.js$/);
// // 根据文件名组织模块对象
// files.keys().map((src) => {
//   const match = src.match(/\/(.+)\./);
//   if (match && match.length >= 1) {
//     const name = match[1];
//     // const key = _.upperFirst(name);
//     const moduleValue = files(src);
//     if (moduleValue.default) {
//       directives[name] = moduleValue.default;
//     }
//   }
// });

let components = [
  EBigDataSelectBatchSp,
  BigDataSelectSp,
  DrawerSp,
  SelectTreeSp,
  SwitchSp,
  TableSp,
  ChatRecordSp,
  AudioPlaySp,
  TreeSp,
  DialogSp,
  DetailSp,

  IconFontN,
  SelectFileN,
  PreviewImageN,
  timerN,
  UserCenterIframeN,
  EImageCropperN,
  EScrollPaneN,
  EEditorN,
  EEmojiPicker,
  EButtonN,
  // EContainerListN,
  EContainerListItemN,
  EShowResizeN,
  ECountDownN,
  ECountToN,
  ECountTimeN,
  EListLayoutN,
  EListLayoutItemN,
];

// import { bindPrototype } from "./prototype/index.js";

const install = function (vueInstance: any, opts = {}) {
  console.log("vueInstance", vueInstance, opts)
  // 注册组件
  components.forEach((component) => {
    vueInstance.component(component.name, component);
  });

  // Object.keys(directives || {}).forEach((key) => {
  //   vueInstance.directive(key, directives[key]);
  // });
  // vueInstance.prototype.$EASYLIAO = opts;
  //
  // const bindPrototype = (Vue, ELEMENT) => {
  //   Vue.prototype.$EConfirm = (content, title, options) => {
  //     const params = {
  //       customClass: "del-message-box",
  //       iconClass: "del-message-box-icon",
  //       ...options,
  //     };
  //     return ELEMENT.MessageBox.confirm(content, title, params);
  //   };
  // };

  // 修改element $confirm
  // bindPrototype(vueInstance, ELEMENT);

  // vueInstance.use(ELEMENT, opts);
  // vueInstance.component("draggable", draggable);
};

// if (typeof window !== "undefined" && window.Vue) {
//   install(window.Vue);
// }

export {
  loadIconFont,
  install,
  EBigDataSelectBatchSp,
  BigDataSelectSp,
  DrawerSp,
  SelectTreeSp,
  SwitchSp,
  TableSp,
  ChatRecordSp,
  AudioPlaySp,
  TreeSp,
  DialogSp,
  DetailSp,
  IconFontN,
  SelectFileN,
  PreviewImageN,
  timerN,
  UserCenterIframeN,
  EImageCropperN,
  EScrollPaneN,
  EEditorN,
  EEmojiPicker,
  EButtonN,
  // EContainerListN,
  EContainerListItemN,
  EShowResizeN,
  ECountDownN,
  ECountToN,
  ECountTimeN,
  EListLayoutN,
  EListLayoutItemN,
};

export default {
  version: "0.1.173",
  install,
  loadIconFont,
  EBigDataSelectBatchSp,
  BigDataSelectSp,
  DrawerSp,
  SelectTreeSp,
  SwitchSp,
  TableSp,
  ChatRecordSp,
  AudioPlaySp,
  TreeSp,
  DialogSp,
  DetailSp,

  IconFontN,
  SelectFileN,
  PreviewImageN,
  timerN,
  UserCenterIframeN,
  EImageCropperN,
  EScrollPaneN,
  EEditorN,
  EEmojiPicker,
  EButtonN,
  // EContainerListN,
  EContainerListItemN,
  EShowResizeN,
  ECountDownN,
  ECountToN,
  ECountTimeN,
  EListLayoutN,
  EListLayoutItemN,
};
