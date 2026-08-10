export default {
  newStyleConfigDetail: {
    url: "/new-jsconfig/detail",
    method: "post"
  },
  // 新版网页样式保存
  newStyleConfigSave: {
    url: '/new-jsconfig/add',
    method: 'post'
  },
  // 新版网页样式编辑
  newStyleConfigUpdate: {
    url: '/new-jsconfig/update',
    method: 'post'
  },
  jsConfigPageJsConfig: {
    url: '/JsConfig/PageJsConfig',
    method: 'post'
  },
  getWelcomePage1: {
    url: '/HomePage/WelcomePage1',
    method: 'get'
  },
  uploadPictureHw: {
    url: '/material/overseas/library/upload',
    method: 'post'
  },


  // 邮件api
  noticeDetailEmail: {
    url: '/template-notice/detail ',
    method: 'get'
  },
  noticeSaveEmail: {
    url: '/template-notice/saveOrUpdate',
    method: 'post'
  },
  aiRobotTeamsList: {
    url: '/ai-robot-teams/list',
    method: 'post'
  },
  aiRobotTeamsUpdate: {
    url: '/ai-robot-teams/update',
    method: 'put'
  },
  aiRobotTeamsDelete: {
    url: '/ai-robot-teams/delete',
    method: 'post'
  },
  aiRobotTeamsIsState: {
    url: '/ai-robot-teams/isState',
    method: 'put'
  },
  newJsconfigOverseasUpdateTitle: {
    url: '/new-jsconfig/overseas/update-title',
    method: 'post'
  }
};