// pages/body/body.ts
const app = getApp();
const db = wx.cloud
globalData: {
    openid: ''
}
Page({
    getinfo: function () {

    },
    /**
     * 页面的初始数据
     */
    data: {
        list: 0,
        userInfo: null as any,
        envId: '',
        user_openid: app.globalData.user_openid,
        ne: [],
        current_page: 1,
        box: [],
        num: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        //this.login()
        //this.getCloudOpenId();
        this.getUserList();

        //打印出来了
        //if(this.data.user_openid == null)console.log('11')


    },
    getUserList: async function () {



        const db = wx.cloud.database()

        //console.log(this.data.num)
        const batchTimes = Math.ceil(this.data.num / 20)
        console.log(batchTimes)   //获取需要获取几次 
        //var arraypro = []          // 定义空数据 用来存储之后的数据
        //for(let i=0;i<batchTimes;i++){
            //console.log(i)
            ///var x =0
            wx.cloud.database().collection('task').orderBy('time','desc').where({
                _openid: app.globalData.user_openid
            }).get().then(res => {
                //x++
                console.log('请求成功', res.data)
                this.setData({
                    ne: res.data
                })
               // console.log(x)

            }).catch(err => {
                console.log('请求失败', err)
            })

            

        //}
        //var zanshi[]




    },
    login:function(e){
        console.log(e.currentTarget.dataset.id)
        var id = e.currentTarget.dataset.id
        var time = e.currentTarget.dataset.time
        //var imgOne :[]= e.currentTarget.dataset.imgOne
        console.log('detail time:',time)
        console.log('detail id:',id)
        //console.log('detail imgOne:',imgOne)
        //var idin :any = this.data.ne[id].index
        wx.navigateTo({
            url:'../../detail/detail?id='+id+'&time='+time 
        })
    },


    
    onReachBottom: function () {
        wx.showLoading({
          title: '到底部啦！',
          duration: 1000
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
    */

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})