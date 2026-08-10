// https://test19.easyliao.net/ocoms-web/doc.html
export default {
  // 文件列表
  aiFileList: {
    url: "/companyAiFiles/aiFileList",
    method: "post"
  },
  // 文件上传前校验
  checkAiFile: {
    url: "/companyAiFiles/checkAiFile",
    method: "post"
  },
  // 文件上传
  uploadAiFile: {
    url: "/companyAiFiles/uploadAiFile",
    method: "post"
  },
  // 文件重命名
  updateAiFileName: {
    url: "/companyAiFiles/updateAiFileName",
    method: "post"
  },
  // 文件删除
  aiFileDelete: {
    url: "/companyAiFiles/aiFileDelete",
    method: "post"
  },
  siteUploadSite: { // 上传website
    url: "/site/uploadSite",
    method: "post"
  },
  siteGetWebSite: { // 获取网址信息
    url: "/site/getWebSite",
    method: "post"
  },
  overseasPageList: { //
    url: "/aiRobot/page-list",
    method: "post"
  },
  overseasCreateAiUser: { //
    url: "/aiRobot/createAiUser",
    method: "post"
  },
  overseasDeleteAiUser: { //
    url: "/aiRobot/deleteAiUser",
    method: "post"
  },
  aiRobotRecoverAiUser: { //
    url: "/aiRobot/recoverAiUser",
    method: "post"
  },
};