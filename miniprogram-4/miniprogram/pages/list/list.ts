// pages/list/list.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ne: [] as any,
        num: 0,
        id:'',
        id1:'',
    },
    login: function (e) {
        console.log(e.currentTarget.dataset.id)
        var time = e.currentTarget.dataset.time
        var id = e.currentTarget.dataset.id
        console.log('detail time:',time)
        //var idin :any = this.data.ne[id].index
        wx.navigateTo({
            url: '../detail1/detail1?id=' + id +'&time='+time
        })
        this.setData({
            id:id
        })
        console.log(this.data.id)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const MAX_LIMIT = 20
        var that = this
        const db = wx.cloud.database()
        db.collection('task').count().then(async res => {
            let total = res.total;
            // 计算需分几次取
            const batchTimes = Math.ceil(total / MAX_LIMIT)
            // 承载所有读操作的 promise 的数组
            for (let i = 0; i < batchTimes; i++) {
                await db.collection('task').skip(i * MAX_LIMIT).limit(MAX_LIMIT).orderBy('time', 'desc').get().then(async res => {
                    let new_data = res.data
                    let old_data = that.data.ne
                    that.setData({
                        ne: old_data.concat(new_data)
                    })
                })
            }
            console.log(that.data.ne[0])
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
        this.onLoad()
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
    onPullDownRefresh: function () {
        this.onLoad()

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        wx.showLoading({
            title: '刷新中！',
            duration: 1000
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})