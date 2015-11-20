//接口调用，用回调的方式构建起接口层和视口模式层直接的联系
define(function(){
    function backUserInfo (jsonDate) {
        //返回通用参数的
        jsonDate.pluginId = PINGAN.userInfo.pluginId;
        jsonDate.deviceId = PINGAN.userInfo.deviceId;
        jsonDate.deviceType = PINGAN.userInfo.deviceType;
        jsonDate.osVersion = PINGAN.userInfo.osVersion;
        jsonDate.appVersion = PINGAN.userInfo.appVersion;
        jsonDate.sdkVersion = PINGAN.userInfo.sdkVersion;
        jsonDate.appId = PINGAN.userInfo.appId;
        return jsonDate;
    }

    function splitJSONP (callBackName,data) {
        //把返回的JSONP的数据传，处理成普通的符合JSON格式string
        var splitStr = callBackName+"(";
        return JSON.parse(data.split(splitStr)[1].split(");")[0]);
    }

    function indexInter () {
        newAlert("数据加载中...");
        //这是DEMO，函数名要和接口文档中的对应接口名一直
        //var getqueryDetailInfo = "src/script/app/getqueryDetailInfo.jsonP";
        var getqueryDetailInfo = PINGAN.serverUrl+"chaoshi/api/external/product/queryDetailInfo.do";
        getqueryDetailInfo +='?reqStr={"pid":"'+PINGAN.pid+'","v":"1.0","timestamp":'+(new Date()).getTime()+',"reqSource":"rym-dzh","callback":"jsonPCallback"}';
        $.ajax({
            type:"GET",
            url : getqueryDetailInfo,
            dataType : "jsonp",
            success : function(response) {

            }
        });
    }

    function isLogin(ssoTickInfo){
        var SSOTicket="";
        if(ssoTickInfo){
            SSOTicket=ssoTickInfo.SSOTicket;
            if(SSOTicket){//已登录
                window.location.href=PINGAN.interFace.getLinkUrl();
            }else{
                PINGAN.viewModel.userLogin();
            }
        }else{
            //方法出错
            PINGAN.view.errorPage("0");
        }
    }
    function getLinkUrl(){
        var url="";
        var data={
            "baseUrl": "http://icorepams.pingan.com.cn:5380/mobile_single_insurance/queryProductDetails.do?account=koudaiyinhang",
            "jiashiren":"&plansId=jiashirenyiwai",
            "yinanjiaotong":"&plansId=yinianjiaotongyiwai",
            "shaoer":"&plansId=shaoerzonghe",
            "aibeijia":"&plansId=aibeijiajiacaixian",
            "toubhref":"http://pa18-wapmall-dmzstg1.pingan.com.cn:5380/chaoshi/baoxian/toubao/tianxie.do"
        };
        var baseUrl=data.baseUrl;
        var dataId=$("#slide_btns").find("li[class='on']").attr("data-id");
        if(PINGAN.pid == 30070){
            url = baseUrl+data.jiashiren;
        }
        else if(PINGAN.pid == 30071){
            url = baseUrl+data.yinanjiaotong;
        }
        else if(PINGAN.pid == 30072){
            url = baseUrl+data.shaoer;
        }
        else if(PINGAN.pid == 30073){
            url = baseUrl+data.aibeijia;
        }else{
            url=data.toubhref+"?pid="+PINGAN.pid+"&priceid="+dataId+"&cid="+PINGAN.cid;
        }
        return url;
    }
    var interfaceBack = {
        indexInter:indexInter,
        isLogin:isLogin,
        getLinkUrl:getLinkUrl
    };

    return interfaceBack;
});