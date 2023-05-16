// detail/detail.ts
const app1 = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: {},
        id: '',
        index: 0,
        imgOne: [] as any,//选择图,
        imgList: [] as any,
        llist: {},
        iimgOne: [] as any,

        board: [] as any,
        index1: 0,
        time: '',
        urlList: [] as any
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log("列表携带的值", options)
        let id: any = options.id
        let time: any = options.time
        console.log('detail1 time', time)
        var a = this;
        a.setData({
            id: id,
            time: time,
        })
        this.getBoard1(this.getBoard1)
        console.log('detail1 time111', this.data.time)
        
        wx.cloud.database().collection('task').doc(id).get().then(res => {
            console.log("订单请求成功，", res)
            a.setData({
                list: res.data,
                imgOne: res.data.imgOne,
                iimgOne:res.data.fileIDs,
            })
        }).catch(err => {
            console.log("商品详情请求失败", err);
        })

    },

    getBoard1: async function (getBoard1) {
        var a = this;
        const db = wx.cloud.database();
        console.log('getboard1', this.data.time)

        db.collection('task').where({
            time: this.data.time
        }).get({
            success: res => {
                console.log("get11", res);


                a.setData({
                    //llist:res.data,
                    board: res.data[0],
                    iimgOne: res.data[0].fileIds
                })
                console.log(a.data.iimgOne.length)
                console.log(a.data.iimgOne)
                //获取到了fileids数组
                var num = a.data.iimgOne.length
                for (var i = 0; i < num;) {
                    this.addImagePath(a.data.iimgOne[i])
                    i = i + 1
                }


            }, fail: console.error
        })


    },
    exitchange() {
        var id = this.data.id
        console.log(id)
        const db = wx.cloud.database()
        db.collection("task").where({
            _id: id
        }).orderBy('time', 'desc').update({
            data: {
                status: "等待处理"
            }


        }).then(res => {
            console.log("success", res)
        })

    },

    OnUpImg: function (flag) {
        let promiseArr = []
        let fileIds: any[] = []     // 将图片的fileId存放到一个数组中
        let imgLength = this.data.imgOne.length;

        // 图片上传
        for (let i = 0; i < imgLength; i++) {
            let p = new Promise<void>((resolve, reject) => {
                let item = this.data.imgOne[i]
                let suffix = /\.\w+$/.exec(item)[0]

            })
            promiseArr.push(p)
        }
        //获取图片url地址fileId

        Promise.all(promiseArr)
            .then((res) => {
                this.addtoDB(fileIds)

            })
            .catch((err) => {
                console.error(err)       // 上传图片失败
                flag = true
                wx.showToast({
                    title: '上传失败 请再次点击发布',
                    icon: 'none',
                    duration: 3000
                })
                return flag
            })

    },

    async addImagePath(fileID) {
        console.log(fileID)
        var a = this
        wx.cloud.getTempFileURL({
            fileList: [fileID],
            success: res => {
                console.log("获取url地址：", res.fileList[0].tempFileURL)

                a.setData({
                    urlList: this.data.urlList.concat(res.fileList[0])
                }), () => {
                    console.log("获取url地址all：", a.data.urlList)
                }
            },
            fail: console.error
        })


    },


    previewImg: function (e) {
        console.log('放大图片')

        let index = e.currentTarget.dataset.index

        var item = this.data.imgOne[index]

        console.log(item)

        wx.previewImage({
            current: item, // 当前显示图片的http链接
            urls: this.data.imgOne // 需要预览的图片http链接列表
        })
    },
    change() {
        //this.sendSubscribe1()
        var id = this.data.id
        console.log('change:id',id)
        const db = wx.cloud.database()
        db.collection("task").where({
            _id: id
        }).update({
            data: {
                status: "订单完成"
            }

        }).then(res => {
            console.log("success", res)
        })


        wx.cloud.callFunction({
            name: "getOpenid"
        }).then(res => {
            let openid = res.result.openid
            console.log("获取openid成功ts", openid)
            this.send(openid)
        }).catch(res => {
            console.log("获取openid失败", res)
        })




    },
    send(openid) {

        wx.cloud.callFunction({
            name: "send",
            data: {
                openid: openid,

            }
        }).then(res => {
            console.log("推送消息成功", res)
        }).catch(res => {
            console.log("推送消息失败", res)
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
    onReachBottom() {
        console.log("上拉加载....");
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})




