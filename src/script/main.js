//配置路径
require.config({
    baseUrl:"src/script/",
    shim: {
        "zepto": {
            exports: "$"
        }
    },
    paths: {
        "interface": "app/interface",
        "zepto": "lib/zepto/v1.1.6/zepto.min",
        "model": "app/model",
        "view": "app/view",
        "viewModel": "app/viewModel",
        "text": "lib/require/require-plugin/text"
        /*"sdk":"https://dn-maam-rymapp-stg.qbox.me/webSDK/sdk"*/
    }
});
//定义一个全局变量，如果需要用到全局变量，可扩展属性添加到该对象上
//不用把方法也绑定上来，在实际项目中按需扩展
var PINGAN = {};
PINGAN.alertTime = 0; //用户等待信息加载的标识
PINGAN.userInfo = {}; //存储用户设备信息
PINGAN.serverUrl = ""; //接口地址
PINGAN.timeLine = {};   //时间轴，用来存放相关动画的定时器，统一管理
PINGAN.mask = document.getElementById("mask");
PINGAN.loading = document.getElementById("loading");
PINGAN.maskNoBg = document.getElementById("maskNoBg");
PINGAN.newAlert = document.getElementById("newAlert"); //上面几个变量应该是比较长用的，取一次就存下来，节省时间
PINGAN.interFace = {}; //接口对应的返回
PINGAN.model = {}; //model对应的返回
PINGAN.view = {};  //view对应的返回
PINGAN.viewModel = {}; //viewModel对应的返回
PINGAN.response = [];  //把接口返回数据暴露到全局，供相关回调链进行操作，要注意对该变量的清空处理，避免取到就数据
PINGAN.respThread = {}; //存储回调的线程相关的字段
PINGAN.pid = 0; //产品ID
PINGAN.cid=""; //渠道ID
//PINGAN.serverUrl = "http://m.pingan.com/";//生产环境
PINGAN.serverUrl = "http://pa18-wapmall-dmzstg1.pingan.com.cn:5380/";//测试环境
//两个方法的使用要好好考虑下，既然上框架那就不应该过多的参与具体代码的实现，应该是给相关人员更大的便利
//在这个地方定义的方法，应该是偏向对原生JS中的alert，prompt或者confirm这种全局通用的方法，比如loading
function showLoading () {
    //加载页面
    PINGAN.maskNoBg.style.display = "block";
    PINGAN.mask.style.display = "block";
    PINGAN.loading.style.display = "block";
}
function hideLoading () {
    //隐藏加载页面
    PINGAN.mask.style.display = "none";
    PINGAN.loading.style.display = "none";
    PINGAN.maskNoBg.style.display = "none";
}

function newAlert (str,timeState) {
    PINGAN.newAlert.innerHTML = str;
    PINGAN.maskNoBg.style.display = "block";
    PINGAN.newAlert.style.display = "block";
    if(timeState) {
        PINGAN.alertTime = setTimeout(function(){
            PINGAN.newAlert.innerHTML = "您已经等待超过15秒，建议您检查网络连接后重新尝试";
        },15000);
    }
}
function hideAlert(){
    PINGAN.maskNoBg.style.display = "none";
    PINGAN.newAlert.style.display = "none";
    if(PINGAN.alertTime) {
        clearTimeout(PINGAN.alertTime);
        PINGAN.alertTime = 0; //重置保证hideAlert逻辑正常
    }
}

//埋点方法，依赖native.js，不进行埋点可删除
function MaiDian(lableStr){
    var _pluginid = "PA01100000000_02_HHC";
    var _lableStr = lableStr;
    var _eventStr = "RYM_ZYH 划横财";
    App.call(["saveTalkingData"],function(result){
        //do something success
        console.log(result);
    },function(error){
        //do something error
        console.log(error);
    },{
        label:_lableStr,//标签
        event:_eventStr,//事件
        pluginId:"PA01100000000_02_HHC",
        map:{
            timestamp:new Date().getTime(),
            sourceId:_pluginid
        } //自定义参数
    });
}
window.jsonPCallback=function(data){
    interFaceListen(data); //通知接口监听方法，用来进行下面的操作链
}

