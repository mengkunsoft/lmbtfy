<?php 
/**
 * 短网址 api，基于微博接口
 * 编写：mengkun(https://mkblog.cn)
 */

if(isset($_GET['url']) && $_GET['url']) {
    $result = array(
        'code'   => 200,
        'msg'    => 'success',
        'result' => shortUrl($_GET['url'])
    );
} else {
    $result = array(
        'code'   => -1,
        'msg'    => 'url is empty',
        'result' => null
    );
}
die(json_encode($result));

/**
 * 短网址生成函数
 * @param $longUrl 原始网址
 * @return 缩短后的网址
 */
function shortUrl($longUrl) {
    $url = 'http://api.weibo.com/2/short_url/shorten.json?source=2849184197&url_long=' . $longUrl;
    $ch = curl_init($url);  // 初始化
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // curl请求有返回的值
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_ENCODING, '');
    $output = curl_exec($ch);
    curl_close($ch);
    $obj = json_decode($output);
    $output = isset($obj->urls[0]->url_short)? $obj->urls[0]->url_short: '';    // 取出短网址的值
    return $output? $output: $longUrl;
}
