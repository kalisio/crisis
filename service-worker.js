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
    "revision": "b796aaf66116edd5b6466381506b4ea2"
  },
  {
    "url": "about/contact.html",
    "revision": "75b256fb509420889cf8588c30ece8e7"
  },
  {
    "url": "about/contributing.html",
    "revision": "47260ed5fd1a67940403fcfa1b30c763"
  },
  {
    "url": "about/index.html",
    "revision": "c85a079f225ed6fd50122c10a53b6aa5"
  },
  {
    "url": "about/license.html",
    "revision": "6bdecd06d437f3d212a369a4b9d67ce1"
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
    "url": "assets/js/18.b14e348e.js",
    "revision": "49dc4ad264a1bd66218748641700afbd"
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
    "url": "assets/js/20.a53f885e.js",
    "revision": "83c35f75a588c7f8096d7e60ef2a0b0c"
  },
  {
    "url": "assets/js/21.e1a398b0.js",
    "revision": "ee4a1745cf1a140f3fbdc80e89abbb19"
  },
  {
    "url": "assets/js/22.d624b4fd.js",
    "revision": "7d241988618ef7a02d618e7adf9a8a91"
  },
  {
    "url": "assets/js/23.f4a97183.js",
    "revision": "ac508e7ca0ddd60b865c22cf9ac010f7"
  },
  {
    "url": "assets/js/24.090910d5.js",
    "revision": "e4139a8a20da03c05138306540e9fa52"
  },
  {
    "url": "assets/js/25.e59a947c.js",
    "revision": "d0ad7031d1a0bb61d048ff6d9eef6228"
  },
  {
    "url": "assets/js/26.2536f764.js",
    "revision": "590b0359dba067cfc2cf89a0f3bfd9c4"
  },
  {
    "url": "assets/js/27.f4cf6204.js",
    "revision": "d0dea027d909b1e910005b2a317db9c6"
  },
  {
    "url": "assets/js/28.4b1f7669.js",
    "revision": "ee8ae00db555d421e1a512cfda437782"
  },
  {
    "url": "assets/js/3.0599b7d7.js",
    "revision": "8f4270297a1f5425fe5766f99d734811"
  },
  {
    "url": "assets/js/4.191bbbde.js",
    "revision": "3fc0aeea736169c32b8b4caf367e5184"
  },
  {
    "url": "assets/js/5.5a0a6c49.js",
    "revision": "556799e3ef0076126124762e3f4ae97d"
  },
  {
    "url": "assets/js/6.11f7d42b.js",
    "revision": "e23581f1e23a818eb8d4707cd4171334"
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
    "url": "assets/js/app.d3a0625a.js",
    "revision": "d7b67908f1601220af31255896f23d7d"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "d52aa379629f15ca58d841c344ad14d6"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "cc6e9da20f269303a672695d5daac3d6"
  },
  {
    "url": "fr/about/index.html",
    "revision": "0a8962db9fb3944799ca85acadd061f2"
  },
  {
    "url": "fr/about/license.html",
    "revision": "2ae731c162080a80d47cef563c1c724a"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "d4e9be960fa8c92fd37da91268e42b7b"
  },
  {
    "url": "fr/index.html",
    "revision": "3f79ac6fa4f768223fed3687d3e84cae"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "83fb31ed574a911d0037f3546249748b"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "f1bd72ccf7e1d3fb2ecae02b521f6738"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "3dc032c029eed69f80bb96e55fd88374"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "e6b97fe3c786f29d5fff472c6bae48bd"
  },
  {
    "url": "gofurther/index.html",
    "revision": "cbc1eee3c313bcc29107d5390de925c9"
  },
  {
    "url": "index.html",
    "revision": "b8a4af44c2000d5c5dfd909da0207ac6"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "bdbd96b8997840805f54f074f1170412"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "aed43e0bff86aebb379db49acdd7e892"
  },
  {
    "url": "quickstart/features.html",
    "revision": "e1a1f2b73bfe00ee8e30c84ac894125a"
  },
  {
    "url": "quickstart/index.html",
    "revision": "7a00c69c9bb9b95e6fc8d0fe8248ad95"
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
