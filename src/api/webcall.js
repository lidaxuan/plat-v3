/*
 * @Description:
 * @Author: 李大玄
 * @Date: 2023/10/31 4:30 PM
 * @FilePath: /web-client/src/api/webcall.js
 * @LastEditors: 段丽军
 * @LastEditTime: 2023-11-20 15:00:31
*/

export default {
  chatGetInfo: {
    url: "/chat/get",
    method: "get"
  },
  getGuideFlag: {
    url: "/douyin/get-auth-count",
    method: "get"
  },
  // 访客名片保存
  visitorinfoSave: {
    url: "/visitorinfo/save",
    method: "post"
  },
  // 访客名片字段
  visitorinfoFields: {
    url: "/visitorinfo/get-col-self",
    method: "get"
  },
  // 常用语树
  commonWordTree: {
    url: "/common-word/list",
    method: "post"
  },
  // 常用语搜索
  commonWordSearch: {
    url: "/common-word/search",
    method: "post"
  },
  visitorinfoGet: {
    url: "/visitorinfo/get",
    method: "get"
  },
  skillGroupQunfengInit: {
    url: "/skill-group/qunfeng-init",
    method: "post"
  },
  userSettinGet: {
    url: "/user/setting/get",
    method: "post"
  },
  userSettinSave: {
    url: "/user/setting/save",
    method: "post"
  },
  chatVisitorHistoryMsg: {
    url: "/chat/visitor-history-msg",
    method: "post"
  },
  chatHistoryRecent: {
    url: "/chat/history-recent",
    method: "post"
  },
  qunfengInit: {
    url: "/qunfeng/init",
    method: "post"
  },
  chargeCurrentInfo: {
    url: "/charge/current-info",
    method: "post"
  },
  metricsCompare: {
    url: "/chat-analyze/metrics-compare",
    method: "post"
  },
  changeRobotStatusOnline: {
    url: "/robot/online",
    method: "post"
  },
  changeRobotStatusOffline: {
    url: "/robot/offline",
    method: "post"
  },
  robotInfo: {
    url: "/robot/info",
    method: "post"
  },
  robotSettingGet: {
    url: "/user/robot-setting/get",
    method: "post"
  },
  robotSettingSave: {
    url: "/user/robot-setting/save",
    method: "post"
  },
  companyGetGlobalConf: {
    url: "/company/get-global-conf",
    method: "post"
  },
  skillGroupList: {
    url: "/skill-group/list",
    method: "post"
  },
  visitorCountSameVisitorFilter: {
    url: "/visitor/count-same-visitor-filter",
    method: "post"
  },
  visitorAddVisitorFilter: {
    url: "/visitor/add-visitor-filter",
    method: "post"
  },
  webcallUserGetSetting: {
    url: "/webcall-user/get-setting",
    method: "post"
  },
  userAutoReplyDetail: {
    url: "/user-auto-reply/detail",
    method: "post"
  },
  userAutoReplySave: {
    url: "/user-auto-reply/save",
    method: "post"
  },
  commonWordAdd: {
    url: "/common-word/add",
    method: "post"
  },
  commonWordUpdate: {
    url: "/common-word/update",
    method: "post"
  },
  commonWordDelete: {
    url: "/common-word/delete",
    method: "post"
  },
  commonWordBatchDelete: {
    url: "/common-word/batch-delete",
    method: "post"
  },
  externalXhsSocialCardList: {
    url: "/external/xhs-card-list",
    method: "post"
  },
  externalKuaishouCardList: {
    url: "/external/kuaishou-card-list",
    method: "post"
  },
  operateCardList: {
    url: "/operate/card/list",
    method: "post"
  },
  aiTagList: {
    url: "/ai-tag/list",
    method: "post"
  },
  chatVisitorChatCollect: {
    url: '/chat/visitor-chat-collect',
    method: "post"
  },
  chatGetAiTag: {
    url: '/chat/get-ai-tag',
    method: "post"
  },
  aiTagTagging: {
    url: '/ai-tag/tagging',
    method: "post"
  },
};
