
//const db = wx.cloud.database()
//const db = wx.cloud

App({

    //globalData: {},

    onLaunch() {
        wx.cloud.init({
            env: 'cloud1-2gtnwr6a2791fd91',//填上你的云开发环境id
            traceUser: true,
        })
        //调用云函数
        wx.cloud.callFunction({
            name: 'getOpenid',
            success: res => {
                //获取用户openid
                this.globalData.user_openid = res.result.openid
                console.log(this.globalData.user_openid)
                var id :any

        }


        
    })},


    
    //全局数据
    globalData: {
        //用户openid
        user_openid: '',
        //用户信息
        userInfo: null,
        num:0,
        PageActive:true,
    },
    //const db = wx.cloud.database()
    preventActive(fn){
        const self = this
        if(this.globalData.PageActive){
            this.globalData.PageActive = false
            if(fn) fn()
            setTimeout(()=>{
                self.globalData.PageActive = true
            },1500)//设置该时间内重复触发只执行第一次，单位ms，按实际设置

        }else{
            console.log('重复点击事件')
        }
    }
})
