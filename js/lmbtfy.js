/**
 * 原始代码来自 bangbang(http://lmbtfy.cn/)，mengkun(https://mkblog.cn) 在原作的基础上作了一些小修改，以适应移动端浏览
 * Github 地址：https://github.com/mengkunsoft/lmbtfy
 * 
 * 转载或使用时，还请保留以上信息，谢谢！
 */
$(document).ready(function () {
    /* 复制结果 */ 
    var clipboard = new ClipboardJS('.btn-copy');
    clipboard.on('success', function(e) {
        if (e.trigger.disabled === false || e.trigger.disabled === undefined) {
            showTips('<span style="color: #4caf50">复制成功！赶紧把链接甩给伸手党们！</span>');
        }
    });
    clipboard.on('error', function(e) {
        showTips('<span style="color: red">复制失败，请手动复制</span>');
    });
    
    var $outputLink = $('#output-link');
    $('#search').on('click', function () {
        var link = window.location.origin + window.location.pathname + '?' + encodeURIComponent($('#kw').val());
        $('#output-box').fadeIn();
        showTips('复制下面的地址');
        $outputLink.val(link).focus().select();
        
        /* 尝试缩短网址 */ 
        $.ajax({
            url: 'api.php?url=' + encodeURIComponent(link),
            dataType: 'json',
            success: function (data) {
                if(data.code == 200) $outputLink.val(data.result).focus().select();
            }
        });
    });
    
    /* 预览 */ 
    var $container = $('.container');
    $container.on('click', '#btn-preview', function () {
        var link = $outputLink.val();
        if (!!link) {
            window.open(link);
        }
    });
    
    /* 回车搜索 */ 
    var $kw = $('#kw');
    $kw.on('keydown', function (e) {
        if (e.keyCode == 13) {
            $('#search').trigger('click');
        }
    });
    
    if (!!window.location.search) {
        var kw = decodeURIComponent(window.location.search.substr(1));
        var $arrow = $('#arrow');
        
        showTips('让我来帮你百度一下');
        setTimeout(function() {
            showTips('1、找到输入框并选中');
            $arrow.show().animate({
                left: $kw.offset().left + 10 + 'px',
                top: ($kw.offset().top + $kw.height()/2) + 'px'
            }, 2000, function () {
                showTips('2、输入你的问题');
                $arrow.hide();
                var $kw = $('#kw');
                $kw.focus();
                var i = 0;
                var interval = setInterval(function () {
                    $kw.val(kw.substr(0,i));
                    i++;
                    if (i > kw.length) {
                        clearInterval(interval);
                        showTips('3、点击下“百度一下”按钮');
                        $arrow.show();
                        var $search = $('#search');
                        $arrow.animate({
                            left: $search.offset().left + $search.width()/2 + 'px',
                            top: $search.offset().top + $search.height()/2 + 'px'
                        }, 1000, function () {
                            showTips('<strong>这对你而言就是这么困难么？</strong>');
                            setTimeout(function () {
                                window.location = 'https://www.baidu.com/s?ch=3&ie=utf-8&wd=' + encodeURIComponent(kw);
                            }, 2000);
                        });
                    }
                }, 200);
            });
        }, 1000);
    }
});

/* 显示提示信息 */ 
function showTips(tips) {
    $('#instructions').html(tips);
}

/* 弹出关于信息 */ 
function showAbout() {
    var windowWidth = $(window).width(),
       windowHeight = $(window).height(),
        popupHeight = $("#about-box").height(),     
         popupWidth = $("#about-box").width(); 
    
    $("#about-box").css({
        "position": "absolute",
            "left": windowWidth / 2 - popupWidth / 2,
             "top": windowHeight / 2 - popupHeight / 2
    }).fadeIn(200); 
}