//回调链的处理(相当于点餐台，至于老板怎么通知厨师去做饭，完全不需要客户知道)
function callBackChain (argObject) {
    var _argObject = argObject;
    PINGAN.respThread = {}; //初始化存储的链条变量，防止之前的回调链，影响当前的链
    PINGAN.response = [];   //初始化存储的返回值，防止之前的数值影响当前的链
    var chainState = false; //标识是否跳过接口链和视图链
    function checkArgument () {
        var isArr = false; //判断是否是数组
        for(i in _argObject) {
            //遍历传过来的参数，接口返回的相关数据暴露到全局变量PINGAN.response，
            //一般情况下接口对应的顺序就是某次运行接口对应存储的数据
            if(i=="interFace") {
                isArr = Array.isArray(_argObject.interFace);
                if(isArr) {
                    var j = 0;
                    var interLength = _argObject.interFace.length;
                    auxiThread("interFaceLength",interLength); //通知监听层，当前有几个接口请求
                    for(j;j<interLength;j++) {
                        (function(){
                            _argObject.interFace[j]();
                        })();
                    }
                }else{
                    auxiThread("interFaceLength",1);//通知监听层，有几个接口请求
                    (function(){
                        _argObject.interFace();
                    })();
                }
                chainState = true;
            }else if(i=="viewChain") {
                (function(){
                    _argObject.viewChain();
                })();
                chainState = true;
            }
        }
    }
    mainThread("register",argObject); //注册主渲染层
    checkArgument(); //先对传入参数进行处理，优先发起接口请求和视图链操作,执行
                     //到视图链先阻塞下，等待接口返回的数据，在进行模型链的操作
    if(!chainState) {
        //跳过接口链和视图链，直接执行下面的代码
        mainThread("interFaceOver"); //通知主线程接口数据都正常返回，可以进行下面的操作
    }
}
//事件驱动监听(服务员把饭送给客户，用来接收接口返回的数据,用来通知用户饭已经好了)
function interFaceListen(response) {
    hideAlert();
    PINGAN.response.push(response);
    auxiThread("interFaceBack",PINGAN.response.length); //通知监听函数，当前返回的接口数
}
//辅助监听
function auxiThread (method,methodParam) {
    if(method=="interFaceLength") {
        PINGAN.respThread.interFaceLength = methodParam; //标识当前回调链需要调用多少个接口
    }else if(method=="interFaceBack") {
        if(methodParam==PINGAN.respThread.interFaceLength) {
            //如果所有接口都返回数据，如果这个接口是独立的接口，最好写一个独立的链条，这里会强制要求接口有返回数据
            mainThread("interFaceOver"); //通知主线程接口数据都正常返回，可以进行下面的操作
        }
    }
}
//主渲染
function mainThread (method,methodParam) {
    if(method=="register") {
        PINGAN.respThread.argObject = methodParam; //在全局注册变量，存放回调链
    }else if(method=="interFaceOver") {
        //默认情况下，到这里一定是调完接口，构建完视图链才会到这里，所以暂时不考虑容错的情况，直接进行模型链和方法链的调用
        var _argObject = PINGAN.respThread.argObject;
        for(i in _argObject) {
            if(i=="modelChain") {
                (function(){
                    _argObject.modelChain();
                })();
            }else if(i=="methods") {
                (function(){
                    _argObject.methods();
                })();
            }
        }
    }
}


define(function(require){
    require("zepto");
    PINGAN.interFace = require("interface"); //载入存放接口的文件
    PINGAN.model = require("model");
    PINGAN.view = require("view");
    PINGAN.viewModel = require("viewModel");

    window.anydoorSDK.init({
        environment:"stg"
    });

    var ssoTickInfo = "";
    if(location.href.indexOf("localhost")>-1 || navigator.userAgent.indexOf("anydoor")>-1){
        success(JSON.stringify({
            deviceId:"deviceId00010134"+Math.random()*100,
            deviceType:"android_xxx",
            osVersion:"8.2",
            anyDoorSdkVersion:"2.2.1",
            appId:"SZDBK00000000_01_KDYH",
            appVersion:"4.4.0.0",
            pluginId:"PA01100000000_02_HHC"
        }));
    }else{
        App.call(["sendMessage"],function(ticketInfo){
            try{
                ssoTickInfo = JSON.parse(ticketInfo);
            }catch(e){
                ssoTickInfo = ticketInfo;
            }
            App.call(["sendMessage"],success,function(e){},["getDeviceInfo"]);
        },function(){},["getSSOTicket"]);
    }
    function success (r) {
        var deviceInfo ="";
        try{
            deviceInfo=JSON.parse(r);
        }catch(e){
            deviceInfo=r;
        }
        PINGAN.userInfo.pluginId = "PA01100000000_02_HHC";
        PINGAN.userInfo.deviceId = deviceInfo.deviceId||"";
        PINGAN.userInfo.deviceType = deviceInfo.deviceType||"";
        PINGAN.userInfo.osVersion = deviceInfo.osVersion||"";
        PINGAN.userInfo.appVersion = deviceInfo.appVersion||"";
        PINGAN.userInfo.sdkVersion = deviceInfo.anyDoorSdkVersion||"";
        PINGAN.userInfo.appId = deviceInfo.appId||"";
        if(ssoTickInfo) {
            PINGAN.userInfo.ssoTicket = ssoTickInfo.SSOTicket;
            PINGAN.userInfo.signature = ssoTickInfo.signature;
            PINGAN.userInfo.timestamp = ssoTickInfo.timestamp;
        }
        if(sessionStorage.getItem("pageForm")) {
            var pageName = sessionStorage.getItem("pageForm");
            //根据跳出前设定的pageName来判断要跳到哪个页面去
            sessionStorage.removeItem("pageForm");
        }else{
            PINGAN.viewModel.indexVM(); //调到首页
        }
    }
});