// pages/home/hime.ts
//const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo:null,
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    radio:function(){
        wx.showModal({
            title:'提示事项',
            icon:'none',
            content:'xxxxxx',
            showCancel:false,
        })
    },
    box1:function(){
        wx.navigateTo({
            url:'../addtask/addtask'
        });
    },
    box2:function(){
        wx.navigateTo({
            url:'../body/body'
        });
    },
    onLoad() {

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
    onReachBottom() {

    },
    logg:function(){
        wx.navigateTo({
            url:'../login/login'
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    handleContact(e) {
        console.log(e.detail.path)
        console.log(e.detail.query)
    },
})