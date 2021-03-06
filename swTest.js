// 用于标注创建的缓存，也可以根据它来建立版本规范
const CACHE_NAME = "v1.1.0"
// 列举要默认缓存的静态资源，一般用于离线使用
const initCache = [
    '/',
    'icon.png'
]

// self 为当前 scope 内的上下文
self.addEventListener('install', event => {
    // event.waitUtil 用于在安装成功之前执行一些预装逻辑
    // 但是建议只做一些轻量级和非常重要资源的缓存，减少安装失败的概率
    // 安装成功后 ServiceWorker 状态会从 installing 变为 installed
    event.waitUntil(
        // 使用 cache API 打开指定的 cache 文件
        caches.open(CACHE_NAME).then(cache => {
            console.log('adding to cache:', initCache);
            // 添加要缓存的资源列表
            return cache.addAll(initCache);
        }).then(() => {
            console.log('Skip waiting!')
            return self.skipWaiting()
        })
    );
});


self.addEventListener('activate', function (event) {
    event.waitUntil(
        Promise.all([
            // 清理旧版本
            caches.keys().then(cacheNames => {
                return cacheNames.map(name => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name)
                    }
                })
            })
        ]).then(() => {
            // 更新客户端
            return self.clients.claim()
        })
    );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // 来来来，代理可以搞一些代理的事情

            // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
            if (response) {
                return response;
            }

            // 如果 service worker 没有返回，那就得直接请求真实远程服务
            var request = event.request.clone(); // 把原始请求拷过来
            return fetch(request).then(function (httpRes) {

                // 请求失败了，直接返回失败的结果就好了。。
                if (!httpRes || httpRes.status !== 200) {
                    return httpRes;
                }

                // 请求成功的话，将请求缓存起来。
                var responseClone = httpRes.clone();

                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, responseClone);
                });

                return httpRes;
            });
        })
    );
});