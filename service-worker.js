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
    "revision": "170ec2de3e5586ed580e6a46623410c0"
  },
  {
    "url": "about/contact.html",
    "revision": "4fd9afbebf0463a039dfcb13423ade6b"
  },
  {
    "url": "about/contributing.html",
    "revision": "c0d493b2b772cf404e87297ab63812a1"
  },
  {
    "url": "about/index.html",
    "revision": "3ef5fc8c9fe46f31ad9f8d2d7d75e376"
  },
  {
    "url": "about/license.html",
    "revision": "89cb4f1e021170c0d8c830b44b33a307"
  },
  {
    "url": "App-Store-EN.png",
    "revision": "93b8fc354362e06b72bc139f9562f3d3"
  },
  {
    "url": "App-Store-FR.jpg",
    "revision": "1de408fdffc08ffb10f9f06087a4f99e"
  },
  {
    "url": "assets/css/0.styles.8fbc5c2e.css",
    "revision": "9cef067ad102226d313204524b3c07c8"
  },
  {
    "url": "assets/img/Account-EN.f53e78aa.png",
    "revision": "f53e78aab760de162e33451c93573695"
  },
  {
    "url": "assets/img/Account-FR.9b2a0ecf.png",
    "revision": "9b2a0ecfcd3eed067c584da77a9fdd4e"
  },
  {
    "url": "assets/img/Android-Update-EN.63bc440c.png",
    "revision": "63bc440cd26abc0257d61361e0ffab68"
  },
  {
    "url": "assets/img/Android-Update-FR.72adfab5.png",
    "revision": "72adfab5cff060d81d2a9614970c1c10"
  },
  {
    "url": "assets/img/Event-Map-EN.35114c95.png",
    "revision": "35114c9553fec81d58e74effac0ee52d"
  },
  {
    "url": "assets/img/Event-Map-FR.dbb46864.png",
    "revision": "dbb46864a11c6e48cc31de6f89f716d2"
  },
  {
    "url": "assets/img/Event-Workflow-1-EN.a190e1f6.png",
    "revision": "a190e1f6118c460a7551874e9b88a3b4"
  },
  {
    "url": "assets/img/Event-Workflow-1-FR.95c07da8.png",
    "revision": "95c07da88dbd95542cf1c0c72a4bca4a"
  },
  {
    "url": "assets/img/Event-Workflow-2-EN.b31bfada.png",
    "revision": "b31bfadaea1367555793092b3c048d17"
  },
  {
    "url": "assets/img/Event-Workflow-2-FR.743e85f3.png",
    "revision": "743e85f30254e32ee93d3c138d8d8ff5"
  },
  {
    "url": "assets/img/Interaction-EN.fd9290da.png",
    "revision": "fd9290da3ebf5e295b3931ecf6398639"
  },
  {
    "url": "assets/img/Interaction-FR.77b2aae6.png",
    "revision": "77b2aae60160b1bee3991b1ec6895afe"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/img/structure-EN.02adbeb3.png",
    "revision": "02adbeb3dd25e5bd4093fab3935fa351"
  },
  {
    "url": "assets/img/structure-FR.be5bb2b6.png",
    "revision": "be5bb2b6f0f711403751c36971f8c8a0"
  },
  {
    "url": "assets/img/Tour-EN.1c09b422.png",
    "revision": "1c09b422c4edfdb10c0964760f961f87"
  },
  {
    "url": "assets/img/Tour-FR.04071a69.png",
    "revision": "04071a69e42d740510ee470b4fa0d75c"
  },
  {
    "url": "assets/img/user-organisations.df6c1591.png",
    "revision": "df6c15912d1c3f515e47ea7dc8e9b8be"
  },
  {
    "url": "assets/js/10.7ffe1199.js",
    "revision": "c34e5a5d77fa8a48421b6e959d9c8061"
  },
  {
    "url": "assets/js/11.200f4eab.js",
    "revision": "38d3f7e5e376657120fad4e0b853abd0"
  },
  {
    "url": "assets/js/12.39f500e2.js",
    "revision": "899cbc2455f31faccbdd56954917e45a"
  },
  {
    "url": "assets/js/13.e0224860.js",
    "revision": "ac841e7b1d28f4f3eb7c9363ee971ffd"
  },
  {
    "url": "assets/js/14.fa69ab75.js",
    "revision": "42cba09c92d5a06cff2b2d52fa0287e0"
  },
  {
    "url": "assets/js/15.88a514a2.js",
    "revision": "e38a2a4f12583bd823bc51d5a20c21d1"
  },
  {
    "url": "assets/js/16.2cc53818.js",
    "revision": "a8b7440fda7744ef97a750d51126504d"
  },
  {
    "url": "assets/js/17.f94b6c1e.js",
    "revision": "454484b81d9851fed3e2aa08b03b982e"
  },
  {
    "url": "assets/js/18.63fe5e9e.js",
    "revision": "0f0a8ce35161bee93796206c84e88c6c"
  },
  {
    "url": "assets/js/19.383576e1.js",
    "revision": "3e306b419aba0e3f9c3d4c372544d0ad"
  },
  {
    "url": "assets/js/2.b83765c1.js",
    "revision": "7bd59ccf2d6afb222ed6b7cb5afd751e"
  },
  {
    "url": "assets/js/20.d9ce1aad.js",
    "revision": "b466066523194b5fedb98fee52cc393a"
  },
  {
    "url": "assets/js/21.25471fa5.js",
    "revision": "a48dea1bd8524ab1b1bdf4aa67640bcf"
  },
  {
    "url": "assets/js/22.1818b2d5.js",
    "revision": "b8cd3a1e240c6231bc8ac0459c5c9722"
  },
  {
    "url": "assets/js/23.77cf51e8.js",
    "revision": "952b23d2caad1f8eec79439bf6baaed1"
  },
  {
    "url": "assets/js/24.35d0846a.js",
    "revision": "980275a0eeef6bfe50937d6bd44318ad"
  },
  {
    "url": "assets/js/25.3a2567f1.js",
    "revision": "a3af000fd63632619338a589bf411ce8"
  },
  {
    "url": "assets/js/26.56a0b9af.js",
    "revision": "b2dc0b9d02c941a1530ba96b3ac8eb85"
  },
  {
    "url": "assets/js/27.1651ab54.js",
    "revision": "a475a9d98fe7138631520ebbeba85f1d"
  },
  {
    "url": "assets/js/28.3e5a4afd.js",
    "revision": "cd6a04fcad64307cc3ee63d066e928c5"
  },
  {
    "url": "assets/js/29.536f1fdc.js",
    "revision": "b18f568d94ae7ddb18d284506e6fed77"
  },
  {
    "url": "assets/js/3.c94dd46f.js",
    "revision": "325534aef2799345a4c38ecf6b21fa57"
  },
  {
    "url": "assets/js/30.63308242.js",
    "revision": "24591ecff87f5b87ec63fd9a8ac20a31"
  },
  {
    "url": "assets/js/31.9f308ccf.js",
    "revision": "4d3f215a2d3c9435fc3e706ae3cfb81f"
  },
  {
    "url": "assets/js/32.726ea811.js",
    "revision": "ffc2953710cda4a209f0bc06aa1d49f9"
  },
  {
    "url": "assets/js/33.b4b1e193.js",
    "revision": "14877a7a9060004dd2a043f08f0ec777"
  },
  {
    "url": "assets/js/34.c8ca8d79.js",
    "revision": "bf36f65300d1a16754e75a99b8b18c09"
  },
  {
    "url": "assets/js/35.013ab2bd.js",
    "revision": "f77b488020549027fbff83377ce15d58"
  },
  {
    "url": "assets/js/36.b586b548.js",
    "revision": "6dbc2f944a555680e3878f066b7cd679"
  },
  {
    "url": "assets/js/37.62407e4a.js",
    "revision": "db2947b8087aee7f6f5495b7608db317"
  },
  {
    "url": "assets/js/38.8e3841b7.js",
    "revision": "5ac04d139a762d8e7563591e04d0269c"
  },
  {
    "url": "assets/js/39.71450c17.js",
    "revision": "f69f3d1ac97fab8c4eb47190d491a954"
  },
  {
    "url": "assets/js/4.6f9744e4.js",
    "revision": "e6f80a5498b22d34f213c99266a10c96"
  },
  {
    "url": "assets/js/40.d7382aa9.js",
    "revision": "17c6d8d1686687d24d6c1754d437b8ea"
  },
  {
    "url": "assets/js/5.aa35230f.js",
    "revision": "bc9876f62fcf087355762e6807d480f5"
  },
  {
    "url": "assets/js/6.1fd4ff45.js",
    "revision": "30160cf8e77d089aa14a149695ac3c02"
  },
  {
    "url": "assets/js/7.765e18d1.js",
    "revision": "7bd069e55ca406ab270508313f7639e2"
  },
  {
    "url": "assets/js/8.eee1a468.js",
    "revision": "92824374350b3bc098bfd029bc8ff2cb"
  },
  {
    "url": "assets/js/9.06b860dd.js",
    "revision": "f5084d0f8d151b567d11ecdfd95d580f"
  },
  {
    "url": "assets/js/app.5372eb69.js",
    "revision": "4fd34def6f5b4fd5bf2cbaec76d518a0"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "22d665e98784fde64708cef6da1aad1c"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "a1247033b7aa36612f8e4eb7744ef5ab"
  },
  {
    "url": "fr/about/index.html",
    "revision": "5c8382cf71f3dc0426202073739ca809"
  },
  {
    "url": "fr/about/license.html",
    "revision": "68994e46093f767b6c0605f1e29a6a53"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "a8f25298b367a2940d3a13d817ed9a09"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "42fb7187f5ef6c8763f1cd88047f660c"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "9f739d1473d40e15a157cb0d81b539de"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "9bf86c964fb675872586085be95ac130"
  },
  {
    "url": "fr/index.html",
    "revision": "d635f58fcc487fdbbc2360046649484f"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "8eca38fd0fe99789dc7ef89f9187793b"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "982893d8ec1cc6830763ac63a156ba3f"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "2ef44ab4b3733b87f099626d12bd4b00"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "d5be3b4cf8dcafb24db7a21b1cd24561"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "85b0a55b5952ea97b9ab85b90e64b749"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "a383f6d2793afeb62a13687651c002d0"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "a54460e3d84a3f38581a78800a6d3bea"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "346c7feec7d576df72fdaae56345987c"
  },
  {
    "url": "gofurther/index.html",
    "revision": "2ab0f518878ffe8b281a3c3ebb6e5be1"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "24c3ffae949571d433b50a0ef7b78d40"
  },
  {
    "url": "Google-Play-EN.png",
    "revision": "22686a6e0bf60534bc836b5e9e9353fb"
  },
  {
    "url": "Google-Play-FR.png",
    "revision": "e6fcc3304b2bbd83d18144ed4962d1cf"
  },
  {
    "url": "index.html",
    "revision": "b3fee3cf28263188459d3c2cea864270"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "72fdebf34914a25b673d6d497ef91ec3"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "5cf3a2dcb76736d98bcadc20521d42c9"
  },
  {
    "url": "quickstart/features.html",
    "revision": "9d819e5646689f6aeb81b0bf7b438ae4"
  },
  {
    "url": "quickstart/index.html",
    "revision": "a411f034a8c83aa288cf5bdeeeeb687f"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "ce374a10977d2eb57c0ffe6b5bb3176c"
  },
  {
    "url": "quickstart/update.html",
    "revision": "46321923cd5a05f7b584a9c26b9bffee"
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
