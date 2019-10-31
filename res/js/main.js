
$(document).ready(function(){

    $(".search-type > ul > li").on("click", function(){ Focus($(this)); });

    // 获取背景图片
    $.ajax({
        url: "https://api.i-meto.com/api/v1/bing/random",
        method: 'get',
        dataType: 'json',
        success: function(res){
            // 背景图片
            $('body').eq(0).css('background','url('+ res.url +')');
            // 图片信息展示
            $(".pic-info>p").eq(0).html(res.title);
            $(".pic-info>p").eq(1).html(res.copyright);
        }
    });

    // 获取搜索方式
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
});

// 搜索类型选中之后
var Focus = function(obj){
    $(".search-type-focus").attr("class",'');
    obj.attr("class","search-type-focus");
    Select();
}

// 展示select
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

// 默认搜索引擎


// 搜索
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

// 鼠标双击事件
$("#content").dblclick(function(){ Search(); });

// 回车事件
$(document).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13' || event.key == 'Enter'){ Search(); }
});

// 时间展示
var nowTime = function(){
    var myDate = new Date();
    return time = (myDate.getHours() < 10 ? "0"+myDate.getHours() : myDate.getHours())+":"+
                  (myDate.getMinutes() < 10 ? "0"+myDate.getMinutes() : myDate.getMinutes())+":"+
                  (myDate.getSeconds() < 10 ? "0"+myDate.getSeconds() : myDate.getSeconds());
}
var timeinterval = setInterval(function(){$("#time").html(nowTime)},1000);

