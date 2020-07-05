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
    "revision": "6bae1fd9510833d8facac39ab6d56f69"
  },
  {
    "url": "about/contact.html",
    "revision": "03ff0cc1fdd192b1e03c078cd3f551bf"
  },
  {
    "url": "about/contributing.html",
    "revision": "7a741661ef79a461902df5193cd49798"
  },
  {
    "url": "about/index.html",
    "revision": "14e314fbddb54f1292fbd47b1a8b91a9"
  },
  {
    "url": "about/license.html",
    "revision": "b164322a39bda35e4edbfcf9787a0b57"
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
    "url": "assets/js/10.ec04df26.js",
    "revision": "f026dd91d60162c93b0b06f5d75d74d3"
  },
  {
    "url": "assets/js/11.1609966d.js",
    "revision": "7cefa6af9624213dcc567bff168c6b0e"
  },
  {
    "url": "assets/js/12.01c5f693.js",
    "revision": "1e032d97d5637253218cc7d831229398"
  },
  {
    "url": "assets/js/13.0bce7a1a.js",
    "revision": "d131c4edee9d8abb468fe7328b5f450b"
  },
  {
    "url": "assets/js/14.516fcec2.js",
    "revision": "55145ca4deecbb7391e0e94f3e6bbb5d"
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
    "url": "assets/js/7.011161b6.js",
    "revision": "86c2f257124773bafff863640075eaba"
  },
  {
    "url": "assets/js/8.d9cc9bca.js",
    "revision": "781f291064fdbfeb06a77777e246c97d"
  },
  {
    "url": "assets/js/9.c3fc79e8.js",
    "revision": "cc94fd4901ae97891119d37e17798b88"
  },
  {
    "url": "assets/js/app.d81ed2e7.js",
    "revision": "b01887c5ce0a6eca43e4056806847b3b"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "d2f12ab779e14359fb37cbeb49638ad4"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "ac42fd1df37d4fc178735593031d2d6e"
  },
  {
    "url": "fr/about/index.html",
    "revision": "54b61e054bdc24b62f70b967d87be622"
  },
  {
    "url": "fr/about/license.html",
    "revision": "387a3bf2066dd0bc025d76839c7ca6af"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "9055782a668f4a2a67132fba19b56003"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "c0355195d94587a4b2bd5c79dc9a1a02"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "b9fbcc9b1e4a008ddccaa88a96ce7f0c"
  },
  {
    "url": "fr/gofurther/processes.html",
    "revision": "3543dbb37ccab0624056b5996c79cfa7"
  },
  {
    "url": "fr/index.html",
    "revision": "41bafd7aa3739d375369ff75afe9a6fb"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "c28a30f3a3069cd76318380e9a78e2fd"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "fd3efd83cc1115a6fb390c581b471197"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "1ca6b7672247c241bf7615a80c41b3d3"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "4cdfae87c0f6bdbae5d4f759e8a2b44c"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "abcc547bbfab48243743bf65c72b43ec"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "4825da770c07994c9955d9c36471bd01"
  },
  {
    "url": "gofurther/index.html",
    "revision": "a17679773bbaa8c0b91920caedbec771"
  },
  {
    "url": "gofurther/processes.html",
    "revision": "45470d67b7fc37bef11613038dc175e8"
  },
  {
    "url": "index.html",
    "revision": "0f37f8af6fd4a0f998372de234438184"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "63794aea5e44e8ec71add9dda609aad6"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "a04a25182932903f50bec5fd7280811d"
  },
  {
    "url": "quickstart/features.html",
    "revision": "1b8147f569f83c2c7dd34ff0176dacd0"
  },
  {
    "url": "quickstart/index.html",
    "revision": "8a9441e5e46997c34c5a99d158d4ae1b"
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
