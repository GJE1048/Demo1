//编程小石头wechat：2501902696

//var util = require('../../miniprogram/utils/util.ts')
const cloud = require('wx-server-sdk')

cloud.init({ env:'cloud1-2gtnwr6a2791fd91'}) // 使用当前云环境

cloud.init()

exports.main = async(event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid, //要推送给那个用户
      page: '../../miniprogram/pages/body/body', //要跳转到那个小程序页面
      data: {//推送的内容
        thing1: {
          value: '师有志愿服务队'
        },
        phrase5: {
          value: '已接取订单'
        },
        name2: {
          value: '师有工作人员'
        },

      },
      templateId: 'QljT2IPyqwhhNZZbp0VGrZLy3Itcw3ggNlq9r41jsLU' //模板id
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}