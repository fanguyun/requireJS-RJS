//与viewModel自动映射，视图展示层
define(function(require){
    //现在的模版策略有问题，这个地方一定要改，先暂时用require插件text库来处理
    //路由
    function route (pageName,state) {
        if(state==0) {
            //不插入历史记录
            replaceState(pageName);
        }else if(state==1) {
            //插入历史记录
            pushState(pageName);
        }
    }
    //插入历史记录
    function pushState (pageName) {
        var title = pageName;
        var state = {title:pageName};
        var url = location.href.split("?")[0]+"?page="+pageName;
        history.pushState(state,title,url);
    }
    //不插入历史记录
    function replaceState (pageName) {
        var title = pageName;
        var state = null;
        var url = location.href; //对历史记录不做任何处理
        history.replaceState(state,title,url);
    }
    /*window.addEventListener("popstate",function(evnt){
        if(evnt.state === null) {
            //目前逻辑是回到陆金所产品页
            showAptPage("page_lufaxD",0,0);
        }else if(evnt.state.title) {
            var pageId = evnt.state.title;
            showAptPage(pageId,0,0); //这地方的逻辑是否需要优化还要考虑下，如果不给微信用，似乎无所谓
        }
    });*/

    function showAptPage (pageName,state,loadState) {
        //展示某一页面,pageName是对应page的ID
        //对历史记录的操控写到这里
        var pageMode = $(".pageMode");
        pageMode.css("display","none");
        var pageDom = document.getElementById(pageName);
        var showPageDom=setTimeout(function(){//等待滚动条加载完成再显示
            pageDom.style.display = "block";
            clearTimeout(showPageDom);
        },600);
        route(pageName,state);
        if(loadState) {
            //是否要立刻隐藏loading页，参数是0或者1，1表示立即隐藏，0反之，如果为0需要在对应
            //的model回调中写入相关隐藏逻辑
            var showPageTime = setTimeout(function(){
                hideLoading();
                clearTimeout(showPageTime);
            },100); //加上100毫秒的延时加载
        }
    }
    function getPid(){//通过URL获取参数
        var serchData=location.search;
        var serchArray=[];
        if(serchData){
            serchArray=serchData.split("&");
        }
        if(serchArray[0]){
            PINGAN.pid=serchArray[0].split("=")[1];//产品ID
        }else{
            console.log("无产品ID");
        }
        if(serchArray[1]) {
            PINGAN.cid = serchArray[1].split("=")[1];//渠道ID
        }else{
            console.log("无渠道ID");
        }
    }
    function indexPage () {
        //主游戏界面
        var pageMode = $(".pageMode");
        pageMode.css("display","none");
        var pageHtml=require("text!template/main.html");
        var pageDom=document.getElementById("page_main");
        pageDom.innerHTML=pageHtml;
    }

    function errorPage (state) {
        showLoading();
        var pageHtml = "";
        if(state=="0"){
            //接口出错或者长时间不返回数据
            pageHtml = "<p class='errorP'>亲，由于不可预知的错误，系统出现异常，勤劳的程序猿正在修复，请稍后访问!</p>"
        }else if(state=="1"){
            //超时
            pageHtml = "<p class='errorP'>亲，您的网络连接超时请确认网络后，重新尝试!</p>"
        }
        var pageDom = document.getElementById("page_error");
        pageDom.innerHTML = pageHtml;
        showAptPage("page_error",0,1);
        hideAlert();
    }

    var VIEW = {
        getPid:getPid,
        indexPage: indexPage,
        errorPage:errorPage
    };
    return VIEW;
});