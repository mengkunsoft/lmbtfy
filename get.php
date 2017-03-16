<?php 
// 新浪短网址api
// 编写：mengkun(http://mkblog.cn)

echoJson(shortUrl(getParam('longUrl','http://lab.mkblog.cn/lmbtfy/')));

/**
 * 短网址函数
 * @param $longUrl 原始网址
 * @return 缩短后的网址
 */
function shortUrl($longUrl) {
    $url = "http://api.weibo.com/2/short_url/shorten.json?source=2849184197&url_long=" . urlencode($longUrl);
    $ch = curl_init($url);  //初始化
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // curl请求有返回的值
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_ENCODING, "");
    $output = curl_exec($ch);   //执行并获取HTML文档内容
    curl_close($ch);    //释放curl句柄
    // $obj = json_decode($output);
    // $output = isset($obj->urls[0]->url_short)? $obj->urls[0]->url_short: '';    // 取出短网址的值
    return $output;
}

/**
 * 获取GET或POST过来的参数
 * @param $key 键值
 * @param $default 默认值
 * @return 获取到的内容（没有则为默认值）
 */
function getParam($key,$default='')
{
    return trim($key && is_string($key) ? (isset($_POST[$key]) ? $_POST[$key] : (isset($_GET[$key]) ? $_GET[$key] : $default)) : $default);
}

/**
 * 输出返回结果，支持输出 json和jsonp 格式
 * @param $data 输出的内容(json格式)
 */
function echoJson($data)    //json和jsonp通用
{
    $callback = getParam('callback');
    if($callback != '') //输出jsonp格式
    {
        die($callback.'('.$data.')');
    }
    else
    {
        die($data);
    }
}