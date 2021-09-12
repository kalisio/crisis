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
    "revision": "36aafab48970ba2b4bfbd159b42bec5d"
  },
  {
    "url": "about/contact.html",
    "revision": "be3a6119a21733e37d8656712688d034"
  },
  {
    "url": "about/contributing.html",
    "revision": "db5416ca065aac7dd3300aa9905dd93d"
  },
  {
    "url": "about/index.html",
    "revision": "17e48ecdb55d95aff3101a83767a2553"
  },
  {
    "url": "about/license.html",
    "revision": "0ac69af5bdf1e8a155c57d88f5b1de17"
  },
  {
    "url": "api/components.html",
    "revision": "ef0b6117f853502625eeeda50f9fc808"
  },
  {
    "url": "api/hooks.html",
    "revision": "0e02f9ae9d549c31c52087649227bbb0"
  },
  {
    "url": "api/index.html",
    "revision": "e09b16bbf464d22c44950229735b5773"
  },
  {
    "url": "api/services.html",
    "revision": "20ff4d9545e27a111377e37e073ea054"
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
    "url": "assets/css/0.styles.24be2ef9.css",
    "revision": "2fe17cc6f3c84328b4db13649a9229da"
  },
  {
    "url": "assets/img/Account-EN.80cb554f.png",
    "revision": "80cb554f7528aee77052a596ac8adce8"
  },
  {
    "url": "assets/img/Account-FR.5ce5637e.png",
    "revision": "5ce5637eed28b8d37eb81f8a6a08fd5e"
  },
  {
    "url": "assets/img/Alert-EN.bfc28a55.png",
    "revision": "bfc28a5544cdcf66e296bc0e9549aae7"
  },
  {
    "url": "assets/img/Alert-FR.3d125b85.png",
    "revision": "3d125b8531bddab4b78c80f4fb0d59e6"
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
    "url": "assets/img/Event-Archiving-EN.17babc88.png",
    "revision": "17babc88f5ad9ff05b2d1803aac36be7"
  },
  {
    "url": "assets/img/Event-Archiving-FR.fedb160e.png",
    "revision": "fedb160e67347f31344ec51c465f0e1b"
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
    "url": "assets/img/Events-HeatMap-EN.5b15ab85.png",
    "revision": "5b15ab85eb5b6b748727f4d6272de340"
  },
  {
    "url": "assets/img/Events-HeatMap-FR.90f9822a.png",
    "revision": "90f9822aea3ea6560ffbad3545ac882c"
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
    "url": "assets/img/LaunchTour-EN.a1cfa0a4.png",
    "revision": "a1cfa0a40e06da84fa79a9471a5c2dbe"
  },
  {
    "url": "assets/img/LaunchTour-FR.7e9fbcea.png",
    "revision": "7e9fbcea1a6a7133e9f5a9439531764b"
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
    "url": "assets/img/openradiation.5972de92.png",
    "revision": "5972de92ff7adeb3b7e9066f8df49676"
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
    "url": "assets/img/Tour-EN.75a21b89.png",
    "revision": "75a21b89dd86c5e39c86acdede97512f"
  },
  {
    "url": "assets/img/Tour-FR.a75151cc.png",
    "revision": "a75151cc0cd2c6008093c2cac63ccd38"
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
    "url": "assets/js/10.d15924f6.js",
    "revision": "3fc1093729e0a2acf7e629c21a1825cf"
  },
  {
    "url": "assets/js/11.4b52e06f.js",
    "revision": "031bfefca88829b172c7bbaea2757730"
  },
  {
    "url": "assets/js/12.7777a59b.js",
    "revision": "0afb70f72d59fb334b2a3aa7f7a27570"
  },
  {
    "url": "assets/js/13.db0f7a18.js",
    "revision": "06bcc9d0cc1e67f5635d434711b6d452"
  },
  {
    "url": "assets/js/14.98d794a8.js",
    "revision": "20881edb767d1910dc0c4bbc147e31a6"
  },
  {
    "url": "assets/js/15.440eabe0.js",
    "revision": "62c12180c27a834a96dd179c4df61462"
  },
  {
    "url": "assets/js/16.4282c6a6.js",
    "revision": "3f101c898e813d25607bb13d4205cb26"
  },
  {
    "url": "assets/js/17.1f993e63.js",
    "revision": "e07b895a33e459de42ec505a4466388e"
  },
  {
    "url": "assets/js/18.7ebb3c89.js",
    "revision": "0ec3a625fab04619e1c85fd5095b538a"
  },
  {
    "url": "assets/js/19.79484920.js",
    "revision": "fb8190d260524dc6022e4ed0663fa9a5"
  },
  {
    "url": "assets/js/2.eb8e41eb.js",
    "revision": "6d35586aac27407fa5deeb433924f362"
  },
  {
    "url": "assets/js/20.b9b91013.js",
    "revision": "3d661a032b521dff84c3b2983adc0d8a"
  },
  {
    "url": "assets/js/21.3b875169.js",
    "revision": "a4de13012c2e6f94724a1fb1924ab5fe"
  },
  {
    "url": "assets/js/22.5b9646f7.js",
    "revision": "0055e7550ca05f2f6206e2eedeee787a"
  },
  {
    "url": "assets/js/23.c0717c17.js",
    "revision": "6e6ecfd72264d98d27c65eddc6d64504"
  },
  {
    "url": "assets/js/24.67fc9559.js",
    "revision": "11f1fd49a0294d57c88e6489f6477dbf"
  },
  {
    "url": "assets/js/25.4cd2ed6b.js",
    "revision": "1dec34c8c8938fa75c3bdcab65f0edbf"
  },
  {
    "url": "assets/js/26.e3d79309.js",
    "revision": "9c639126a848b736c72e90fe4ff760b2"
  },
  {
    "url": "assets/js/27.183af87d.js",
    "revision": "f2e82cd5f36ba12a0a343e4cf667648b"
  },
  {
    "url": "assets/js/28.e550787a.js",
    "revision": "bd9255b4bbe9439f7be23dea74915b05"
  },
  {
    "url": "assets/js/29.84a075fe.js",
    "revision": "f1ffb7e34b80c8bbb04b7e0eb1dd8cd1"
  },
  {
    "url": "assets/js/3.e3c58953.js",
    "revision": "8fe27c435b2b59645bdd47c860a82005"
  },
  {
    "url": "assets/js/30.f05619d7.js",
    "revision": "132e9de28ef6df2a0906a3034afee12b"
  },
  {
    "url": "assets/js/31.b8a3d90d.js",
    "revision": "40d4cbf27e9d3ce525504461cc4a44eb"
  },
  {
    "url": "assets/js/32.8791e753.js",
    "revision": "ed0a9b4845836735727e9d461f4cc409"
  },
  {
    "url": "assets/js/33.5bf3dd89.js",
    "revision": "e920c190b98f1017d87cf0fe16e86ed8"
  },
  {
    "url": "assets/js/34.f5e67b71.js",
    "revision": "4258bc017b585186c55563cbbd82e473"
  },
  {
    "url": "assets/js/35.cb9b2c2c.js",
    "revision": "2d85dd3cdf359ea622d0ad1cfd46a054"
  },
  {
    "url": "assets/js/36.c0c8ac1f.js",
    "revision": "3ce468bbb103209213e509e89a3a24b0"
  },
  {
    "url": "assets/js/37.86ed0037.js",
    "revision": "f459d1d0fd35709a178c7dc763d3a8c5"
  },
  {
    "url": "assets/js/38.c04ef7d5.js",
    "revision": "e269e0462bc82bab2327ed6867a580d0"
  },
  {
    "url": "assets/js/39.05b8ef37.js",
    "revision": "cf57f101528b08b5168bbb5c3ffc0ee4"
  },
  {
    "url": "assets/js/4.d179c208.js",
    "revision": "05a034faa01aea5fd3cd8a347e437d28"
  },
  {
    "url": "assets/js/40.0a5a0791.js",
    "revision": "042d91c4eb256735361d3dc873c91eb6"
  },
  {
    "url": "assets/js/41.dd353133.js",
    "revision": "f91f081b44cf6a35d0f8a89722b36b7d"
  },
  {
    "url": "assets/js/42.c57a180f.js",
    "revision": "86e6c447438696b703171fffd0ac7031"
  },
  {
    "url": "assets/js/43.ad12a273.js",
    "revision": "b51bcc6c2527d7221705d468eccee477"
  },
  {
    "url": "assets/js/44.9ffd05fa.js",
    "revision": "5d860256021ca3abdd55d4041a34be6e"
  },
  {
    "url": "assets/js/45.ccda8afe.js",
    "revision": "90517f79454ee5ae4a9d96b8b4da1ab1"
  },
  {
    "url": "assets/js/46.cceabed9.js",
    "revision": "d650575ac41031798174af5e5bccb658"
  },
  {
    "url": "assets/js/47.c60b076e.js",
    "revision": "8087796ca2001c2f48e00f2b4b0eef77"
  },
  {
    "url": "assets/js/48.6e6fab72.js",
    "revision": "fb7fd5b5c3ed24ca5d5d00b2115ff18f"
  },
  {
    "url": "assets/js/49.175af077.js",
    "revision": "d35a165ef94f9d777ff887ffccdf971a"
  },
  {
    "url": "assets/js/5.8876da56.js",
    "revision": "8b5aec64d65f1053dcaf4605809a850d"
  },
  {
    "url": "assets/js/50.00b18ae2.js",
    "revision": "07638661a4e7fff4b7b467109bf7760c"
  },
  {
    "url": "assets/js/51.9d3bf2ae.js",
    "revision": "8f9a7beaa05a40efa84fdbe887d561f3"
  },
  {
    "url": "assets/js/52.9fdc645b.js",
    "revision": "78369fd163e859b0b2325e66b73cbce1"
  },
  {
    "url": "assets/js/6.c5b0131a.js",
    "revision": "622a3cd98a9f8c8eb907c1711b3cbd11"
  },
  {
    "url": "assets/js/7.0f346368.js",
    "revision": "d866290e0be6ecc6386e8096ca70c386"
  },
  {
    "url": "assets/js/8.7c99ba6a.js",
    "revision": "10cbc7157014c3254b3c0a2d11c332d1"
  },
  {
    "url": "assets/js/9.d7223bb3.js",
    "revision": "24f805c54c0dca3dd128f83f28d64f03"
  },
  {
    "url": "assets/js/app.a5e551d3.js",
    "revision": "12463878e0086c4e4cf0eab40b82b6c0"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "64592bea6fef17b4d6a4d3f443fe43ea"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "9abd9c264857b160665337d50b0d8a3e"
  },
  {
    "url": "fr/about/index.html",
    "revision": "4e5487895b2c1db8175ff6df6dc879c6"
  },
  {
    "url": "fr/about/license.html",
    "revision": "d20a2e573b9fa3346db2905aeed9e067"
  },
  {
    "url": "fr/gofurther/alert.html",
    "revision": "65e77120626a19a6c7a799206522e5f0"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "b0ec25f8341528bda5d87e7fd7bb8fac"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "31a5e58741c67d76e693e7cef884449d"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "a5cae330e150342d5d2693e101d66f54"
  },
  {
    "url": "fr/gofurther/plan.html",
    "revision": "47f50e87762e295a8018156c362172a2"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "ffa6abf93f3951f0790d0b9676a0d816"
  },
  {
    "url": "fr/index.html",
    "revision": "3b9e182f3a51d335bec7a2fe9645f1a0"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "6ef1e3543726266b712dafa68b2d6649"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "6ca2212086c2f4f37e936c4da6998043"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "b7c6846caf130559d8c4d3ca14fbfdc3"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "60140359a0e03456ac67e682655e45b2"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "be6bd796e5cfe350b28a952691892520"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "0ed36c07ccf6c44a010d1efb7ea17dad"
  },
  {
    "url": "gofurther/alert.html",
    "revision": "7b16329a0f65b83ce57279f1e6930321"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "2c92c2ffcb604d0762a71cc1fdd4000b"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "db55c9006086eb6d1b40bf21592626f9"
  },
  {
    "url": "gofurther/index.html",
    "revision": "a5b6c813362b90dd3b4e39417271c3d9"
  },
  {
    "url": "gofurther/plan.html",
    "revision": "eb1dc3f6937546e26190cb7032f5c3c1"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "f1f10e44faa8c1397e7c81eb79b02b1b"
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
    "revision": "344413ed5864e0fd56f157b2342be58a"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "c2f6bf7fb53389e8718d7bbc6ef808f6"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "6472b3251c5b1c2288f2b08f916accf0"
  },
  {
    "url": "quickstart/features.html",
    "revision": "86c94fd565524ce23f6fc20aa0483e9d"
  },
  {
    "url": "quickstart/index.html",
    "revision": "b8265cb35533a445a548700f8cc7c517"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "da27afe4fb28732961d14a33d2c8d128"
  },
  {
    "url": "quickstart/update.html",
    "revision": "79aba39caf53a203e176ddf55d77aa95"
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
