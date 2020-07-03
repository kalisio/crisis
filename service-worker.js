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
    "revision": "8dd123da3970ac804ebba152c64617a1"
  },
  {
    "url": "about/contact.html",
    "revision": "3d2623957292e66c3d2c0e444fb1fc86"
  },
  {
    "url": "about/contributing.html",
    "revision": "badb458fe2fe574dbb562a95aeb252c4"
  },
  {
    "url": "about/index.html",
    "revision": "68b3e74e70178238c91bc8f1b3dbeaf8"
  },
  {
    "url": "about/license.html",
    "revision": "31c5c0278ef0710da62521811f4c92e0"
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
    "url": "assets/js/app.44e27c51.js",
    "revision": "0ddb5ee7f2b2c32f246ed79df355ede7"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "1018176742f6187c7527144c93f05a94"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "4f8ffc176a182971a6a2c1ff169c6ad8"
  },
  {
    "url": "fr/about/index.html",
    "revision": "f48bf64ffe5ea17f2c5875620ccdf336"
  },
  {
    "url": "fr/about/license.html",
    "revision": "78f66bdf7a1316f09fde78927f2ce69b"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "a89cfae41f69cf5fbef6091a71a2f880"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "a9363133da00b10594d41076f02b581c"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "4c3bd80c1ecc85568d63c49a1b3dfc9d"
  },
  {
    "url": "fr/gofurther/processes.html",
    "revision": "dfb6c88451fbf92088cc96634dc07773"
  },
  {
    "url": "fr/index.html",
    "revision": "926794688a4057623fe2e8c856ce54b4"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "3e75f1b6adc823809bc21efe26541b04"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "c123529b387dd1103e251cc068106cfe"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "f546353d302461f81fa9b0854a32e44d"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "c29eecbbd7c47a22af1a031c1eb89a95"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "aa60dd625d5ea5724f45563e7b8cd677"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "1eb30dd275918c24e96bf8d168e56d58"
  },
  {
    "url": "gofurther/index.html",
    "revision": "54379b38b77df2952e74725b1c4c36c9"
  },
  {
    "url": "gofurther/processes.html",
    "revision": "26a8300fe556a451337d1f8bee54dc49"
  },
  {
    "url": "index.html",
    "revision": "ed4b94d01d0f58487dfbe5240639068c"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "e8f73684b8f51ab839bedf1930232cff"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "efbb36af1295b87897903657e6096578"
  },
  {
    "url": "quickstart/features.html",
    "revision": "eaf3f8dd6981514450265fa1656e8474"
  },
  {
    "url": "quickstart/index.html",
    "revision": "ec4bebbaa1732f48f4d9ce510f1eb9fd"
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
