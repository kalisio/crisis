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
    "revision": "a690a34ab8760c27d4e35b10338f1b22"
  },
  {
    "url": "about/contact.html",
    "revision": "3d0d441817a94321c75b3ea043653a52"
  },
  {
    "url": "about/contributing.html",
    "revision": "ed32d24d789a2982d7945c8596da4f8f"
  },
  {
    "url": "about/index.html",
    "revision": "7d08d919465b667a61e55c8c9a20818b"
  },
  {
    "url": "about/license.html",
    "revision": "76fc56648af055f0b54393ca71a994db"
  },
  {
    "url": "api/components.html",
    "revision": "5edfb40f67bcc2849586c31b9dd44ddf"
  },
  {
    "url": "api/hooks.html",
    "revision": "054d46c9557ac8ad21d006f1a018003c"
  },
  {
    "url": "api/index.html",
    "revision": "8e9c8e67193844af99572f80057d01ef"
  },
  {
    "url": "api/services.html",
    "revision": "14b2048be92e173f771c09a8eaff0f13"
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
    "url": "assets/css/0.styles.8e7dbb95.css",
    "revision": "d9c594917ff9b320bbccf4a3e7e7763d"
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
    "url": "assets/js/10.bf1b9746.js",
    "revision": "85d42589b51409178d0df01eb05003c9"
  },
  {
    "url": "assets/js/11.709c7d59.js",
    "revision": "90b11a8a7a1d200fa662785b5604d7b3"
  },
  {
    "url": "assets/js/12.a241ec7a.js",
    "revision": "87536471b121253eba032e6b296ea5d9"
  },
  {
    "url": "assets/js/13.a501a0d8.js",
    "revision": "bc24d1ca9ab2da8a6944b7a2243ae5d5"
  },
  {
    "url": "assets/js/14.903ff3e4.js",
    "revision": "bef5755cdf720e609c1874001aa4311c"
  },
  {
    "url": "assets/js/15.0631c57b.js",
    "revision": "bc09925a7465fa86122980be2ec4620e"
  },
  {
    "url": "assets/js/16.30752570.js",
    "revision": "8f03f1aa4a5b914a0637cbb53d910f6e"
  },
  {
    "url": "assets/js/17.d4d5eaab.js",
    "revision": "48873b60b62755296ef58fd87304607b"
  },
  {
    "url": "assets/js/18.9cc69023.js",
    "revision": "2b32ae4ca0bc74b41dafa71c4b5770ac"
  },
  {
    "url": "assets/js/19.d315324e.js",
    "revision": "8adfea87f20c4a59348855b61789d78e"
  },
  {
    "url": "assets/js/2.d914f2c7.js",
    "revision": "066b40254566dcc5b93529596cea6208"
  },
  {
    "url": "assets/js/20.00da1fea.js",
    "revision": "056bca202dc8f5222f67f476f099b8ad"
  },
  {
    "url": "assets/js/21.58d45c88.js",
    "revision": "b9da0a9a5ac77a88c1c6b96a2d6761b1"
  },
  {
    "url": "assets/js/22.2ab9a33d.js",
    "revision": "78e0221dd2a2cb26c5ff896b3006c05e"
  },
  {
    "url": "assets/js/23.3de0b676.js",
    "revision": "7e076c79dbc626578e822d117f6bf794"
  },
  {
    "url": "assets/js/24.66710c91.js",
    "revision": "968119f9d2a211d5130acd221d5ac1ef"
  },
  {
    "url": "assets/js/25.431355b1.js",
    "revision": "2e134a530fff71d15856b71b79a35934"
  },
  {
    "url": "assets/js/26.3c83b24a.js",
    "revision": "903c7d7472fad487427a8d7fa895f755"
  },
  {
    "url": "assets/js/27.4e813d87.js",
    "revision": "0fc6381b06e19dc068aef758d2628348"
  },
  {
    "url": "assets/js/28.17f9ea43.js",
    "revision": "b3059145d988f7df4c44929f06c5c198"
  },
  {
    "url": "assets/js/29.535129d2.js",
    "revision": "91c6cb240db665412721ecd805ac0e40"
  },
  {
    "url": "assets/js/3.abe7a753.js",
    "revision": "a5421153e9988d2e9309ec1b04a5a957"
  },
  {
    "url": "assets/js/30.da3bb7a9.js",
    "revision": "34ce81ea1e659fea7a187b6ef3c0626b"
  },
  {
    "url": "assets/js/31.a9924e5c.js",
    "revision": "dd7f670856438455596ccf5af3828352"
  },
  {
    "url": "assets/js/32.bc9f9879.js",
    "revision": "faeffe2f168561575e7c3aa31c3203f7"
  },
  {
    "url": "assets/js/33.b06a7df8.js",
    "revision": "56b0e7cb7c05ac7cbdb7d0fcacb3a561"
  },
  {
    "url": "assets/js/34.8a0c9288.js",
    "revision": "7831f1a494499936e78ae209e621fb82"
  },
  {
    "url": "assets/js/35.ceb178f4.js",
    "revision": "fa510538cfd04e7ee3f14bc55166f7b3"
  },
  {
    "url": "assets/js/36.0e705987.js",
    "revision": "0c93bb599b658463a70636b45897f677"
  },
  {
    "url": "assets/js/37.c89ce2ea.js",
    "revision": "dbc36ce5884142c9f962fd5986c16279"
  },
  {
    "url": "assets/js/38.c04ed385.js",
    "revision": "5c7dfb7d8f5de606eb258c39b103c19b"
  },
  {
    "url": "assets/js/39.ddcc1a58.js",
    "revision": "700ddaeb7686e6951503bfbd442757fb"
  },
  {
    "url": "assets/js/4.96441069.js",
    "revision": "016f6ed152e341e8cbd44a160d5d81b3"
  },
  {
    "url": "assets/js/40.ef0515d3.js",
    "revision": "2e933d0a6a08f6126c74ea67db93f8ba"
  },
  {
    "url": "assets/js/41.913438fd.js",
    "revision": "8d0dadb3b5ec1f5d2ca9c5bd722af2d3"
  },
  {
    "url": "assets/js/42.67570d3f.js",
    "revision": "1903ef4915bdb8c5e650f2b574aa01ce"
  },
  {
    "url": "assets/js/43.274233cc.js",
    "revision": "f819a9ce94bdc09ef216665e5477a343"
  },
  {
    "url": "assets/js/44.b69568cd.js",
    "revision": "e550025bbc171044ba0a9ae4c44f91ed"
  },
  {
    "url": "assets/js/45.50a757c5.js",
    "revision": "7aeca699f6ea60d40943e4ad1b50d80a"
  },
  {
    "url": "assets/js/46.cd72186b.js",
    "revision": "36084044ae05eb65f1f85aa44e59580b"
  },
  {
    "url": "assets/js/47.8181f6b9.js",
    "revision": "bf0b4c3f4f9395d6bf3d123266734c22"
  },
  {
    "url": "assets/js/48.b6319f3b.js",
    "revision": "9541deb9ab45e72228d5f9074c90d2db"
  },
  {
    "url": "assets/js/49.ebfff95c.js",
    "revision": "c338d2cb12afddcc69ebee20b223f002"
  },
  {
    "url": "assets/js/5.6eeb4186.js",
    "revision": "9dfcf433da89bcfa15fd672fa21316cc"
  },
  {
    "url": "assets/js/50.989efe5d.js",
    "revision": "772937d420365c1f882860d54358c97c"
  },
  {
    "url": "assets/js/6.e6b93e48.js",
    "revision": "6006924be81541fa4cbd24c20f4d0551"
  },
  {
    "url": "assets/js/7.837563eb.js",
    "revision": "7d21a3517d2bde528aea281fa4d0f8d6"
  },
  {
    "url": "assets/js/8.4f918246.js",
    "revision": "be928adaccab8552a77181240cce7ae9"
  },
  {
    "url": "assets/js/9.fafa8dd6.js",
    "revision": "83f925499a1d15a0650262c571a9e69c"
  },
  {
    "url": "assets/js/app.356efd3e.js",
    "revision": "fca4517d89d41d199bb0387f03063469"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "925c7f09ac7f7716ffe9804a8c58406f"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "6d5c6bb127bbc2cb90e2dccd75656b2f"
  },
  {
    "url": "fr/about/index.html",
    "revision": "54e3c405a607208724f81138a0a00bd5"
  },
  {
    "url": "fr/about/license.html",
    "revision": "c7ce5c19780c2d2bc497ebe328978818"
  },
  {
    "url": "fr/gofurther/alert.html",
    "revision": "323da1bd836c4dcc8c4dac3f39941830"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "c3cd117a5367dd189da23e073b3adfee"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "3f79edce8620e95eb114a042c15f85a8"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "42101ec5161ee93f82e9876ffbb22141"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "aab2406ca84e8667eef678a27bec4c3f"
  },
  {
    "url": "fr/index.html",
    "revision": "2f3eece80637d5bc767f0a10a864764b"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "361e71e7a6ab0775974fa5c344b1be3c"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "fe3d320f0536e72b895a30409704304a"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "cc11ce4d79d1f6f293532cd7819f0256"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "a3a7d115b89e0bb8c776448901e2d656"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "8adf00f70c56e78592ce2ef9089a9291"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "91d3cffa70e9c0db4eba5b781c6d9b7c"
  },
  {
    "url": "gofurther/alert.html",
    "revision": "0ebefb7511ae2517261720b16b0a3547"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "5e5be48d91cd148ff2cd02a91aefe209"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "e3a99e5b4cfea7db40d83c2238e1a158"
  },
  {
    "url": "gofurther/index.html",
    "revision": "16d8b1770d48e61760fe208b9f1fd97b"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "ee8a67734735eede8981ef7916ca408e"
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
    "revision": "25b085798cdcc5d8b1ade605761b0f39"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "7ead1f8d8b7c6d0a9b82b76a295246ea"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "d9c1f988af9329b66bc9acbc41dfe898"
  },
  {
    "url": "quickstart/features.html",
    "revision": "d4ee435c8bc24b48c5f7d2e1c1954765"
  },
  {
    "url": "quickstart/index.html",
    "revision": "b993347ae5c4808f9e1eb8c132da6937"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "f0dbe45b4e1f18676facdd27f764049d"
  },
  {
    "url": "quickstart/update.html",
    "revision": "1e845ae4e565ef91e764535bbfd178ef"
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
