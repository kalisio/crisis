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
    "revision": "b6d28cd4bb60c51bfcd5bd8ee8f844ae"
  },
  {
    "url": "about/contact.html",
    "revision": "316d6a1415211d1b2f21f160b5d292b3"
  },
  {
    "url": "about/contributing.html",
    "revision": "4ff4d312c0d6d58d2644a76388bf2916"
  },
  {
    "url": "about/index.html",
    "revision": "b924854958b580094cabdf45e7406db2"
  },
  {
    "url": "about/license.html",
    "revision": "c786a603fd41e9d17405411f5db3da5f"
  },
  {
    "url": "api/components.html",
    "revision": "a1f5ee2ba460f7809514e73c2c8b85d5"
  },
  {
    "url": "api/hooks.html",
    "revision": "2929e0b7347390ada2c8f89495092f0b"
  },
  {
    "url": "api/index.html",
    "revision": "26b5b6f2f3514921fe5b73c4f715f14f"
  },
  {
    "url": "api/services.html",
    "revision": "d9f15a941a945f883f07613e1907f4ac"
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
    "url": "assets/js/10.c4b4f927.js",
    "revision": "bfd19625b20bf9c69ead6fe36f48778f"
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
    "url": "assets/js/14.ac6d8adb.js",
    "revision": "9636cc6b49ed6ecf721fcd3d0cdfce01"
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
    "url": "assets/js/17.919704b4.js",
    "revision": "1d24e888ce1f4810d095a0fd40ff8ec1"
  },
  {
    "url": "assets/js/18.2bb081b7.js",
    "revision": "559f71b82989d17f8cab31508de893a4"
  },
  {
    "url": "assets/js/19.75e61b6d.js",
    "revision": "d342af58faaf9b958488433118ab0cfc"
  },
  {
    "url": "assets/js/2.eb8e41eb.js",
    "revision": "6d35586aac27407fa5deeb433924f362"
  },
  {
    "url": "assets/js/20.90ad7514.js",
    "revision": "c2a823ffd9f1c9b2512650a6e39d0724"
  },
  {
    "url": "assets/js/21.3b875169.js",
    "revision": "a4de13012c2e6f94724a1fb1924ab5fe"
  },
  {
    "url": "assets/js/22.43d9bc2f.js",
    "revision": "2cdcddf53ded779c8ff5170b4200c528"
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
    "url": "assets/js/37.82f711e5.js",
    "revision": "6c1516321cee0b8dfcf463ed6509d9ff"
  },
  {
    "url": "assets/js/38.1f9e8c94.js",
    "revision": "fcbe3d6decf046713ff8798bbb964506"
  },
  {
    "url": "assets/js/39.1f0b79e3.js",
    "revision": "d357fcc1dd8cb9bf5fa891957af4117d"
  },
  {
    "url": "assets/js/4.e1a649c9.js",
    "revision": "74be19566bd9d573bede7643851e5646"
  },
  {
    "url": "assets/js/40.d3d257f9.js",
    "revision": "722249684c22307e29c76fcc6331f2df"
  },
  {
    "url": "assets/js/41.52bbde36.js",
    "revision": "6fdc1eb9216c08c89a3ac27e0574eb27"
  },
  {
    "url": "assets/js/42.963addd5.js",
    "revision": "11f3d1c09c69d551b157c892e93b6706"
  },
  {
    "url": "assets/js/43.ddb1839a.js",
    "revision": "05899131df7f01821d9ac75ceb2d9e1b"
  },
  {
    "url": "assets/js/44.221dce8d.js",
    "revision": "6fda71df319218cf698be163480d0c78"
  },
  {
    "url": "assets/js/45.991d070a.js",
    "revision": "a2baa24ad07703eca7534d6e0d0c90b5"
  },
  {
    "url": "assets/js/46.931873a0.js",
    "revision": "a1cd2c5a2a1459fec5d8711b94909192"
  },
  {
    "url": "assets/js/47.e4a07926.js",
    "revision": "e890071c4e45f596a22c797696e43588"
  },
  {
    "url": "assets/js/48.ed9e1991.js",
    "revision": "3c5ee1a4720fe099ed87930ca70c3670"
  },
  {
    "url": "assets/js/49.3c803161.js",
    "revision": "d90a865d975f2f57f05b6b4cf1a8b58a"
  },
  {
    "url": "assets/js/5.bde5a0d0.js",
    "revision": "8bfff644066af4da1c38be9ecb46227c"
  },
  {
    "url": "assets/js/50.55b5e088.js",
    "revision": "68b6f9dd266104ac3397ebc18ae5bbe9"
  },
  {
    "url": "assets/js/6.ae5a07f8.js",
    "revision": "046dcd86f0540c83dc2d8d6897d4aac1"
  },
  {
    "url": "assets/js/7.857df8de.js",
    "revision": "88b785f951d7d2ad7f9d97c519bb99b0"
  },
  {
    "url": "assets/js/8.cb988d5b.js",
    "revision": "8222548ae4bf48029903f21bdf5c18ca"
  },
  {
    "url": "assets/js/9.db477cd5.js",
    "revision": "39d05deca96a35f3e745170fbc0ec1c2"
  },
  {
    "url": "assets/js/app.80c83e6d.js",
    "revision": "36713fea65940eea948d38d30e2c625d"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "6907a9a8a6f672feb3f1dd309088e964"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "74e63cdeca1346e291fac015203cd2a0"
  },
  {
    "url": "fr/about/index.html",
    "revision": "e766b385b4a9c086bd0b26f955c22e86"
  },
  {
    "url": "fr/about/license.html",
    "revision": "c57d5d92c8fac3defb77fdfbdf43ebb1"
  },
  {
    "url": "fr/gofurther/alert.html",
    "revision": "b2402f0e2ad57d942154d38de2b9e1ad"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "478c60671ca4321d9104efee9a71cae7"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "7dae36126e82af4bf90be1c06ed95c11"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "614418729beca75a6d81df44c68c9ca9"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "9e5d2e90f5b3f4fb94ef1c51346e26c3"
  },
  {
    "url": "fr/index.html",
    "revision": "0a69f2a2eba9f13439c7b495cc0cb469"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "f9ed739f60b5b943fe2b6e671e3f1507"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "48dbf76ebd6d2e5e6e55e3a11aa7ffe6"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "8e9f852e7b2be6eab9069ab14c7d44f6"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "93b4e9baac5d3fa88d5211c61e45950f"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "1f47784373a4d62c0fa1384cb691eba7"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "ddb4792b544db33c63c25c72754765c7"
  },
  {
    "url": "gofurther/alert.html",
    "revision": "86379d54264297f385c51230e85db6e7"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "c6fddd0a299d6a3f0cf31bad38d10b19"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "1b2d1cf26603e3e70c3187e07c0797be"
  },
  {
    "url": "gofurther/index.html",
    "revision": "e4227a91752b41e2f456ebcd29bb5db5"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "458acdeaecc434b3a4c0e3c554d68f06"
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
    "revision": "ac74acec850fcf2c8df89426a1edb44a"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "bc5f65690a274894f503a914f943edf4"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "3a17b178812607b9430d71f6c2628362"
  },
  {
    "url": "quickstart/features.html",
    "revision": "6b5d00cc69d84fd5b16866feb7526617"
  },
  {
    "url": "quickstart/index.html",
    "revision": "7f511b5d216a51722feaf091b1602039"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "3f9e49633074ceeb70bb9e0927cc0497"
  },
  {
    "url": "quickstart/update.html",
    "revision": "52d604cc67c4139eec53655d61fddddb"
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
