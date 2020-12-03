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
    "revision": "21b4fd6d9743257e56245d7d8678c3a3"
  },
  {
    "url": "about/contact.html",
    "revision": "c5a0065b68beff6cf0adfcfded477a87"
  },
  {
    "url": "about/contributing.html",
    "revision": "3474ee0e5989a263221482b06ebf1bda"
  },
  {
    "url": "about/index.html",
    "revision": "4f9e40fe48e555034cc813cc2b08c029"
  },
  {
    "url": "about/license.html",
    "revision": "4bd4a9e469de0f577324ae6d706844c1"
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
    "url": "assets/css/0.styles.53aacec5.css",
    "revision": "71898d0f04a7418f26a8c3c8d5e2b179"
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
    "url": "assets/img/Alert-EN.6b934b78.png",
    "revision": "6b934b783b2235eb40b1888c88a6aaa8"
  },
  {
    "url": "assets/img/Alert-FR.aab2e659.png",
    "revision": "aab2e65912408b7ad61676f0ab6458f6"
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
    "url": "assets/img/Event-Archiving-EN.85f9f90d.png",
    "revision": "85f9f90d5d216b891e51691f98d06a82"
  },
  {
    "url": "assets/img/Event-Archiving-FR.ba42d676.png",
    "revision": "ba42d676546547a76b95dd0586ef8949"
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
    "url": "assets/img/Events-Chart-EN.aacd4fa0.png",
    "revision": "aacd4fa0b0294a56dcd5b0634d9ceade"
  },
  {
    "url": "assets/img/Events-Chart-FR.5c81e6a6.png",
    "revision": "5c81e6a6f7f0cedc213a0a79e9e744cc"
  },
  {
    "url": "assets/img/Events-HeatMap-EN.9251b4a7.png",
    "revision": "9251b4a7824e95c2e4793e7ae2b8b721"
  },
  {
    "url": "assets/img/Events-HeatMap-FR.f50fec48.png",
    "revision": "f50fec4868c33a81fc38d55438ec36a4"
  },
  {
    "url": "assets/img/Events-Map.3898da6b.png",
    "revision": "3898da6b386389e89f963c90a6065c3f"
  },
  {
    "url": "assets/img/gfs.ffb926a4.jpg",
    "revision": "ffb926a428b9eb480321043a85b53b90"
  },
  {
    "url": "assets/img/gsmap.13795c39.png",
    "revision": "13795c3944450435d043e700c8a2cf40"
  },
  {
    "url": "assets/img/hydrometrie-hubeau.c58257a8.jpg",
    "revision": "c58257a89559371d967290e9b2093a7a"
  },
  {
    "url": "assets/img/ign_orthohr.1bee8004.jpg",
    "revision": "1bee8004894c6e3480f58759fe464b43"
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
    "url": "assets/img/mapillary.142775ec.jpg",
    "revision": "142775ec435348e6da778ccfae38dfd4"
  },
  {
    "url": "assets/img/openaq.30e27655.png",
    "revision": "30e2765529670f52c3aa535c9e6999f9"
  },
  {
    "url": "assets/img/openstreetmap.787b1c2f.png",
    "revision": "787b1c2f2859022794591af3cbd22b89"
  },
  {
    "url": "assets/img/planetsat.5f348342.jpg",
    "revision": "5f3483426522cc8076496f13ca724a3d"
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
    "url": "assets/img/teleray.55cb7aee.jpg",
    "revision": "55cb7aee0db52e2a80869acf8db393c9"
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
    "url": "assets/img/vigicrues.ad945a8b.jpg",
    "revision": "ad945a8bad74bd87adf11b6146982383"
  },
  {
    "url": "assets/js/10.3089b543.js",
    "revision": "9c8d3a7265ea61f3eb17339c60e40114"
  },
  {
    "url": "assets/js/11.e7632069.js",
    "revision": "df95c030fe83ee4bfd216b716a1d5543"
  },
  {
    "url": "assets/js/12.a90869f5.js",
    "revision": "f20d9ed9210dabdd578b4a85796b1232"
  },
  {
    "url": "assets/js/13.fbaa3497.js",
    "revision": "c765d50068fb78b894b375b4e6575e65"
  },
  {
    "url": "assets/js/14.42e3ac33.js",
    "revision": "53ddcd64c071247c29bd7bac2b9aac85"
  },
  {
    "url": "assets/js/15.305d2951.js",
    "revision": "48ab45dd39532d364bfcf5edb20f4991"
  },
  {
    "url": "assets/js/16.8a1da318.js",
    "revision": "194b8ec90aad0239846f4111b3fa8fa9"
  },
  {
    "url": "assets/js/17.0b8c9c9f.js",
    "revision": "375710d9d86c12906f27241372932f46"
  },
  {
    "url": "assets/js/18.ee157953.js",
    "revision": "28e081ff84b981d2905c4e3ca8bb008f"
  },
  {
    "url": "assets/js/19.d8984654.js",
    "revision": "49acc86dfe29c2b49afe8cb396510b8d"
  },
  {
    "url": "assets/js/2.f2714a36.js",
    "revision": "3dc4cb67b3239f58305e2e483422f4d6"
  },
  {
    "url": "assets/js/20.2b90cc0c.js",
    "revision": "0198f6010dbb1c0b7393709c4fd3ffd2"
  },
  {
    "url": "assets/js/21.65415ac4.js",
    "revision": "1d82eb880c590013caa7a92e682d93a6"
  },
  {
    "url": "assets/js/22.45901afa.js",
    "revision": "570caab2acad963f61ca128b5d425d58"
  },
  {
    "url": "assets/js/23.ddf669a6.js",
    "revision": "8c4865770a1e2b3124ab9f59f3bb4de1"
  },
  {
    "url": "assets/js/24.8586f85f.js",
    "revision": "9b2af689c8ea34a41952d5fc9280186f"
  },
  {
    "url": "assets/js/25.675396f7.js",
    "revision": "e5bdb28232619d2201af5c7d11c474a8"
  },
  {
    "url": "assets/js/26.d69e86ec.js",
    "revision": "fd1228d9e2abb0b6d68fb53313924648"
  },
  {
    "url": "assets/js/27.9865b141.js",
    "revision": "6320b1a120de0ef8ac0c8052f587e111"
  },
  {
    "url": "assets/js/28.161a41f8.js",
    "revision": "3da0c645b6d444a01dd139d83ac79e41"
  },
  {
    "url": "assets/js/29.451ea6e1.js",
    "revision": "d36668e5e6976b632fb7903418fd59c9"
  },
  {
    "url": "assets/js/3.2814a2e4.js",
    "revision": "8319a2a7cf8bb07ae94d0ad392d98d20"
  },
  {
    "url": "assets/js/30.e28df9b0.js",
    "revision": "ff83f804c8c4126b469c9f0b02ebc354"
  },
  {
    "url": "assets/js/31.0830d39f.js",
    "revision": "2bc579ce5710d8a699d4d56aee6589e6"
  },
  {
    "url": "assets/js/32.8d21972f.js",
    "revision": "eb184acf801c29d15a0eeb33400f398a"
  },
  {
    "url": "assets/js/33.ea2a4aab.js",
    "revision": "ee1c80b6e9a24d7dcd6a6ac5c051d4c1"
  },
  {
    "url": "assets/js/34.c19c3c08.js",
    "revision": "c71a8cce9ce806fc21d617d0a7e08ee0"
  },
  {
    "url": "assets/js/35.8a3a9029.js",
    "revision": "796623b303f5a6f7ecd37d9694a1bf7a"
  },
  {
    "url": "assets/js/36.61cc9761.js",
    "revision": "0dcfa457edeeec4bbd0c6ca6d789c6a3"
  },
  {
    "url": "assets/js/37.51f9046f.js",
    "revision": "b53c0be1ee103c97592a46a344443e6d"
  },
  {
    "url": "assets/js/38.b4d80619.js",
    "revision": "71d1e6a7ce5bb549ab368f27b9cc1703"
  },
  {
    "url": "assets/js/39.49845125.js",
    "revision": "1424ed04e89bf2ae9e9d523a93b3f1a8"
  },
  {
    "url": "assets/js/4.eadda0e2.js",
    "revision": "6d852a83910a1710ef7fcd6ca6e4ae44"
  },
  {
    "url": "assets/js/40.dbb4b5e9.js",
    "revision": "438a3088132df8c91943380e9e30a0e7"
  },
  {
    "url": "assets/js/41.c93f193e.js",
    "revision": "20cdb3a0bb5bd62f3f5c842ca32fc7e1"
  },
  {
    "url": "assets/js/42.270d907d.js",
    "revision": "36cab39cbabb6188414d49b194081065"
  },
  {
    "url": "assets/js/43.7ec7e5c5.js",
    "revision": "0141ee53c0b6a0712a691bbb4cbbe713"
  },
  {
    "url": "assets/js/5.0d301a00.js",
    "revision": "1479890332a2e30600b974ac6f407985"
  },
  {
    "url": "assets/js/6.360ff991.js",
    "revision": "ac72fac503fc882b4c6a1789cf2eb984"
  },
  {
    "url": "assets/js/7.7abe30f3.js",
    "revision": "edf4eea60c001568f2f0922e9653056c"
  },
  {
    "url": "assets/js/8.7455db02.js",
    "revision": "00aeac05a2f7ece60cd81a4837aa7dde"
  },
  {
    "url": "assets/js/9.8262992d.js",
    "revision": "26aad20c34f5a5b78ef29280281d15e5"
  },
  {
    "url": "assets/js/app.b089981e.js",
    "revision": "50a159f1099e7a4369aadf3b28918ba5"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "0e415c977be641c1892dd162416c8860"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "1856d2cdceaf704c56b853f95b3bd173"
  },
  {
    "url": "fr/about/index.html",
    "revision": "9d1c64d9f555b9cf397d461676346744"
  },
  {
    "url": "fr/about/license.html",
    "revision": "f864876d35fff06b7efe71adbd36b4bd"
  },
  {
    "url": "fr/gofurther/alert.html",
    "revision": "63a82265e9ff3a96f22b2dd091698865"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "337af40b0a6c88ea29f068616292542f"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "4e2c4590ed6127c555e66694d4bc1680"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "270075ac9aafa052026595b6a8392266"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "7f886a5f1da3fc5522e81c3ec482d739"
  },
  {
    "url": "fr/index.html",
    "revision": "18e20b388cb90d5a4bd8b029a1ef672e"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "a085962aedf11edfb3f08d0af5c3fdad"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "2293af04e74e6c7c2a3d58b7fdb602e0"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "e0d192325684847ac7a11c961cb35de9"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "12bac1d55bf877c985281812e3d9b3f3"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "fa4eea31fbe45a89f7773a279677c9fa"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "2726d1639d4e2edc3ae605bc8a909460"
  },
  {
    "url": "gofurther/alert.html",
    "revision": "2ae038ef40503593cf8b57c59bf3154c"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "b62d9cc4d1cdccc1e5722c9524b7a9f4"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "30a2233ddb1b865ca618b53641fc4f88"
  },
  {
    "url": "gofurther/index.html",
    "revision": "2830145215c30a4c50108ae90b2ac89a"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "9cfa8e8cf6631e657a95de5f960a17e1"
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
    "revision": "00e2a00d327e5f4631d738237b525d57"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "5921bcaa44e3388171e5f8ea3abdc56b"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "a4e51fce40e454fc79ecdc55639da819"
  },
  {
    "url": "quickstart/features.html",
    "revision": "60ab16d6ad39ca321ec6a10b0712fd1f"
  },
  {
    "url": "quickstart/index.html",
    "revision": "896073f711097910a191e7decaa00996"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "7c9b04456fd4ceda032c2bcb647f1735"
  },
  {
    "url": "quickstart/update.html",
    "revision": "e10a674d09f3517647a980a531dff79b"
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
