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
    "revision": "864c94c70d71da31c5f2825f99639e6b"
  },
  {
    "url": "about/contact.html",
    "revision": "483a388c9e228c0a81afb4e69458b558"
  },
  {
    "url": "about/contributing.html",
    "revision": "1652b6f61df51b607e60515cab039916"
  },
  {
    "url": "about/index.html",
    "revision": "4042ed0eefafc29a81fad851cfd49ba4"
  },
  {
    "url": "about/license.html",
    "revision": "e928140b08aaa31c24dc8f123f2189c8"
  },
  {
    "url": "api/components.html",
    "revision": "6d30cda1dc863b947cf26fe84aabc5aa"
  },
  {
    "url": "api/hooks.html",
    "revision": "e23576a5f0ce9b93b24b5aa315acbba7"
  },
  {
    "url": "api/index.html",
    "revision": "2fc869395576bc797f5fec1cab960be1"
  },
  {
    "url": "api/services.html",
    "revision": "dfc303a2919655c15be6792bdc7ffa76"
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
    "url": "assets/css/0.styles.62d498f4.css",
    "revision": "4ba5def3cf001cdac936f604d15bc168"
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
    "url": "assets/img/adminexpress.28f5474d.png",
    "revision": "28f5474dbc248dd618423f6726d5df81"
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
    "url": "assets/img/Android-Update-EN.8ebb9a5e.png",
    "revision": "8ebb9a5ed9647b74c8863cfaf1622e90"
  },
  {
    "url": "assets/img/Android-Update-FR.b325e265.png",
    "revision": "b325e2651cdc5c871b656625bf3baa7a"
  },
  {
    "url": "assets/img/Android-Update-Previous-EN.63bc440c.png",
    "revision": "63bc440cd26abc0257d61361e0ffab68"
  },
  {
    "url": "assets/img/Android-Update-Previous-FR.72adfab5.png",
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
    "url": "assets/img/filosofi.fe6823d4.png",
    "revision": "fe6823d4cda7956247a5d78fd24d6a76"
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
    "url": "assets/js/10.119b426a.js",
    "revision": "23a6b267ffbbef59202d70b232d3d9f9"
  },
  {
    "url": "assets/js/11.91f3ee5b.js",
    "revision": "6c14281852da4be69456d1b1cedb88fa"
  },
  {
    "url": "assets/js/12.20ed2d22.js",
    "revision": "14d8c8ab22de9e51da581f02202d25bf"
  },
  {
    "url": "assets/js/13.3160d1b9.js",
    "revision": "ad18f58ed166b7c7e3d710b907370d5c"
  },
  {
    "url": "assets/js/14.238f0814.js",
    "revision": "65372c42a4391b00eda43098c6aae0d5"
  },
  {
    "url": "assets/js/15.17ba1ea5.js",
    "revision": "67760a28462c933d55715820b32eb254"
  },
  {
    "url": "assets/js/16.d3a5acba.js",
    "revision": "43bcab50df587ff071378db1dfb9b693"
  },
  {
    "url": "assets/js/17.46ee2fb8.js",
    "revision": "f374750cc430567c20c71293aab18f5c"
  },
  {
    "url": "assets/js/18.80aa8be2.js",
    "revision": "1e6acfd4ce6ef7fe6effd2fa6d12d5cc"
  },
  {
    "url": "assets/js/19.28fac33d.js",
    "revision": "c7e17c61ddb2979cd7b61ddf24ce9379"
  },
  {
    "url": "assets/js/2.e8b1bbaa.js",
    "revision": "7c62de523ca628ccd0a35206b9262b7f"
  },
  {
    "url": "assets/js/20.a7ee7e41.js",
    "revision": "89fb7404d65281e0e4b597ccd743e556"
  },
  {
    "url": "assets/js/21.5a0fb1c5.js",
    "revision": "3b8226a5718e6d1fb4fba8b0c6c7bf8d"
  },
  {
    "url": "assets/js/22.1ad88994.js",
    "revision": "9d4f887495674b4fb346f144d945553d"
  },
  {
    "url": "assets/js/23.40897af6.js",
    "revision": "3adf71c3883b58375510909265449519"
  },
  {
    "url": "assets/js/24.5f0e8e09.js",
    "revision": "b893876dc3498728fc3dedf8eaaef7fd"
  },
  {
    "url": "assets/js/25.71904ca4.js",
    "revision": "a6d0952b56a0baaf74bd65c913614b59"
  },
  {
    "url": "assets/js/26.c54f5df2.js",
    "revision": "323f8bbb27293f6728e452ed55ff1a5c"
  },
  {
    "url": "assets/js/27.7b51e58d.js",
    "revision": "2b4d48d6ab2215a859e1d5491ca6c003"
  },
  {
    "url": "assets/js/28.63ff9a91.js",
    "revision": "f960c8beee6fd0ffc98aba4309ccb840"
  },
  {
    "url": "assets/js/29.907e6d7f.js",
    "revision": "1e592ba4ef3bff67b3ce3bd01d60a183"
  },
  {
    "url": "assets/js/3.16a052bd.js",
    "revision": "bced8119c7c51b295106336c630adf8f"
  },
  {
    "url": "assets/js/30.e563238d.js",
    "revision": "5730de52a09154f2cff1032bd1b353fb"
  },
  {
    "url": "assets/js/31.3adf7461.js",
    "revision": "5b9e13bfd9370c9e49923c0eb6e0deb0"
  },
  {
    "url": "assets/js/32.4c81398b.js",
    "revision": "6d222bbbab183f470340ccc5e1067a90"
  },
  {
    "url": "assets/js/33.eed50c4b.js",
    "revision": "3af8864a11676020fb1f80482cb61070"
  },
  {
    "url": "assets/js/34.dda2f19b.js",
    "revision": "225b4d4d81dc59c5c0cd8380de6efd2c"
  },
  {
    "url": "assets/js/35.dd94fafc.js",
    "revision": "2e638add07911c9f67070dbf14730cfd"
  },
  {
    "url": "assets/js/36.0b3101a5.js",
    "revision": "6571835e2f724fc10474a31894fc5c3f"
  },
  {
    "url": "assets/js/37.4b2f2599.js",
    "revision": "b8bb2b80c8e37b44353d592163a2d692"
  },
  {
    "url": "assets/js/38.a7aba8f9.js",
    "revision": "c7fb9c5e7ffdbc7445ab660b1b1e99c0"
  },
  {
    "url": "assets/js/39.959b30c2.js",
    "revision": "e8e7b44019afecd66cc009b97c31cda7"
  },
  {
    "url": "assets/js/4.5220fc04.js",
    "revision": "5b2327676d0e41975cadd85c4406d941"
  },
  {
    "url": "assets/js/40.252193e8.js",
    "revision": "0ade0d237bb9f521c621be4ca33e055c"
  },
  {
    "url": "assets/js/41.87d93a95.js",
    "revision": "f172cccc56045c5ebf1595ab480f9f60"
  },
  {
    "url": "assets/js/42.4990ca09.js",
    "revision": "2c28e72edb30758ff200c197db0a31ae"
  },
  {
    "url": "assets/js/43.bf05455b.js",
    "revision": "28d3a0e3920cfede943d656bace6b58e"
  },
  {
    "url": "assets/js/44.408c30ba.js",
    "revision": "46b912d66ac0d81230f6b010be127354"
  },
  {
    "url": "assets/js/45.920ccb4a.js",
    "revision": "1b6cf5eb3096edb7cc567f360c173801"
  },
  {
    "url": "assets/js/46.fb26c0e5.js",
    "revision": "33777ddfbcebf9fd98c29b72eccd608e"
  },
  {
    "url": "assets/js/47.71ffe493.js",
    "revision": "27d760b321115088eff931352a0ae072"
  },
  {
    "url": "assets/js/48.4011b120.js",
    "revision": "060ba187b1768991d9673add8d403a42"
  },
  {
    "url": "assets/js/49.f2bbe8b9.js",
    "revision": "21136a726d66e6a253f902349208b93d"
  },
  {
    "url": "assets/js/5.6915de12.js",
    "revision": "f59252cf962bc670ee21e9508c08a61a"
  },
  {
    "url": "assets/js/50.5cdb5a44.js",
    "revision": "5521f7b0507cc8fccfb4a6d8e07f7a34"
  },
  {
    "url": "assets/js/51.e74851c6.js",
    "revision": "42085bdb5a6884c2461c7a12fb55da52"
  },
  {
    "url": "assets/js/52.942a7c52.js",
    "revision": "e157001a0c6e33be7fd0733a380c68bb"
  },
  {
    "url": "assets/js/53.ec0b2257.js",
    "revision": "b6e9d62cc16371f62651ace63099c524"
  },
  {
    "url": "assets/js/54.b33d4998.js",
    "revision": "b518a1d95068d77afce38e1ee997369f"
  },
  {
    "url": "assets/js/6.1e7b63a8.js",
    "revision": "cda0ea457e1137b45bd1a8022456f53d"
  },
  {
    "url": "assets/js/7.a60f2b5a.js",
    "revision": "0e38d0ec6052d08ef005686e50b806d4"
  },
  {
    "url": "assets/js/8.58b10179.js",
    "revision": "d30cff513f9df76922d8243d16d8f108"
  },
  {
    "url": "assets/js/9.84e3e96e.js",
    "revision": "91d789c2762a4935089c3380ff02491b"
  },
  {
    "url": "assets/js/app.4a4ddf9b.js",
    "revision": "39cd2439f228744c50b5c8104422471a"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "10c54dbdd511b474bcabbcb0558faddf"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "40246c8dcc68992e539b044759b92cc6"
  },
  {
    "url": "fr/about/index.html",
    "revision": "29866e91dd87ae9863ccf24b44414284"
  },
  {
    "url": "fr/about/license.html",
    "revision": "d6ac1fb0caebc3ba76da17851240b78e"
  },
  {
    "url": "fr/gofurther/alert.html",
    "revision": "4259758528f55188710e1a33ac6050f9"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "0e725bca664f14e827990c28e3465edc"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "cdf66210709b6aeef69d8d951842f3de"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "994a5cbe78eca65be36e9e2ebfd934cf"
  },
  {
    "url": "fr/gofurther/plan.html",
    "revision": "949fe4564b13f31227d9177404644379"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "8baf5aa159dd682f9a08ee2d8ffe7fa8"
  },
  {
    "url": "fr/index.html",
    "revision": "2d3b360deba1a5ffe51c07412d4c31eb"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "86cfaa9943aaf4a51f05f57c25f543bb"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "7065be9726cfd69175cf88bee7d7e1ec"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "ae0b2e699bdb7de8354be07288cca52b"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "b67ea8b143891fa656374948c01a8c81"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "82e6b19b968de4d96953d7e553972c7b"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "b716d3e430715ee510ccd6ca7e24a153"
  },
  {
    "url": "fr/tutorials/index.html",
    "revision": "ad4d870822755b4451ff0ecc47532e26"
  },
  {
    "url": "gofurther/alert.html",
    "revision": "dbed598995533faebd7dd2c385885362"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "a1d17d7bdc00e5dfafb8b32e4ffa08ac"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "a8709af8632a47ab8a42cc8dce54f1d9"
  },
  {
    "url": "gofurther/index.html",
    "revision": "e84f2a51f88080c6f4e3ba6d0f449552"
  },
  {
    "url": "gofurther/plan.html",
    "revision": "366fb74314c028988db0404292d68774"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "fee689da87d01732655b72b27439918b"
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
    "revision": "fd58aec16af935bd4129e15f429a0774"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "67c646ae06944bc0a7d7da41f7c7d4f3"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "d0a5000825e6c0ade89e3a5154e2aba7"
  },
  {
    "url": "quickstart/features.html",
    "revision": "5544812fef99e7a259ed8ad293bfc045"
  },
  {
    "url": "quickstart/index.html",
    "revision": "bc630a06c4555dc3fde6b5e14d473da6"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "6e768a8f60784923485775a07b74e63e"
  },
  {
    "url": "quickstart/update.html",
    "revision": "440afcf91c34dafcf6139252406f64a0"
  },
  {
    "url": "tutorials/index.html",
    "revision": "6ef7af5a0578b3774158f5d578328fb9"
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
