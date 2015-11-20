//与view层自动映射，连接view层和Model层的关键,视图模型层
define(function(){

    function indexVM() {
        PINGAN.view.getPid();
        //首页的VM
        //App.call(["sendMessage"],function(ticketInfo){
        //    var ssoTickInfo = JSON.parse(ticketInfo);
        //    if(ssoTickInfo) {
        //        userInfo.ssoTicket = ssoTickInfo.SSOTicket;
        //        userInfo.signature = ssoTickInfo.signature;
        //        userInfo.timestamp = ssoTickInfo.timestamp;
        //    }
        //构建一个回调链，保证相应回调函数，是在前一个函数执行完才会执行
        //一个通用的调用链是先调接口(获取数据)->加载对应页面的基础数据(view层)->根据接口
        //返回的数据重构页面或者绑定相关事件(model层)->重新回到模型视图层，view层和model层之间不进行联系，
        //通过viewModel层进行数据传输
        //callBackChain({
        //    interFace:[PINGAN.interFace.indexInter,PINGAN.interFace.indexTest],
        //    viewChain:PINGAN.view.indexPage,
        //    modelChain:PINGAN.model.indexM,
        //    methods:indexEvnt
        //});
        callBackChain({
            interFace:PINGAN.interFace.indexInter,
            viewChain:PINGAN.view.indexPage,
            modelChain:PINGAN.model.indexM
            //methods:indexEvnt
        });
        //接口层可能会存在调用多个接口的情况，但对视图链和模型链，对外暴露的一般就只会是一个方法，避免维护起来繁琐，
        //这地方强制只调用一个方法，不能把整个链条搞的太复杂，执行逻辑方面，模拟事件驱动模型，主线程是先调用接口链(非强制)，
        //然后非阻塞的执行视图链的方法，阻塞性的等待接口通知数据返回，在主线程之外还有一个辅助的监听线程，通过有限状态机制，
        //实时监听主线程的执行，在接口返回数据之后在通知主线程，可以继续执行model层的逻辑，保证一条链下去就是一个页面
        //},function(){},["getSSOTicket"]);
    }

    function checkLogin(){
        App.call(["sendMessage"],function(ticketInfo){
            var ssoTickInfo="";
            try{
                ssoTickInfo = JSON.parse(ticketInfo);
            }catch(e){
                ssoTickInfo = ticketInfo;
            }
            if(ssoTickInfo) {
                PINGAN.userInfo.ssoTicket = ssoTickInfo.SSOTicket;
                PINGAN.userInfo.signature = ssoTickInfo.signature;
                PINGAN.userInfo.timestamp = ssoTickInfo.timestamp;
            }
            PINGAN.interFace.isLogin(ssoTickInfo);
        },function(){},["getSSOTicket"]);
    }

    function userLogin(){
        var linkUrl=PINGAN.interFace.getLinkUrl();
        //var linkUrl=window.location.href;
        App.call(["getSSOLogin"],function(){},function(){},{
                "redirectURL":linkUrl
        });
    }

    var VIEWMODEL = {
        indexVM:indexVM,
        checkLogin:checkLogin,
        userLogin:userLogin
    };
    return VIEWMODEL;
});