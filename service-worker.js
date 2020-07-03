/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "41c59c46e15352caa4535d7abd63f1e5"
  },
  {
    "url": "about/contact.html",
    "revision": "a43fe7d5ecf09f0cbc2f605135496ca1"
  },
  {
    "url": "about/contributing.html",
    "revision": "9b4b04c709d5f82ea6e26b5c686e4066"
  },
  {
    "url": "about/index.html",
    "revision": "49ae8d46cda227fe7dbf126f6d889a4f"
  },
  {
    "url": "about/license.html",
    "revision": "c03b34bc8628f7b68ecbaaf8eb6155a8"
  },
  {
    "url": "assets/css/0.styles.63401feb.css",
    "revision": "89f6e35f1b665fc46fd71f60fd66533a"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.7fe8f341.js",
    "revision": "b54e8d841d846d198870ba52aa78d367"
  },
  {
    "url": "assets/js/11.376b5c30.js",
    "revision": "3c2f63ed391cb343003c1f183fdd01f2"
  },
  {
    "url": "assets/js/12.2b439a4f.js",
    "revision": "c2889f7699951b37fab7c1952548208f"
  },
  {
    "url": "assets/js/13.c150d499.js",
    "revision": "d2bb6bc6015201bbd4051361953207bd"
  },
  {
    "url": "assets/js/14.9c27bae6.js",
    "revision": "313cf8b8246332dbeff54fa9250f4132"
  },
  {
    "url": "assets/js/15.06e0ae5f.js",
    "revision": "9bc15e0719a63373536163785de3e551"
  },
  {
    "url": "assets/js/16.dcbf18ca.js",
    "revision": "ffcb030fa39424db5989d0f8e3b9e34e"
  },
  {
    "url": "assets/js/17.8495a32b.js",
    "revision": "89ce0872a2736b1591f693c28a0a4f20"
  },
  {
    "url": "assets/js/18.fc9a7777.js",
    "revision": "4bac8493dcafdc19f1db0e0ade03f91a"
  },
  {
    "url": "assets/js/19.ac92b4e0.js",
    "revision": "3d5008f2ec1ce147d36fc59340ef30d7"
  },
  {
    "url": "assets/js/2.77b98ac2.js",
    "revision": "8bf3548d2346e814d4d534ac90e284aa"
  },
  {
    "url": "assets/js/20.f5a70548.js",
    "revision": "300aa9805144457df82b26eb3e72072b"
  },
  {
    "url": "assets/js/21.a2f19396.js",
    "revision": "9577793eb879dd37d894e7a4e50656bb"
  },
  {
    "url": "assets/js/22.9878e8a5.js",
    "revision": "10f7f2227161b937a184aaf3f0cc03e7"
  },
  {
    "url": "assets/js/23.c3278f8b.js",
    "revision": "6f3c0a79b9101ea5e62d00c9b98a7e0d"
  },
  {
    "url": "assets/js/24.25a387fb.js",
    "revision": "95172005c25bc516378fa0f208608025"
  },
  {
    "url": "assets/js/25.8f7da961.js",
    "revision": "7e79e981061eb8910b7db8d2085542bf"
  },
  {
    "url": "assets/js/26.ea50ef1a.js",
    "revision": "e16e976e3d61a1790a325a48a9fc2108"
  },
  {
    "url": "assets/js/27.2b873be5.js",
    "revision": "0e401ad152188fcbb3041c4675acdd88"
  },
  {
    "url": "assets/js/28.6b41c2cd.js",
    "revision": "0fdac6102bde0ee019ca7a24f310df9d"
  },
  {
    "url": "assets/js/29.23b48d97.js",
    "revision": "7f62007c3be8cfb19332c1541233e949"
  },
  {
    "url": "assets/js/3.61d9df4f.js",
    "revision": "ed4946939bc54e44f0666947e4b017a0"
  },
  {
    "url": "assets/js/30.89966573.js",
    "revision": "759c516b87d9bb3b0c6e064a48b5ad0f"
  },
  {
    "url": "assets/js/31.1e4e2654.js",
    "revision": "8335ed86f79079226f3fc9b9c0e1a5f0"
  },
  {
    "url": "assets/js/32.0b49499e.js",
    "revision": "541c6d4c3ad549a99a435bca4f52d579"
  },
  {
    "url": "assets/js/33.3205fee2.js",
    "revision": "714ca96611a7e75b26a25ee464d0f510"
  },
  {
    "url": "assets/js/34.665a5270.js",
    "revision": "066835f2bacde040d1d5f81611884f03"
  },
  {
    "url": "assets/js/4.8f903346.js",
    "revision": "b2c37149a42ad8e26403c6b5b8f845cb"
  },
  {
    "url": "assets/js/5.5a0a6c49.js",
    "revision": "556799e3ef0076126124762e3f4ae97d"
  },
  {
    "url": "assets/js/6.a41b62e8.js",
    "revision": "9793da5713af918656ff06125c364375"
  },
  {
    "url": "assets/js/7.fc7cad61.js",
    "revision": "aad4b91e6f4e092883ab9b5fb2984c36"
  },
  {
    "url": "assets/js/8.a3ae1227.js",
    "revision": "b54ba4a46a4a1490fac7e4daa35a6bf7"
  },
  {
    "url": "assets/js/9.69cb8588.js",
    "revision": "123e095834ff193dc83d8c42fdcae5eb"
  },
  {
    "url": "assets/js/app.161e75a6.js",
    "revision": "87eccbec5b15be19d9e2f6a1150ac538"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "003ce2602f35c3a6d0f18de7d79a129d"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "bbb85ffdcab3a3ea568c507b8828e501"
  },
  {
    "url": "fr/about/index.html",
    "revision": "83ee4d75d58b04045c833536779ae4a8"
  },
  {
    "url": "fr/about/license.html",
    "revision": "3fe19946e139dec8dc418741ae802e33"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "8e85e6dc5b13f7937a5ea5411789e774"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "1d4d8e069db3fbb22cd732728d37c5a7"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "43d3def65b6e6924d160b0c250ef3f54"
  },
  {
    "url": "fr/gofurther/processes.html",
    "revision": "6a9b0edb0febaa1c69609f35e7b33c78"
  },
  {
    "url": "fr/index.html",
    "revision": "c35db72cf86e54bf54a96de9bbe83fc9"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "cc40719d80440095505a505266ffb05d"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "4d6b07ca47e34058245eb4c2bfb79ee1"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "80013547cfa4670468f8a3784e892111"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "996154d2628f4651ee67fd4d27b97a20"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "455a8abfdc7a191da176d27d9580c2ed"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "df310f9ae5b765ad5b6a1931544d9744"
  },
  {
    "url": "gofurther/index.html",
    "revision": "94fdb99b31d865ed85183d36c614dd9e"
  },
  {
    "url": "gofurther/processes.html",
    "revision": "bcb056cdbb5c1091fc02c970c8a81fe2"
  },
  {
    "url": "index.html",
    "revision": "c86b011bc745278459cb7306728866ab"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "a715da0ab781a22c01e09efc43ee7341"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "c2be19c8d78b307542700f264995147d"
  },
  {
    "url": "quickstart/features.html",
    "revision": "dbe91f47f06ea1f2dcea0e06fd8e97bf"
  },
  {
    "url": "quickstart/index.html",
    "revision": "c1ac99a192d42b8392ff0d180823a2bd"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
