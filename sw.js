// 用于标注创建的缓存，也可以根据它来建立版本规范
// const CACHE_NAME = "v1.2.7";
// const url = '/'
// // 列举要默认缓存的静态资源，一般用于离线使用
// const urlsToCache = [
//     url + 'img/1.png',
//     url + 'img/3.png'
// ];

self.addEventListener('install', (event) => {
    console.log('install %s', '安装')
    /**
     * event.waitUtil 用于在安装成功之前执行一些预装逻辑
     * 安装成功后 ServiceWorker 状态会从 installing 变为 installed。
     * self.skipWaiting 执行该方法表示强制当前处在 waiting 状态的 Service Worker 进入 activate 状态。
     */
    // event.waitUntil(self.skipWaiting());
})
self.addEventListener('activate', (event) => {
    console.log('activate %s', '激活')
    /**
     * self.clients.claim 在 activate 事件回调中执行该方法表示取得页面的控制权, 
     * 这样之后打开页面都会使用版本更新的缓存。
     * 旧的 Service Worker 脚本不再控制着页面，之后会被停止。
     */
    // event.waitUntil(self.clients.claim())
})
self.addEventListener('fetch', () => {
    console.log('fetch %s', '拦截')
})
self.addEventListener('message', () => {
    console.log('message %s', '通信')
})

// this.addEventListener('install', () => { console.log('install') })
// this.addEventListener('activate', () => { console.log('activate') })
// this.addEventListener('fetch', () => { console.log('fetch') })


// // self 为当前 scope 内的上下文
// self.addEventListener('install', event => {
//     // event.waitUtil 用于在安装成功之前执行一些预装逻辑
//     // 但是建议只做一些轻量级和非常重要资源的缓存，减少安装失败的概率
//     // 安装成功后 ServiceWorker 状态会从 installing 变为 installed
//     event.waitUntil(
//         // 使用 cache API 打开指定的 cache 文件
//         caches.open(CACHE_NAME).then(cache => {
//             console.log(cache);
//             // 添加要缓存的资源列表
//             return cache.addAll(urlsToCache);
//         })
//     );

//     event.waitUntil(self.skipWaiting());
// });


// self.addEventListener('activate', function (event) {
//     event.waitUntil(
//         Promise.all([

//             // 更新客户端
//             self.clients.claim(),

//             // 清理旧版本
//             caches.keys().then(function (cacheList) {
//                 return Promise.all(
//                     cacheList.map(function (cacheName) {
//                         if (cacheName !== CACHE_NAME) {
//                             return caches.delete(cacheName);
//                         }
//                     })
//                 );
//             })
//         ])
//     );
// });


// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request).then(function (response) {
//             // 来来来，代理可以搞一些代理的事情

//             // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
//             if (response) {
//                 return response;
//             }

//             // 如果 service worker 没有返回，那就得直接请求真实远程服务
//             var request = event.request.clone(); // 把原始请求拷过来
//             return fetch(request).then(function (httpRes) {

//                 // http请求的返回已被抓到，可以处置了。

//                 // 请求失败了，直接返回失败的结果就好了。。
//                 if (!httpRes || httpRes.status !== 200) {
//                     return httpRes;
//                 }

//                 // 请求成功的话，将请求缓存起来。
//                 var responseClone = httpRes.clone();

//                 caches.open(CACHE_NAME).then(function (cache) {

//                     // 页面不缓存
//                     // if (responseClone && responseClone.url === 'http://127.0.0.1:8080/') {
//                     //     return
//                     // }

//                     cache.put(event.request, responseClone);
//                 });

//                 return httpRes;
//             });
//         })
//     );
// });