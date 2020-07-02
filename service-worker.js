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
    "revision": "4a5fe1c186453c6e0d1d982954a21202"
  },
  {
    "url": "about/contact.html",
    "revision": "b771abedc134ac76a4e33b207ea2f275"
  },
  {
    "url": "about/contributing.html",
    "revision": "97660113b5bbf5866203416e4f80abdc"
  },
  {
    "url": "about/index.html",
    "revision": "454f9e6243d2979aac751d2a7113f01a"
  },
  {
    "url": "about/license.html",
    "revision": "444befc3989738fc843fa339a4791a6c"
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
    "url": "assets/js/17.f92fd4ea.js",
    "revision": "c24fbd33955d1d5742c99d4ff1757e7e"
  },
  {
    "url": "assets/js/18.72e5e816.js",
    "revision": "da4c905c85778fee0a95f88fdb0b3d22"
  },
  {
    "url": "assets/js/19.1854f958.js",
    "revision": "5330b2383ad7dee793ec454b3dc66b1e"
  },
  {
    "url": "assets/js/2.77b98ac2.js",
    "revision": "8bf3548d2346e814d4d534ac90e284aa"
  },
  {
    "url": "assets/js/20.91a81486.js",
    "revision": "a0279b384f84ab665de09b082a64175a"
  },
  {
    "url": "assets/js/21.ef8ad567.js",
    "revision": "412ff6f83b8ea975f56c38d4a7ef9a13"
  },
  {
    "url": "assets/js/22.e2901018.js",
    "revision": "91012a7da8f84bf3261273dbed604535"
  },
  {
    "url": "assets/js/23.fcc7b3f6.js",
    "revision": "b4ab9f1e4925bea2170e4b3a58fedfea"
  },
  {
    "url": "assets/js/24.f7752852.js",
    "revision": "7dd2e64f5a84b6adc1285a998d736a8d"
  },
  {
    "url": "assets/js/25.7fafd3b0.js",
    "revision": "ff5bf709b72eebd1e2612cc0c1684178"
  },
  {
    "url": "assets/js/26.8bd04f18.js",
    "revision": "59473c977772bf008cc160e0120c8a80"
  },
  {
    "url": "assets/js/3.0599b7d7.js",
    "revision": "8f4270297a1f5425fe5766f99d734811"
  },
  {
    "url": "assets/js/4.e8e29f48.js",
    "revision": "f076d32933ac2ec87e1e7893493b6abd"
  },
  {
    "url": "assets/js/5.5a0a6c49.js",
    "revision": "556799e3ef0076126124762e3f4ae97d"
  },
  {
    "url": "assets/js/6.fc1fd58b.js",
    "revision": "8c61b2fda4b7784a507730eff014b678"
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
    "url": "assets/js/app.08304ba6.js",
    "revision": "2aece9767be4566bdaae3af9834c26ee"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "3f593db04307a57ae2527b20fa1d5946"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "dcb14a54f034c25d3f8427af19f6d9f6"
  },
  {
    "url": "fr/about/index.html",
    "revision": "82d6c5bd843306bec27bc031662ab292"
  },
  {
    "url": "fr/about/license.html",
    "revision": "4a78d013b0d10fb6aa1f64d25b8c8a6d"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "caa8b69b5d53ced44f87ff18e1543645"
  },
  {
    "url": "fr/index.html",
    "revision": "c02f5fd4b10902b6e4e46ef3430b0914"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "5d8ed3f4de8a6460aa8748a895317054"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "3dd7e964c4446f88c27ee116f5391999"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "c6e75b26bf0de06db3e0da878cf0e107"
  },
  {
    "url": "gofurther/index.html",
    "revision": "75496ffd5c0da1b0e09eba18323ef3c5"
  },
  {
    "url": "index.html",
    "revision": "0c2e998bf85c027982e66e3627ba32b8"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "38ae903032325fe9f06905365e8b92ee"
  },
  {
    "url": "quickstart/features.html",
    "revision": "cbce274ba66f9166a05120492bd8fb92"
  },
  {
    "url": "quickstart/index.html",
    "revision": "933451034121b3fb4e8d290d2ba944a9"
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
