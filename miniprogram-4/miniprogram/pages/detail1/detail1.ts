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
        imgList:[]as any,
        llist:{},
        iimgOne:[]as any,
    
        board:[] as any,
        index1:0,
        time:'',
        urlList:[]as any,
        openid11:0 
    },


    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        var id1 :any= 0; 
        if(options){id1 = options.id}
        console.log("列表携带的值", options)
        console.log(id1)
        console.log(options.id)
        let id: any = options.id
        let time: any = options.time 
        console.log('detail1 time',time)
        var a = this;
        a.setData({
            id: id,
            time:time,
        })
        
        this.getBoard1(this.getBoard1)


        console.log('detail1 time111',this.data.time)
        
        wx.cloud.database().collection('task').doc(id).get().then(res => {
            console.log("订单请求成功，", res)
            a.setData({
                list: res.data,
                imgOne: res.data.fileIDs,
                openid11:res.data._openid
            })
            console.log("detail1:openid，", a.data.openid11)
        }).catch(err => {
            console.log("商品详情请求失败", err);

        })


        wx.cloud.database().collection('userinfo').where({
            time:this.data.time
        }).get({
            success:res=>{
                console.log("get11",res);


                a.setData({
                    //llist:res.data,
                    board:res.data[0],
                    iimgOne:res.data[0].fileIds,
                    openid11:res.data[0]._openid
                })
                console.log(a.data.iimgOne.length)
                console.log(a.data.iimgOne)
                console.log(a.data.openid11)
                //获取到了fileids数组
                var num = a.data.iimgOne.length
for(var i=0;i<num;){
this.addImagePath(a.data.iimgOne[i])
i=i+1
a.setData({
    urlList:a.data.urlList.concat(a.data.iimgOne[i])
})
console.log('kuuk',a.data.urlList)
}


            },fail:console.error
        })
    },

    getBoard1:async function(getBoard1){
        var a = this;
        const db =wx.cloud.database();
        console.log('getboard1',a.data.time)
        
            db.collection('task').where({
                time:this.data.time
            }).get({
                success:res=>{
                    console.log("get11",res);


                    a.setData({
                        //llist:res.data,
                        board:res.data[0],
                        iimgOne:res.data.fileIDs
                    })
                    console.log(a.data.iimgOne.length)
                    console.log(a.data.iimgOne)
                    //获取到了fileids数组
                    var num = a.data.iimgOne.length
 for(var i=0;i<num;){
    this.addImagePath(a.data.iimgOne[i])
    i=i+1
    a.setData({
        urlList:a.data.urlList.concat(a.data.iimgOne[i])
    })
    console.log('kuuk',a.data.urlList)
 }
 

                },fail:console.error
            })


    },
    exitchange() {
        var id = this.data.id
        console.log(id)
        const db = wx.cloud.database()
        db.collection("task").where({
            _id: id
        }).orderBy('time','desc').update({
            data: {
                status: "等待处理"
            },
            
        }).then(res => {
            console.log("success", res)
        })
        //let pages = getCurrentPages();

    },

    sendSubscribe() {
        const templateId = 'QljT2IPyqwhhNZZbp0VGrXeL1EZBIF51Glo_zOW9Uxc' //模板ID
        const openid = getApp().globalData.user_openid // 用户的openid
        const db = wx.cloud.database();
        db.collection('user_subscribe').where({ //查找数据库中模板ID对应未发送的记录
            _openid: openid,
            status: 1,
            templateId: templateId
        }).limit(1).get({
            success: res => {
                const id = res.data[0]._id  //存储该条数据的id
                // 调用云函数发送订阅消息
                wx.cloud.callFunction({
                    name: "subscribe",
                    data: res.data[0]
                }).then(res => {
                    console.log("推送成功", res)
                    // 根据id修改该条数据状态，设置为已发送
                    db.collection('user_subscribe').where({
                        _id: id
                    }).update({
                        data: {
                            status: "0"
                        }
                    })
                }).catch(res => {
                    console.log(res)
                })
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '查询订阅消息记录失败'
                })
            }
        });
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
        await wx.cloud.getTempFileURL({
            fileList: [fileID],
            success: res => {
                console.log("获取url地址：", res.fileList[0].tempFileURL)
                a.setData({
                    urlList:this.data.urlList.concat(res.fileList[0])
                }),()=>{
                    console.log("获取url地址all：",a.data.urlList)
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
        console.log(id) 
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
        //const openid1 = getApp().globalData.user_openid
        var openid1 = this.data.id
        var openid11 = this.data.openid11
        console.log(openid11)
        wx.cloud.callFunction({ 
            name: "send", 
            data: { 
                openid: openid11, 
                
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})




