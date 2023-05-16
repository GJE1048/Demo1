// pages/addtask/addtask.ts
//const app = getApp()
var util = require('../../utils/util.js')



//const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */

    data: {
        name: '',
        number: '',
        phone: '',
        wxid: '',
        address: '',
        yuanxi: '',
        detail: '',
        status: '',
        school: ['松山湖校区', '莞城校区'],
        index: 0,
        imgOneSwitch: true,
        imgOne: [] as any,//选择图
        images_success: [] as any,//上传云存储后的云存储地址数组
        images_success_size: 0,//图片上传成功的数量
        MAXCOUNTIMAGE: 6,
        //tempImg: [],
        fileIDs: [],
        urlList:[]as any,
        path:'',
        time:'',
    },
    inpname: function (e) {
        this.setData({
            name: e.detail.value,
        })

    },

    inpnumber: function (e) {
        this.setData({
            number: e.detail.value,
        })
    },
    inpphone: function (e) {
        this.setData({
            phone: e.detail.value,
        })
    },
    inpwxid: function (e) {
        this.setData({
            wxid: e.detail.value,
        })
    },
    inpadress: function (e) {
        this.setData({
            address: e.detail.value,
        })
    },
    inpdetail: function (e) {
        this.setData({
            detail: e.detail.value,
        })
    },
    inpyuanxi: function (e) {
        this.setData({
            yuanxi: e.detail.value,
        })
    },
    yuyue: function (e) {
        getApp().preventActive(()=>{
                    //const templateId = 'QljT2IPyqwhhNZZbp0VGrXeL1EZBIF51Glo_zOW9Uxc'
        wx.requestSubscribeMessage({
            tmplIds: ['QljT2IPyqwhhNZZbp0VGrZLy3Itcw3ggNlq9r41jsLU'], //这里填入我们生成的模板id
            success(res) {
                console.log('授权成功', res)
            },
            fail(res) {
                console.log('授权失败', res)
            }
        })
        })

        


    },




    login: function (e) {
        //QljT2IPyqwhhNZZbp0VGrXeL1EZBIF51Glo_zOW9Uxc




        const db = wx.cloud.database()
        const userCollection = db.collection("task")
        //let flag = false;
        var that = this;
        var date = util.formatTime(new Date());
        that.setData({
            time:date
        })
        console.log('addtask:time',that.data.time)
        userCollection.add({
            data: {
                name: this.data.name,
                number: this.data.number,
                phone: this.data.phone,
                address: this.data.address,
                wxid: this.data.wxid,
                yuanxi: this.data.yuanxi,
                detail: this.data.detail,
                imgOne: this.data.imgOne,
                time: date,
                status: '等待处理',
            }
        })




        var flag = false;//为true不退出，确保上传成功
        if (this.data.imgOne.length == 0) {
            wx.showModal({
                title: '未添加图片，是否确认提交？',
                icon: 'none',
                success: function (res) {
                    if (res.confirm) {
                        console.log("用户提交订单")
                        wx.showToast({
                            title: '登记成功',
                            icon: "success",
                            duration: 2000,
                        })
                        wx.reLaunch({
                            url: '../home/hime',
                        })//返回进入的页面

                    }
                    else {
                        console.log("用户取消提交")
                    }

                }

            })
            return
        } else if (this.data.imgOne.length != 0) {
            wx.showModal({
                title: '确认提交？',
                icon: 'none',
                success: function (res) {
                    if (res.confirm) {
                        console.log("用户提交订单")

                        that.OnUpImg(flag)
                        if (flag != true) {
                            wx.reLaunch({
                                url: '../home/hime',
                            })//返回进入的页面
                        }


                    }
                    else {
                        console.log("用户取消提交")
                    }
                }
            })



        }




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

                wx.cloud.uploadFile({
                    cloudPath: 'photo/' + Date.now() + '-' + Math.random() * 1000000 + suffix ,
                    filePath: item,
                    success: (res) => {
                        console.log(res);
                        // console.log(res.fileID)
                        fileIds = fileIds.concat(res.fileID)       // 拼接
                        //this.setData({
                         //   fileIDs:fileIds
                        //})
                        this.addImagePath(res.fileID)
                        this.setData({
                            path:res.fileID
                        })
                        console.log(this.data.path)
                        resolve()
                    },
                    fail: (err) => {
                        console.error(err)
                        reject()
                    }
                })
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
    addImagePath(fileID) {
        console.log(fileID)
        var that = this
        let fileIDs = that.data.fileIDs.concat(fileID)

        that.setData({
            'fileIDs': fileIDs
        })
        console.log('fileIDs:',that.data.fileIDs)




        //that.setData({
        //    fileIDs:fileID.concat(that.data.fileIDs)
        //})
        const db =wx.cloud.database()
        db.collection("task").where({
            time:that.data.time
        }).update({
            data:{
                fileIDs:that.data.fileIDs
            }
        })
        //var 
        var that = this
        wx.cloud.getTempFileURL({
            fileList: [fileID],
            success: res => {
                console.log('res:',res)
                console.log("获取url地址1：", res.fileList[0].tempFileURL)
                //获取url地



            },
            fail: console.error
        })
    },
    addtoDB: function (fileIds) {
        wx.showToast({
            title: '发布中...',
        })

    },


    // 选择图片 + 回显 
    async onChooseOne() {

        let that = this
        wx.chooseImage({
            count: this.data.MAXCOUNTIMAGE - this.data.imgOne.length,
            // sizeType: ['compressed','original'],
            sourceType: ['album', 'camera'],
            sizeType: ['compressed'],
            // sourceType: ['album'],
            success(res) {
                console.log(res)

                let tempArr = that.data.imgOne.concat(res.tempFilePaths)

                that.setData({
                    'imgOne': tempArr
                })
                console.log('imgOne:',that.data.imgOne)
                if (that.data.imgOne.length >= that.data.MAXCOUNTIMAGE) {
                    that.setData({
                        imgOneSwitch: false
                    })
                }
            }

            
        })

    },

    // 删除图片功能
    reBackImg: function (e: { currentTarget: { dataset: any } }) {

        //var imgs = this.data.imgOne
        let dataset = e.currentTarget.dataset
        let index = dataset.index
        console.log(index)

        var arr = this.data.imgOne;
        arr.splice(index, 1);

        if (arr.length < this.data.MAXCOUNTIMAGE && this.data.imgOneSwitch === false) {
            this.setData({
                imgOneSwitch: true
            })
        }

        this.setData({
            imgOne: arr
        });
    },

    // 预览图片
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
    handlerSubmit: function () {

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        // 获取用户openid

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