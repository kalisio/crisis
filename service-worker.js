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
    "revision": "eeef909675b48d80398dd0b7d245d025"
  },
  {
    "url": "about/contact.html",
    "revision": "7b0795c1cde588cb723bbaffcba61a47"
  },
  {
    "url": "about/contributing.html",
    "revision": "144ae6b7420b462e6f05761f4c45ae0c"
  },
  {
    "url": "about/index.html",
    "revision": "f855591a67beed21d243c813265c7ddc"
  },
  {
    "url": "about/license.html",
    "revision": "f92adf9af70dd41a418ccf8b8584a5a2"
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
    "url": "assets/js/23.3b831c84.js",
    "revision": "fe2ee7b91f91f2e35530be8cf7a2d891"
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
    "url": "assets/js/31.d1536a9f.js",
    "revision": "27d99e0fc2b70f6dc0cf2435e8ee2275"
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
    "url": "assets/js/app.ae70de97.js",
    "revision": "42d06ec8bb7dd44615f3852da08aa8df"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "aeb925d527ac2f7d4f1392775f905e5b"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "2f928c9bddd96aa8c90c1fc6fee5d33c"
  },
  {
    "url": "fr/about/index.html",
    "revision": "75ecea8278aff1bc5b7363e77ecea9d1"
  },
  {
    "url": "fr/about/license.html",
    "revision": "036319b8459321ff710223d3829fa0c7"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "d39ebb1925d5006d8c8503491884a4d1"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "f8f7ab86ae457d08f03430ef16e7d522"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "8d4af97366582238d567e9e37898694d"
  },
  {
    "url": "fr/gofurther/processes.html",
    "revision": "dfd18baeae1af6a1953e33cff60b5940"
  },
  {
    "url": "fr/index.html",
    "revision": "0f4ed533e246e717c3831bfd522c0cf7"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "d0f479eca53f8dfd33750b9bf1b7e764"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "12cb3a21df513e3d75d61f75dafa42da"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "49a48ffa86f91927962cc3a4528f5281"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "82003e5c7f57c42f8790bf30c6051d45"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "b8c5b37ae3314d01340e6fc2e8385948"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "e346b6c12fc9e614cdc125596fdad3ac"
  },
  {
    "url": "gofurther/index.html",
    "revision": "790a552a62a7b352d128496065e0b8a6"
  },
  {
    "url": "gofurther/processes.html",
    "revision": "aa3da840d3475ad7cc0d6ae8b74f1be0"
  },
  {
    "url": "index.html",
    "revision": "3afec24b1d2bb0dc0706526d041a5d81"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "071376c4855d080cb5cae41546f26c1c"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "a78d7a4b8bc293fe51521b1ae2a87a89"
  },
  {
    "url": "quickstart/features.html",
    "revision": "3e70cf2eb024652bf110843dfd2a42a0"
  },
  {
    "url": "quickstart/index.html",
    "revision": "adb9ef32dea70267b9d4d2035a033c78"
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
