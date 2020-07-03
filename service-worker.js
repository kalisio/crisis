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
    "revision": "69712ef3cfa630082a703741d7ee2194"
  },
  {
    "url": "about/contact.html",
    "revision": "9ce8b486e0ee1c86f3faee0eeac349f1"
  },
  {
    "url": "about/contributing.html",
    "revision": "62cd0a50c60c888984491f151989f4a8"
  },
  {
    "url": "about/index.html",
    "revision": "84957aa8014f3aa38d5e9d5af8d948ba"
  },
  {
    "url": "about/license.html",
    "revision": "e00ce08552ae1456e953bb93716c534e"
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
    "url": "assets/js/app.252f5aee.js",
    "revision": "92a7e969b789010617dc0701055dd12a"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "ecfb60c44550160d59b54e4a359322d8"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "2a62d9aad831ef5fd4861e5d308bb084"
  },
  {
    "url": "fr/about/index.html",
    "revision": "691212004069f091cdc7c00c23f466fc"
  },
  {
    "url": "fr/about/license.html",
    "revision": "122d2622bbeefcc35a499ea0dc4cbc82"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "7d789cbec867bdf8ed8fe46d6571de74"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "26f278648625d1ec319044e6f4419900"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "4a4eba2e1cccf36b91d04d8feb9b9ccd"
  },
  {
    "url": "fr/gofurther/processes.html",
    "revision": "a89b23d63eb4613a7d89d81255fd34bf"
  },
  {
    "url": "fr/index.html",
    "revision": "320b75b73a7ce5c58b7c8666a72c7a2f"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "db559954338ac1041e8539735624be3d"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "bb1b6022bc0cc22567ffbdec6b0521da"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "c4de9e456a34ffda83ba8f1f8b9e667f"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "c44066132f2ac22592981e6153cea75f"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "064a8eb9c4d175acb4662ba973dffdaf"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "e5cd7e3a4a823b3b9fd4ed6af5b76397"
  },
  {
    "url": "gofurther/index.html",
    "revision": "e3ffdc47147a79cfaffa846c295294e7"
  },
  {
    "url": "gofurther/processes.html",
    "revision": "15b53ad01df192241a3bef2ad63b5e15"
  },
  {
    "url": "index.html",
    "revision": "7ea2ef0addd648839905782d94d70417"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "1d1b5b7a845fffbe48f64d94b8bef485"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "e5a6ec387f0e0f4b8947ecebfcf8d8e2"
  },
  {
    "url": "quickstart/features.html",
    "revision": "0c0321c3a82cdeb1bae7732621d2299f"
  },
  {
    "url": "quickstart/index.html",
    "revision": "33a306784f5044c6a5c3b38ec551f438"
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
