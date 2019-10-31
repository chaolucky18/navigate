var focus = $(".search-type ul");
focus.children("li").eq(0).attr("class","search-type-focus");

$(document).ready(function(){
    // 获取背景图片
    $.ajax({
        url: "https://api.i-meto.com/api/v1/bing/random",
        method: 'get',
        dataType: 'json',
        success: function(res){
            console.log(res.title); 
            $('body').eq(0).css('background','url('+ res.url +')');
        }
    });

    // 存储搜索方式
    var num = 0;
    var type = {};

    var type = [{"name":"百度","url":"https://www.baidu.com/s?ie=utf-8&wd="},
                {"name":"图片","url":"http://image.baidu.com/search/index?tn=baiduimage&word="},
                {"name":"新闻","url":"https://www.baidu.com/s?&tn=news&word="},
                {"name":"B站","url":"https://search.bilibili.com/all?from_source=banner_search&keyword="},
                {"name":"菜鸟教程","url":"https://www.runoob.com/?s="}];

    type.forEach(element => {
        localStorage.setItem("item_" + num++, [element.name,element.url]);
    });
});

// 搜索
var Search = function(){
    // 获取输入的搜索内容
    var val = $("#content").val();
    if(!val){alert("请输入内容");return false;}
    
    // 获取搜索类型
    var type = $(".search-type-focus").data("type");
    // 获取该类型的搜索方式
    
    // 搜索
    window.open(url);
}

// 鼠标双击事件
$("#content").dblclick(function(){ Search(); });

// 回车事件
$(document).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13' || event.key == 'Enter'){ Search(); }
});


$(".search-type > ul > li").on("click",function(){
    $(".search-type-focus").attr("class",'');
    $(this).attr("class","search-type-focus");
});