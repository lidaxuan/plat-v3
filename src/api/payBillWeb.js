export default {
  // 查询是否订阅
  getStatus: {
    url: "/subscription/getStatus",
    method: "get"
  },

  // 商品详情
  getProduct: {
    url: "/subscription/getProduct",
    method: "get"
  },

  // 跳转stripe 前的校验
  checkout: {
    url: "/subscription/stripe/checkout",
    method: "post"
  },


  // 首页 - 修改支付信息 upbeat button operate
  getCustomerPortal: {
    url: "/bill/getCustomerPortal",
    method: "get"
  },
  // 首页 - 支付详情
  getCustomer: {
    url: "/bill/getCustomer",
    method: "get"
  },

  // 首页 账号详情
  getPurchaseQuantity: {
    url: "/bill/getPurchaseQuantity",
    method: "get"
  },

  // 账单列表
  getPage: {
    url: "/bill/page",
    method: "get"
  },

  // 查询退款金额
  getRefundAmount: {
    url: "/bill/getRefundAmount",
    method: "get"
  },

  // 退款
  refund: {
    url: "/bill/refund",
    method: "post"
  },

  // 导出文件
  exportPdf: {
    url: "/bill/export/pdf",
    method: "get"
  }


  // 产品明细
  // detail: {
  //   url: "/stripe/getProduct",
  //   method: "get"
  // },
  // // 订单状态
  // status: {
  //   url: "/stripe/getSubscriptionStatus",
  //   method: "get"
  // },
  // // 企业信息
  // compnayInfo: {
  //   url: "/stripe/getCompanyAndProductConfig",
  //   method: "get"
  // },
  // // 账单明细
  // subscriptionList: {
  //   url: "/stripeSubscription/subscriptionList",
  //   method: "get"
  // }
};