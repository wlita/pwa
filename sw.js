var cacheName = 'helloPWA'; //缓存名称

self.addEventListener('install', event => { //进入Service Worker安装事件
    event.waitUntil(
        caches.open(cacheName)  //使用指定缓存名打开缓存
        .then(cache => cache.addAll([
            '/pwa/img/1.png', //把资源添加到缓存中
            // '/pwa/img/3.png',
            '/pwa/js/index.js',
            '/pwa/css/styles.css'
            ]))
        );
});

self.addEventListener('install', function (event) {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        Promise.all([

            // 更新客户端
            self.clients.claim(),

        ])
    );
});


self.addEventListener('fetch', function(event) {    //为fetch时间添加事件监听器以拦截请求
    event.respondWith(
        caches.match(event.request, { ignoreSearch : true})     //当前请求是否匹配缓存中存在的任何内容（忽略任何查询字符串参数，这样便不会造成任何缓存未命中）
            .then(function(response) {
                if(response) {  //如果匹配，就此返回缓存并不再继续执行
                    console.log('读取缓存：', response);
                    return response;
                }

                var requestToCache = event.request.clone(); //复制请求，请求是一个流，只能使用一次

                return fetch(requestToCache).then(  //尝试按照预期发起原始的HTTP请求
                    function(response) {
                        if(!response || response.status != 200) {   //如果请求失败或服务器响应了错误代码，则立即返回错误消息
                            return response;
                        }

                        var responseToCache = response.clone(); //再次复制响应，因为需要将其添加到缓存中，而且它还将用于最终返回响应

                        caches.open(cacheName)  //打开对应名称的缓存
                            .then(function (cache) {
                                cache.put(requestToCache, responseToCache); //将响应添加到缓存中
                            });
                        return response;
                    }
                );
            })
        );
});
