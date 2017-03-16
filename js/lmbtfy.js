/**
 * Created by bangbang on 14/10/10.
 * Revised by mengkun on 17/03/16
 */
 
function urlEncode(String) {
    return encodeURIComponent(String).replace(/'/g,"%27").replace(/"/g,"%22");	
}
 
$(document).ready(function (){
    ZeroClipboard.config({swfPath: '//cdnjscn.b0.upaiyun.com/libs/zeroclipboard/2.1.6/ZeroClipboard.swf'});
    var clip = new ZeroClipboard($('#copy'));
    $('#search').on('click', function (){
        var link = window.location.origin + window.location.pathname + '?' + urlEncode($('#kw').val());
        $.ajax({ 
            url: 'get.php?longUrl='+link,  
            type: "GET",
            dataType: "jsonp", //使用JSONP方法进行AJAX
            cache: false,
            success: function (data) {
                if (data){
                    if(!(typeof data.urls === undefined || typeof data.urls == "undefined"))   //防止短网址失败
                    {
                        link = data.urls[0].url_short;
                    }
                }
                $('#go').attr("href",link);
                $('#link').show();
                $('#instructions').text('复制下面的地址,然后发给伸手党吧！');
                $('#lmbtfyLink').val(link).focus().select();
            }
        })
    });
    var $container = $('.container');
    $container.on('click', '#go', function (){  //点击预览
        var link = $('#lmbtfyLink').val();
        if (!!link){
            //window.open(link); //新窗口打开
            //window.location = link;
        }
    });
    var $kw = $('#kw');
    $kw.on('keydown', function (e) {
        if (e.keyCode == 13){
            $('#search').trigger('click');
        }
    });
    if (!!window.location.search){
        var kw = decodeURIComponent(window.location.search.substr(1));
        var $instructions = $('#instructions');
        var $arrow = $('#arrow');
        setTimeout(function (){
            $instructions.text('1、找到输入框并选中');
            $arrow.show().animate({
                left: $kw.offset().left + 10 + 'px',
                top: ($kw.offset().top + $kw.height()/2) + 'px'
            }, 2000, function (){
                $instructions.text('2、输入你的问题');
                $arrow.hide();
                var $kw = $('#kw');
                $kw.focus();
                var i = 0;
                var interval = setInterval(function (){
                    $kw.val(kw.substr(0,i));
                    i++;
                    if (i > kw.length){
                        clearInterval(interval);
                        $instructions.text('3、按下“百度一下”按钮');
                        $arrow.show();
                        var $search = $('#search');
                        $arrow.animate({
                            left: $search.offset().left + $search.width()/2 + 'px',
                            top: $search.offset().top + $search.height()/2 + 'px'
                        }, 1000, function () {
                            $instructions.html('<strong>这对你而言就是这么困难么？</strong>');
                            setTimeout(function (){
                                window.location = 'http://www.baidu.com/s?ch=3&ie=utf-8&wd=' + encodeURIComponent(kw);
                            }, 2000);
                        })
                    }
                }, 200);
            });
        }, 1000);
    }
});


function showAbout()  //弹出消息
{
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
   
   var popupHeight = $("#msgbox").height();       
    var popupWidth = $("#msgbox").width(); 
        //添加并显示遮罩层   
    $("#mask").width(windowWidth).height(windowHeight).click(function() {hideAbout(); }).fadeIn(200); 
    $("#msgbox").css({"position": "absolute","left":windowWidth/2-popupWidth/2,"top":windowHeight/2-popupHeight/2}).fadeIn(200); 
}

function hideAbout()  //隐藏弹出的提示框
{
    $("#mask").fadeOut(200);
    $("#msgbox").fadeOut(200); 
}