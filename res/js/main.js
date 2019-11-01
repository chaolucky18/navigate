if(window.innerWidth < 1200){
    swal("提示","暂不支持移动端，请使用电脑浏览器。(推荐使用Chrome)","error");
}

/* 随机数函数 */
var Randon = function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).ready(function(){

    $(".search-type > ul > li").on("click", function(){ Focus($(this)); });

    /* 获取背景图片 */
    $.ajax({
        url: "httpss://api.i-meto.com/api/v1/bing/random",
        method: 'get',
        dataType: 'json',
        success: function(res){
            // 背景图片
            $('body').eq(0).css('background','url('+ res.url +')');
            // 图片信息展示
            $(".pic-info>p").eq(0).html(res.title);
            $(".pic-info>p").eq(1).html(res.copyright);
        },
        error: function(){
            console.warn("背景API出错，自动加载本地背景");
            // $("body").eq(0).css("background",'url(https://api.xygeng.cn/bing/1366.php)');return;
            var rand = Randon(1, 2);
            $("body").eq(0).css("background",'url(res/img/back' + rand + '.jpg');
        }
    });

    /* 获取搜索方式 */
    $.ajax({
        url: "res/json/type.json",
        method: "get",
        dataType: "json",
        success: function(res){
            window.type = res;
            var i = 0;
            window.typeName = [];
            for(let  key in res){
                $(".search-type>ul").append($("<li>")
                .html(key).attr("class",'').attr("data-type", i++)
                .on("click",function(){Focus($(this))}));
                typeName[i-1] = key;
            };
            $(".search-type ul").children("li").eq(0).attr("class","search-type-focus");
            Select();
        }
    });

    /* 获取网站列表 */
    $.ajax({
        url: "res/json/site.json",
        method: "get",
        dataType: "json",
        success: function(res){
            var list = $("#item-box");
            for(let i in res.site){
                var div = $("<div>").attr("class","item-site").on("click",function(){ SiteJump(res.site[i].url); }).attr("title",res.site[i].name);
                var div_img_box = $("<div>").attr("class","item-site-img-box");
                var div_img = $("<div>").attr("class","item-site-img");
                var div_text = $("<div>").attr("class","item-site-text").html(res.site[i].name);
                var img = $("<img>").attr("src",res.site[i].icon).attr("width","100%").attr("height","100%");
                list.append( 
                    div.append( 
                        div_img_box.append(div_img.append(img))
                    ).append(div_text)
                );
            }
        }
    });

    /* 获取天气数据 */
    $.ajax({
        url: "https://www.tianqiapi.com/api/",
        method: "get",
        data: {"appid":"98233153","appsecret":"rr4VtbMH","version":"v1"},
        dataType: "json",
        success: function(res){
            var w = res.data[0];
            console.log(res.city, res.data[0].tem, res.data[0].air_level, res.data[0].wea);
            $(".weather-img>img").attr("src", "res/img/weather/"+w.wea_img+".png");
            $(".weather-text>p").eq(0).text(res.city);
            $(".weather-text>p").eq(1).text(w.tem + ' ' + w.air_level + ' ' + w.wea);
        }
    });
});

/* 网页跳转 */
var SiteJump = function(url){
    window.open(url);
}

/* 搜索类型选中之后 */
var Focus = function(obj){
    $(".search-type-focus").attr("class",'');
    obj.attr("class","search-type-focus");
    Select();
}

/* 展示select */
var Select = function(){
    $("#select").html(" ");
    var name = $(".search-type-focus").html();
    var arr = type[name];
    if(Object.getOwnPropertyNames(arr).length == 1 && arr['url'] != undefined){
        $("#select").append($("<option>").html(name).attr("data-type", "url"))
    }else{
        for(let key in arr){
            $("#select").append($("<option>").html(key).attr("data-type", key));
        };
    }
   
    // 设置默认搜索引擎
    $("#select").children("option[data-type='百度']").attr("selected",true);
}

/* 默认搜索引擎 */


/* 搜索 */
var Search = function(){
    // 获取输入的搜索内容
    var val = $("#content").val();
    if(!val){ swal("","请输入搜索内容","error"); return false; }
    
    // 获取搜索类型
    var focusType = $(".search-type-focus").data("type");
    // 获取该类型的搜索方式
    var method = $("#select :selected").data("type");
    // 获取该方式的地址
    url = type[typeName[focusType]][method];
    if(url == undefined){ swal("出错了","地址解析出错！","error"); return false;}
    // 搜索
    window.open(url + val);
}

/* 鼠标双击事件 */
$("#content").dblclick(function(){ Search(); });

/* 回车事件 */
$(document).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13' || event.key == 'Enter'){ Search(); }
});

/* 时间展示 */
var nowTime = function(){
    var myDate = new Date();
    return time = (myDate.getHours() < 10 ? "0"+myDate.getHours() : myDate.getHours())+":"+
                  (myDate.getMinutes() < 10 ? "0"+myDate.getMinutes() : myDate.getMinutes())+":"+
                  (myDate.getSeconds() < 10 ? "0"+myDate.getSeconds() : myDate.getSeconds());
}
var timeinterval = setInterval(function(){$("#time").html(nowTime)},1000);

/* 输入框关键词下拉选项 */
var scriptTag = $();
autoInput = function(obj){
    var val = obj.text();
    $("#content").val(val);
    $("#content").dblclick();
}
// 百度关键词API数据接收对象
window.baidu = {sug: function(obj){
    // console.log(obj.s);
    var keywords = $("#keywords")
    if(obj.s.length == 0){ $("#keywords").css("display","none") }
    else{ $("#keywords").css("display","block"); }
    keywords.html("");
    for(let val in obj.s){
        keywords.append($("<p>").text(obj.s[val]).on("click",function(){ autoInput($(this)); }));    
    }
}}
// 输入框变化发起请求
$("#content").bind("input propertychange",function(event){
    var val = $("#content").val();
    if(!val){ $("#keywords").css("display","none") }
    scriptTag.remove();
    scriptTag = $("<script>").attr("src","http://suggestion.baidu.com/su?p=3&ie=UTF-8&wd="+val);
    $("body").append(scriptTag);
});
// 收起展示
$(".background-cover").on("click",function(){ $("#keywords").css("display","none") });