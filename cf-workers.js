addEventListener('fetch', event => { event.respondWith(handleRequest(event.request)); });

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
var url = new URL(request.url);
var keyword = url.pathname.replace(/(\/)/g, '');
return new Response(`
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta http-equiv="Cache-Control" content="no-transform">
<meta http-equiv="Cache-Control" content="no-siteapp">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>让我帮你百度一下 | Let Me Baidu That For You</title>
<link rel="shortcut icon" href="https://cdn.jsdelivr.net/gh/mengkunsoft/lmbtfy@master/favicon.ico">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mengkunsoft/lmbtfy@master/css/style.css" />
<script src="https://cdn.jsdelivr.net/gh/mengkunsoft/lmbtfy@master/js/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/mengkunsoft/lmbtfy@master/js/base64.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/mengkunsoft/lmbtfy@master/js/clipboard.min.js"></script>
<script>
/**
 * 让我帮你百度一下【重制版】
 * GitHub 开源地址：https://github.com/mengkunsoft/lmbtfy
 **
 * 原始版本来自 bangbang(http://lmbtfy.cn/)，mengkun(https://mkblog.cn) 在原作的基础上进行了重制，风格变更为新版百度 UI，并适配了移动端
 * 交互效果参考了 不会百度么？(http://buhuibaidu.me/)
 **
 * 转载或使用时，还请保留以上信息，谢谢！
 **
 * 移植：宝硕 https://github.com/renbaoshuo
 */ 

/* 低版本 IE polyfill */ 
if(!window.location.origin) {
window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

$(function() {
var $kw = $('#kw'),
$searchSubmit = $('#search-submit');
$urlOutput = $('#url-output'),
$tips = $('#tips'),
$stop = $('#stop'),
$arrow = $('#arrow');

var stepTimeout, typeInterval;

/* 获取并解析查询参数 */ 
var query = "${keyword}";

if(!!query) {
try {
query = Base64.decode(query);
} catch(e) {
console.log(e);
}
}

/* 有参数，启动百度教程 */
if(!!query) {
$tips.html('让我来教你正确的打开方式');
$stop.fadeIn();

stepTimeout = setTimeout(function() {
$tips.html('1、找到输入框并选中');

$arrow.removeClass('active').show().animate({
left: $kw.offset().left + 20 + 'px',
top: ($kw.offset().top + $kw.outerHeight() / 2) + 'px'
}, 2000, function () {
$tips.html('2、输入你要找的内容');
$arrow.addClass('active');

stepTimeout = setTimeout(function() {
$arrow.fadeOut();

var i = 0;
typeInterval = setInterval(function () {
$kw.val(query.substr(0, i));
if (++i > query.length) {
clearInterval(typeInterval);
$tips.html('3、点击下“百度一下”按钮');

$arrow.removeClass('active').fadeIn().animate({
left: $searchSubmit.offset().left + $searchSubmit.width()  / 2 + 'px',
top:  $searchSubmit.offset().top  + $searchSubmit.height() / 2 + 'px'
}, 1000, function () {
$tips.html('<strong>怎么样，学会了吗？</strong>');
$arrow.addClass('active');

stepTimeout = setTimeout(function () {
window.location = 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURIComponent(query);
}, 1000);
});
}
}, 200);
}, 500);
});
}, 1000);
}

/* 自己人，停下 */ 
$stop.click(function() {
clearTimeout(stepTimeout);
clearInterval(typeInterval);
$stop.hide();
$arrow.stop().hide();
$kw.val(query);
query = false;
$tips.html('输入一个问题，然后点击百度一下');
});

/* 提交 */
$('#search-form').submit(function() {
if(!!query) return false;

var question = $.trim($kw.val());
if(!question) {
$tips.html('<span style="color: red">搜了个寂寞？</span>');
$kw.val('');
} else {
$tips.html('↓↓↓ 复制下面的链接，教伸手党使用百度');
$('#output').fadeIn();
$urlOutput.val(window.location.origin + window.location.pathname + /*'?q=' +*/ Base64.encode(question)).focus().select();
}
return false;
});

/* 复制结果 */ 
var clipboard = new ClipboardJS('[data-clipboard-target]');
clipboard.on('success', function(e) {
$tips.html('<span style="color: #4caf50">复制成功！赶紧把链接甩给伸手党们！</span>');
});
clipboard.on('error', function(e) {
$tips.html('<span style="color: red">复制失败，请手动复制...</span>');
});

/* 预览 */ 
$('#preview').click(function() {
var link = $urlOutput.val();
if (!!link) {
window.open(link);
}
});
});
</script>

</head>
<body>
<section id="search">
<div class="search-header">
<h2>
<span class="let-me">让我帮你</span> 
<img src="https://cdn.jsdelivr.net/gh/mengkunsoft/lmbtfy@master/img/baidu_logo.png" alt="百度" title="让我帮你百度一下"> 
<span class="for-you">一下</span>
</h2>
</div>

<form id="search-form">
<div class="search-form-group">
<div class="search-form-input">
<input type="search" id="kw" maxlength="255" autocomplete="off" required>
</div>
<button id="search-submit">百度一下</button>
</div>
</form>
</section>

<section id="function">
<p id="tips">输入一个问题，然后点击百度一下</p>
<button id="stop">快停下！我是自己人</button>
<div id="output">
<textarea id="url-output" rows="3" readonly></textarea>
<div class="tool-btns">
<button data-clipboard-target="#url-output">复制</button>
<button id="preview">预览</button>
</div></div>
</section>
<footer id="footer">
<ul class="footer-left">
<li><a href="https://github.com/mengkunsoft/lmbtfy" target="_blank">源码下载</a></li>
<li><a href="http://lab.mkblog.cn/" target="_blank">更多好玩</a></li>
</ul>     
<ul class="footer-right">
<li>* 本站与百度公司没有任何联系，baidu 以及本站出现的百度公司 Logo 是百度公司的商标</li>
<li>* 本项目由 <a href="https://baoshuo.ren">宝硕</a> 移植到 CloudFlare Workers 平台上.</li>
</ul>
</footer>
<div id="arrow"></div>
</body>
</html>
`, {
    status: 200,
    headers: {
        'content-type': 'text/html'
    }
});
}
