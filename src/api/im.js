/*
 * @Description:
 * @Author: 李大玄
 * @Date: 2023/10/31 4:30 PM
 * @FilePath: /hw-web-client-view/src/api/im.js
 * @LastEditors: 段丽军
 * @LastEditTime: 2023-12-12 15:15:10
*/

export default {
  updateUserStatus: {
    url: "/user/status",
    method: "post"
  },
  sendMessage: {
    url: "/chat/sendMessage",
    method: "post"
  },
  chatList: {
    url: "/chat-v2/list",
    method: "post"
  },
  eventMsgList: {
    url: "/event-msg/list",
    method: "post"
  },
  chatV2Pull: {
    url: "/chat-v2/pull",
    method: "post"
  },
  chatV2Get: {
    url: "/chat-v2/get",
    method: "post"
  },
  chatV2ChatRecord: {
    url: "/chat-v2/chat-record",
    method: "post"
  },
  getUserInfo: {
    url: "/user/info",
    method: "get"
  },
  chatFriendListDetail: {
    url: "/chat-friend/list-detail",
    method: "post"
  },
  chatGetChatRecord: {
    url: "/chat/getChatRecord",
    method: "get"
  },
  userLogin: {
    url: "/user/login",
    method: "post"
  },
  chatTakeover: { // 抢接
    url: "/chat/takeover",
    method: "post"
  },
  chatClose: { // 关闭
    url: "/chat/close",
    method: "get"
  },
  // 保存监听用户
  chatFriendAdd: {
    url: "/chat-friend/add",
    method: "post"
  },
  // 文件上传
  fileUpload: {
    url: "/file/upload",
    method: "post"
  },
  // 部门树
  deptTree: {
    url: "/dept/list-by-pid",
    method: "post"
  },
  // 部门下用户
  userListByDeptId: {
    url: "/user/list",
    method: "post"
  },
  // 用户详情
  userDetailByUserId: {
    url: "/user/detail",
    method: "post"
  },
  // 已经监听用户
  chatFriendList: {
    url: "/chat-friend/list",
    method: "post"
  },
  // 介入对话 2025年02月25日14:51:40
  intervene: {
    url: "/robot/im-stop",
    method: "post"
  },
  // 交换对话
  retrocede: {
    url: "/robot/im-start",
    method: "post"
  },
  chatV2Detail: {
    url: '/chat-v2/detail',
    method: "post"
  },
  visitorDetail: {
    url: "/visitor/detail",
    method: "post"
  },
  chatV2List: {
    url: "/chat-v2/list",
    method: "post"
  },
  userPermissionList: {
    url: "/user/permission/list",
    method: "post"
  },
  chatBatchClose: {
    url: "/chat/batch-close",
    method: "post"
  },

  userLogout: {
    url: "/user/logout",
    method: "post"
  },
};
