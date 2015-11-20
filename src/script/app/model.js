//业务数据处理
define(function(){
    var maxContHeight="";
    var heightArray=[];

    function indexM () {
        queryDetailInfo();
        detailsready();
        var pagedetail=document.getElementById("page_main");
        pagedetail.style.display="block";
    }

    function detailsready(){
        var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var slidelist=document.getElementById('slide_list');
        var slidelists=slidelist.getElementsByTagName('li');
        var slidebtn=document.getElementById('slide_btns');
        var slidebtns=slidebtn.getElementsByTagName('li');
        var $slide_choice=$("#slide_choice");
        var $slide_content=$(".slide_content");
        var $slidelist=$("#slide_list");//大图BOX
        var $slidebtn=$("#slide_btns");//小图BOX
        var $slidelists=$("#slide_list li");//单个大图
        var $slidebtns=$("#slide_btns li");//单个小图

        var startX=0,moveX=0,endX=0,x=0,tMove=0,btntMove=0;
        var btnstartX=0,btnstartY=0,btnendX=0,btnendY=0;
        var list_index=1;//大图下标，背景下标
        var cMove=-screenWidth;//大图当前坐标
        var btncMove=0;//小图当前坐标
        var timer=null;

        $slide_choice.on("touchstart",function(){
            var showTYpe=$(this).attr("showType");
            maxContHeight=maxContHeight ? maxContHeight : "auto";
            if(maxContHeight>106){
                if(showTYpe=="close"){
                    $slide_content.height(maxContHeight);
                    $(this).attr("showType","open").css("backgroundImage","url('src/style/images/bg_right2.png')")
                }else{
                    $slide_content.height(106);
                    $(this).attr("showType","close").css("backgroundImage","url('src/style/images/bg_right.png')")
                }
            }

        })
        //选项卡
        var tabbox=document.getElementById('detal_intro_explan');
        var lis=tabbox.getElementsByTagName('li');
        var divs=tabbox.getElementsByTagName('div');
        for(var i=0;i<lis.length;i++){
            lis[i].id=i;
            lis[i].onclick=function(){
                for(var j=0;j<divs.length;j++){
                    lis[j].className='';
                    divs[j].className='';
                }
                this.className='on';
                divs[this.id].className='show';
            }
        }
        //页面初始化

        slidelist.style.width=slidelists.length*screenWidth+'px';
        for(var i=0;i<slidelists.length;i++){
            slidelists[i].style.width=screenWidth+'px';
        }
        slidebtn.style.width=slidebtns.length*screenWidth/3+'px';
        for(var j=0;j<slidebtns.length;j++){
            slidebtns[j].style.width=screenWidth/3+'px';
        }
        if(slidebtns.length>2){
            slidebtn.style.webkitTransform ="translate3d(0,0,0)";
        }else{
            for(var l in slidebtns){
                slidebtns[l].className="";
            }
            slidebtns[0].className='on';
            slidebtn.style.webkitTransform ="translate3d("+ screenWidth/3+"px,0,0)";
            list_index=0;
        }
        if(slidelists.length>2){
            slidelist.style.webkitTransform ="translate3d("+ -screenWidth +"px,0,0)";
        }else{
            slidelist.style.webkitTransform ="translate3d(0,0,0)";
        }




        //动效
        if($slidelists.length>1){
            if($slidelists.length==2){
                cMove=0;
                btncMove=screenWidth/3;
            }
            //大图滑动
            $slidelist.on("touchstart",function(e){
                PINGAN.maskNoBg.style.display="block";
                startX = e.targetTouches[0].clientX;
            });
            $slidelist.on("touchmove",function(e){
                x = e.targetTouches[0].clientX;
                moveX=x-startX;
                tMove=cMove+parseInt(moveX);
                btntMove=btncMove+parseInt(moveX/3);
                // 边界判断
                if(list_index==0 && x-startX>0){
                    PINGAN.maskNoBg.style.display="none";
                    return;
                }else if(list_index==($slidelists.length-1) && x-startX<0){
                    PINGAN.maskNoBg.style.display="none";
                    return;
                }else{
                    //大图动态变化
                    $slidelist.css({"-webkit-transform":"translate3d("+ tMove +"px,0,0)"});
                    //小图动态变化
                    $slidebtn.css({"-webkit-transform":"translate3d("+ btntMove +"px,0,0)"});
                }
                e.preventDefault();
                e.stopPropagation();
            });
            $slidelist.on("touchend",function(e){
                if(e.targetTouches[0]) {
                    endX = e.targetTouches[0].clientX;
                }else{
                    endX = e.changedTouches[0].clientX;
                }
                var absX=endX-startX;
                if(absX>=screenWidth/5){
                    //右滑大于二分之一屏幕宽度
                    if(list_index==0){//边界判断
                        return;
                    }
                    cMove=cMove+parseInt(screenWidth);
                    btncMove=btncMove+parseInt(screenWidth/3);
                    $slidelist.css({"-webkit-transform":"translate3d("+ cMove +"px,0,0)","-webkit-transition-duration":"400ms"});
                    $slidebtn.css({"-webkit-transform":"translate3d("+ btncMove +"px,0,0)","-webkit-transition-duration":"400ms"});
                    list_index -= 1;
                    $slidebtns.removeClass("on").eq(list_index).addClass("on");
                    timer=setTimeout(function(){
                        clearTimeout(timer);
                        $slidelist.css({"-webkit-transition-duration":null});
                        $slidebtn.css({"-webkit-transition-duration":null});
                        PINGAN.maskNoBg.style.display="none";
                    },450);
                }else if(absX<=-screenWidth/5){
                    //左滑小于二分之一屏幕宽度
                    if(list_index==($slidelists.length-1)){//边界判断
                        return;
                    }
                    cMove=cMove-parseInt(screenWidth);
                    btncMove=btncMove-parseInt(screenWidth/3);
                    $slidelist.css({"-webkit-transform":"translate3d("+ cMove +"px,0,0)","-webkit-transition-duration":"400ms"});
                    $slidebtn.css({"-webkit-transform":"translate3d("+ btncMove +"px,0,0)","-webkit-transition-duration":"400ms"});
                    list_index += 1;
                    $slidebtns.removeClass("on").eq(list_index).addClass("on");
                    timer=setTimeout(function(){
                        clearTimeout(timer);
                        $slidelist.css({"-webkit-transition-duration":null});
                        $slidebtn.css({"-webkit-transition-duration":null});
                        PINGAN.maskNoBg.style.display="none";
                    },450);
                }else if(absX==0){
                    PINGAN.maskNoBg.style.display="none";
                    return;
                }else{
                    $slidelist.css({"-webkit-transform":"translate3d("+ cMove +"px,0,0)","-webkit-transition-duration":"400ms"});
                    $slidebtn.css({"-webkit-transform":"translate3d("+ btncMove +"px,0,0)","-webkit-transition-duration":"400ms"});
                    timer=setTimeout(function(){
                        clearTimeout(timer);
                        $slidelist.css({"-webkit-transition-duration":null});
                        $slidebtn.css({"-webkit-transition-duration":null});
                        PINGAN.maskNoBg.style.display="none";
                    },450);
                }
            });
            //小图点击,模拟onclick事件
            //小图滑动
            var btnx= 0,btnMoveX=0;
            var nn=0;//辅助计算

            $slidebtn.on("touchstart",function(e){
                PINGAN.maskNoBg.style.display="block";
                btnstartX = e.targetTouches[0].clientX;
                btnstartY = e.targetTouches[0].clientY;
            });
            $slidebtn.on("touchmove",function(e){
                btnx= e.targetTouches[0].clientX;
                btnMoveX=btnx-btnstartX;
                btntMove=btncMove+btnMoveX;
                if(btntMove>screenWidth/3){
                    btntMove=screenWidth/3;
                }else if(btntMove<-($slidebtns.length-2)/3*screenWidth){
                    btntMove=-($slidebtns.length-2)/3*screenWidth;
                }
                $slidebtn.css("-webkit-transform","translate3d("+btntMove+"px,0,0)");
                e.preventDefault();
                e.stopPropagation();
            });
            $slidebtn.on("touchend",function(e){
                if(e.targetTouches[0]) {
                    btnendX = e.targetTouches[0].clientX;
                    btnendY = e.targetTouches[0].clientY;
                }else{
                    btnendX = e.changedTouches[0].clientX;
                    btnendY = e.changedTouches[0].clientY;
                }
                if(Math.abs(btnendX-btnstartX)<=10 && Math.abs(btnendY-btnstartY)<=10){
                    var target=e.target;
                    while(target.tagName!='LI' || target.tagName=='BODY'){
                        target=target.parentNode;
                    }
                    if(target.title==list_index){
                        PINGAN.maskNoBg.style.display="none";
                        return;
                    }
                    cMove=-parseInt(target.title)*screenWidth;
                    btncMove=-(parseInt(target.title)-1)*screenWidth/3;
                    $slidelist.css({"-webkit-transform":"translate3d("+ cMove+"px,0,0)","-webkit-transition-duration":"400ms"});
                    $slidebtn.css({"-webkit-transform":"translate3d("+ btncMove +"px,0,0)","-webkit-transition-duration":"400ms"});
                    list_index=parseInt(target.title);
                    $slidebtns.removeClass("on").eq(list_index).addClass("on");
                    timer=setTimeout(function(){
                        clearTimeout(timer);
                        $slidelist.css({"-webkit-transition-duration":null});
                        $slidebtn.css({"-webkit-transition-duration":null});
                        PINGAN.maskNoBg.style.display="none";
                    },450);
                }else{
                    nn=Math.round(btntMove/(screenWidth/3));
                    if(nn==1){
                        newnum=0;
                        btntMove=screenWidth/3;
                        tMove=0;
                    }else if(nn==0){
                        newnum=1;
                        btntMove=0;
                        tMove=-screenWidth;
                    }else{
                        newnum=Math.abs(nn)+1;
                        btntMove=-(newnum-1)*(screenWidth/3);
                        tMove=-newnum*screenWidth;
                    }
                    $slidebtn.css({"-webkit-transform":"translate3d("+ btntMove +"px,0,0)","-webkit-transition-duration":"400ms"});
                    $slidelist.css({"-webkit-transform":"translate3d("+tMove+"px,0,0)","-webkit-transition-duration":"400ms"});
                    list_index=newnum;
                    $slidebtns.removeClass("on").eq(list_index).addClass("on");
                    timer=setTimeout(function(){
                        clearTimeout(timer);
                        $slidebtn.css({"-webkit-transition-duration":null});
                        $slidelist.css({"-webkit-transition-duration":null});
                        btncMove=btntMove;
                        cMove=tMove;
                        PINGAN.maskNoBg.style.display="none";
                    },400);
                    return;
                }
            });

        }else{
            list_index=0;
        }

        //点击跳转链接
        $("#toub").tap(function(){
            PINGAN.viewModel.checkLogin();
        });
    }


    //详情页数据展示
    function queryDetailInfo(){
        var response=PINGAN.response;
        var resultData=response[0].resultData;
        var detaltopbg=$("#detal_top_bg")[0];
        var insuranceScope=$("#insuranceScope")[0];//投保声明
        var insuranceNotice=$("#insuranceNotice")[0];//投保须知
        var insuranceStatement=$("#insuranceStatement")[0];//投保声明
        var slidebtns=$("#slide_btns")[0];
        var slidelist=$("#slide_list")[0];
        var detaltop=$("#detal_top")[0];
        document.getElementsByTagName("title")[0].innerHTML=resultData.productName ? resultData.productName : "";
        var picUrl=resultData.productInsureDto.mamcPicUrl;
        var priceList=resultData.priceList;
        var insuranceScopehtml=resultData.productInsureDto.insuranceScope.split("\n");
        var insuranceNoticehtml=resultData.productInsureDto.insuranceNotice.split("\n");
        var insuranceStatementhtml=resultData.productInsureDto.insuranceStatement.split("\n");
        var insuranceScopedom="",insuranceNoticedom="",insuranceStatementdom="",slidebtnsdom="",slidelistdom="";
        detaltop.style.backgroundImage="url("+picUrl+")";
        for(var i in insuranceScopehtml){
            insuranceScopedom +="<p>"+insuranceScopehtml[i]+"</p>";
        }
        for(var i in insuranceNoticehtml){
            insuranceNoticedom += "<p>"+insuranceNoticehtml[i]+"</p>";
        }
        for(var i in insuranceStatementhtml){
            insuranceStatementdom +="<p>"+insuranceStatementhtml[i]+"</p>";
        }
        for(var i in priceList){
            if(i==1){
                slidebtnsdom +="<li title='"+i+"' data-id='"+priceList[i].id+"' class='on'><a href='javascript:'>"+priceList[i].priceName+"</a></li>";
            }else{
                slidebtnsdom +="<li title='"+i+"' data-id='"+priceList[i].id+"'><a href='javascript:'>"+priceList[i].priceName+"</a></li>";
            }
            var assuredSumDesc=[];
            if((priceList[i].assuredSumDesc.split("&lt;BR/&gt")).length>1){
                if((priceList[i].assuredSumDesc.split("&lt;BR/&gt;")).length>1){
                    assuredSumDesc=priceList[i].assuredSumDesc.split("&lt;BR/&gt;");
                }else{
                    assuredSumDesc=priceList[i].assuredSumDesc.split("&lt;BR/&gt");
                }
            }else if((priceList[i].assuredSumDesc.split("<BR/>")).length>1){
                assuredSumDesc=priceList[i].assuredSumDesc.split("<BR/>");
            }else{
                assuredSumDesc[0]=priceList[i].assuredSumDesc;
            }
            var _assuredSumDescdom="";
            for(var j in assuredSumDesc){
                _assuredSumDescdom +="<div class='slide_content_text'><span>"+assuredSumDesc[j]+"</span></div>";
            }
            if(priceList[i].insurancePriodUnit=="M"){
                slidelistdom +="<li data-id='"+priceList[i].id+"'><div class='slide_title'>"+priceList[i].premium+"<b>元</b><span>/</span>"+priceList[i].insurancePriod+"<b>月</b><h3>保障金额"+priceList[i].assuredSum/10000+"万</h3><div class='slide_content'>"+_assuredSumDescdom+"</div></div></li>";
            }else if(priceList[i].insurancePriodUnit=="D"){
                slidelistdom +="<li data-id='"+priceList[i].id+"'><div class='slide_title'>"+priceList[i].premium+"<b>元</b><span>/</span>"+priceList[i].insurancePriod+"<b>天</b><h3>保障金额"+priceList[i].assuredSum/10000+"万</h3><div class='slide_content'>"+_assuredSumDescdom+"</div></div></li>";
            }else if(priceList[i].insurancePriodUnit=="Y"){
                slidelistdom +="<li data-id='"+priceList[i].id+"'><div class='slide_title'>"+priceList[i].premium+"<b>元</b><span>/</span>"+priceList[i].insurancePriod+"<b>年</b><h3>保障金额"+priceList[i].assuredSum/10000+"万</h3><div class='slide_content'>"+_assuredSumDescdom+"</div></div></li>";
            }
        }
        slidelist.innerHTML=slidelistdom;
        var productSloganCon=resultData.productSlogan.split("，")[1] ? resultData.productSlogan.split("，")[1] : "";
        detaltopbg.innerHTML="<p>"+resultData.productSlogan.split("，")[0]+"</p><p>"+productSloganCon+"</p>";
        slidebtns.innerHTML=slidebtnsdom;
        insuranceScope.innerHTML =insuranceScopedom;
        insuranceNotice.innerHTML=insuranceNoticedom;
        insuranceStatement.innerHTML=insuranceStatementdom;
        setTimeout(function(){//获取内容最高高度
            var $slide_content=$(".slide_content");
            var contLength=$slide_content.length;
            for(var li=0;li<contLength;li++){
                heightArray.push($($slide_content[li]).height());
                $($slide_content[li]).height(106);
            }
            heightArray.sort(function(a,b){return a>b?1:-1});//从小到大排序
            maxContHeight=heightArray[heightArray.length-1];
        },100)
    }


    var MODEL = {
        indexM:indexM
    };
    return MODEL;
});