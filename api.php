<?php 
/**
 * 短网址 API
 * 编写：mengkun(https://mkblog.cn)
 * 感谢 https://dwz.gg 提供的接口
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
 * 短网址生成函数 https://likinming.com/post-2554.html
 * @param $longUrl 原始网址
 * @return 缩短后的网址
 */
function shortUrl($longUrl) {
    $result = file_get_contents('https://eps.gs/api/make.php?url='.$longUrl);
    $result = json_decode($result, true);
    if(isset($result['url_short'])) {
        return $result['url_short'];
    } else {
        return $longUrl;
    }
}
