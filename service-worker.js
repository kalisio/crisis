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
    "revision": "b3f5eb803a4e13198dc2d53c7510567b"
  },
  {
    "url": "about/contact.html",
    "revision": "33b3955276ebaab977d2c7d6b984c792"
  },
  {
    "url": "about/contributing.html",
    "revision": "1ad858271c46cd53b600d0d1206edeb7"
  },
  {
    "url": "about/index.html",
    "revision": "b5673c34d96567f6fb426fbc57b39312"
  },
  {
    "url": "about/license.html",
    "revision": "c6b442cb9b9860bf0cef937f745afa70"
  },
  {
    "url": "api/components.html",
    "revision": "52a1fe637c33a186e9858d1e5ff82968"
  },
  {
    "url": "api/hooks.html",
    "revision": "14826a9c250a1d142db201594830ec00"
  },
  {
    "url": "api/index.html",
    "revision": "04babaabd98b16cc9059520838aac528"
  },
  {
    "url": "api/services.html",
    "revision": "36eb3878911bc6e1bb256cdcd5ba6f6e"
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
    "url": "assets/js/10.20b37d90.js",
    "revision": "65e9f62930829b5344f0ab620f50e011"
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
    "url": "assets/js/14.1306acd5.js",
    "revision": "5cb02af4412b78961bf66a484a95dc82"
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
    "url": "assets/js/19.8112cfe1.js",
    "revision": "d1c08ea436bea0934bfc95af9e5fdc01"
  },
  {
    "url": "assets/js/2.eb8e41eb.js",
    "revision": "6d35586aac27407fa5deeb433924f362"
  },
  {
    "url": "assets/js/20.ae20378b.js",
    "revision": "10903db376ec9bea56f4cff1b1f7c8f2"
  },
  {
    "url": "assets/js/21.3b875169.js",
    "revision": "a4de13012c2e6f94724a1fb1924ab5fe"
  },
  {
    "url": "assets/js/22.6c31c75e.js",
    "revision": "b6a00560007abeaee9e2bacb27682c40"
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
    "url": "assets/js/38.72dd7e04.js",
    "revision": "5901623cf72801b70e10d0fa737e0176"
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
    "url": "assets/js/43.cfeb9985.js",
    "revision": "4085cb66560ee2a8b7bc45e36081c58a"
  },
  {
    "url": "assets/js/44.bcaaa74f.js",
    "revision": "aed8241aa015780473280c966ece816c"
  },
  {
    "url": "assets/js/45.ed51c1c0.js",
    "revision": "9643ed22beaff66b15c87256cd81d0d6"
  },
  {
    "url": "assets/js/46.9164f2e3.js",
    "revision": "5d5cdf117bab026e95b5fc2deded037f"
  },
  {
    "url": "assets/js/47.cff017e6.js",
    "revision": "82e1c44f67ce0f220cd8983824611469"
  },
  {
    "url": "assets/js/48.37c903b9.js",
    "revision": "0ea01065c5d3f7a273c1f2c7b27dfe01"
  },
  {
    "url": "assets/js/49.e2d6c085.js",
    "revision": "50020eb8bffaca2f92a29ef5f110b669"
  },
  {
    "url": "assets/js/5.863481b5.js",
    "revision": "9d433795862a284f111137c80d1d88a3"
  },
  {
    "url": "assets/js/50.1356da25.js",
    "revision": "d369ff8f01ff8cbdbb61576ed492fe30"
  },
  {
    "url": "assets/js/51.c7f96254.js",
    "revision": "eb557b9544d22a135d9591558010f69d"
  },
  {
    "url": "assets/js/52.954e796a.js",
    "revision": "f4e5f1fd7f3e8351bee1c598cd183d2f"
  },
  {
    "url": "assets/js/53.8de0d005.js",
    "revision": "2fc1760e84c4450c5299eae30b7157bc"
  },
  {
    "url": "assets/js/54.074609a5.js",
    "revision": "c2bafa6659a3eed2bd60a22d5a6b8c57"
  },
  {
    "url": "assets/js/6.c5b0131a.js",
    "revision": "622a3cd98a9f8c8eb907c1711b3cbd11"
  },
  {
    "url": "assets/js/7.9fb4a7eb.js",
    "revision": "ff2f20c57ba4135e343cbfb2df3c312a"
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
    "url": "assets/js/app.847322a8.js",
    "revision": "b807c66b4b32819b9aa23fd1b3953a5f"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "300dd3e8b3dcb046336b82afcf522265"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "dcce4a0a7cb63f3708c903b5d08c6707"
  },
  {
    "url": "fr/about/index.html",
    "revision": "b6d250c93d2096f7edf07faba4ae770a"
  },
  {
    "url": "fr/about/license.html",
    "revision": "21f3d0c0d9aae1d8b7987f7aa476525d"
  },
  {
    "url": "fr/gofurther/alert.html",
    "revision": "170c2d6cf507702d0effe5a99f35840a"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "ef72af894b9450e3ff1377f754d40a57"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "bc0f0e64da9ebb8f18752d1d2381e59a"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "394dd3e8f8eecb6fbd5fd51ae1d26dc0"
  },
  {
    "url": "fr/gofurther/plan.html",
    "revision": "65e75b81d9065e5e53aa1c314b9d5032"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "ad84119f33a23496c1eb800992ce3ac0"
  },
  {
    "url": "fr/index.html",
    "revision": "15949e2c5a36ddeac9e9dd12b966fa48"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "a2e75d14f6a7de81c7ea4ffad75d792a"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "93352d870cbfe38f7b29b275056841bc"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "e86fa13ae26ee19c237ea0dcff04c84a"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "82f4916209490dfaa0efb5499337b4b0"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "408bfd8bce6d53f6e1b5f038b878cee9"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "2a0588728e11105761ede22ebce94c2d"
  },
  {
    "url": "fr/tutorials/index.html",
    "revision": "cd11e6536a32bd2195993092bdb15893"
  },
  {
    "url": "gofurther/alert.html",
    "revision": "2560833fd5521fe50849ac3da0498cf4"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "47ecf6d0f9fb0a013e786b34873d93bd"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "b7e345dd953754c2a1db695948d7ddc9"
  },
  {
    "url": "gofurther/index.html",
    "revision": "3de32904efde5a6c464f1b915a90dd0e"
  },
  {
    "url": "gofurther/plan.html",
    "revision": "238c2f0f52f91bb858998fe74639455b"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "90d520ce4929f819490143f9f8d40389"
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
    "revision": "14afb46dabb3d5313ca6896d76a62483"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "5387bede7fbfabfdccce290e707ffb04"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "2b879f5c68b63e50cf8232f904d06d11"
  },
  {
    "url": "quickstart/features.html",
    "revision": "eb4f24fd5027ca41cd56b9cffe3e4b8e"
  },
  {
    "url": "quickstart/index.html",
    "revision": "aa98e5b81e17bb16dc0564e1fe8fcb9a"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "0c763504d908057fd66a458f63f8ce01"
  },
  {
    "url": "quickstart/update.html",
    "revision": "1bae252ae22bd03913401f2bbb9ef100"
  },
  {
    "url": "tutorials/index.html",
    "revision": "8a0d5c4c58d922ce8f01b5795d261def"
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
