// pages/login/login.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name:'',
        number:'',
    },
    inpname:function(e){
        this.setData({
            name:e.detail.value,
        })
    },
    inpnumber:function(e){
        this.setData({
            number:e.detail.value,
        })
    },
    loginin:function(res){
        const db = wx.cloud.database()
        const userCollection = db.collection("login");
        let flag = false;
        userCollection.get({
            success:(res) => {
                let user=res.data;
                console.log(user);
                for(let i=0;i<user.length;i++){
                    if(this.data.name==user[i].name){
                        if(this.data.number !== user[i].number){
                            wx.showToast({
                                title:"输入错误！",
                                icon:'error',
                            });
                            i=-1;//?什么意思，密码错误从头开始遍历数据库对象集合

                        }else{
                            flag=true;
                            wx.navigateTo({
                                url:"../admin/admin",
                            })
                            break;
                        }
                    }
                };
                if(flag=false){
                    wx.showToast({
                        title:"该用户不存在！",
                        icon:"error",
                    })
                }
            }
        })

    },
    login:function(res){
        const db = wx.cloud.database();
        const userCollection = db.collection("login");
        let flag = false  //表示账户是否存在，false初始值

        userCollection.get({
            success:(res) => {
                let user = res.data;  //获取到的对象数组数据
                console.log(user);
                for(let i=0;i<user.length;i++){
                    if(this.data.name == user[i].name){
                        flag = true;
                        break;
                    }
                }
                if(flag==true){
                    wx.showToast({
                        title:'账号已注册',
                        icon:'error',
                        duration:2500,
                    })
                }
                else{
                    userCollection.add({
                        data:{
                            name:this.data.name,
                            number:this.data.number,
                        }
                    })
                    wx.showToast({
                        title:"注册成功",
                        icon:'success',
                        duration:2500,
                    })
                    wx.navigateTo({
                        url:"../admin/admin"
                        //注册成功后跳转页面
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})