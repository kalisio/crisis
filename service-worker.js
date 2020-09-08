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
    "revision": "a64363f5c08060d7f6d77faf7e7ce2af"
  },
  {
    "url": "about/contact.html",
    "revision": "470f8b1448a503e291304f521749f083"
  },
  {
    "url": "about/contributing.html",
    "revision": "33ab8fb1af44565e3147e0f336b141df"
  },
  {
    "url": "about/index.html",
    "revision": "6961acbd2fd11aabad13971d60ef71d9"
  },
  {
    "url": "about/license.html",
    "revision": "475ec2aa2e735ca40f040c2b656129ab"
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
    "url": "assets/js/10.c5e76166.js",
    "revision": "a601cd3184c252b73e4afe8c9e491bc3"
  },
  {
    "url": "assets/js/11.6d674762.js",
    "revision": "e0c181440176e310bf34fd4b8a51bef5"
  },
  {
    "url": "assets/js/12.8f8c15b9.js",
    "revision": "2c177d5e8ae11b58e2137964d0420811"
  },
  {
    "url": "assets/js/13.15d34522.js",
    "revision": "44f818567b9265503f26843c0cc8671b"
  },
  {
    "url": "assets/js/14.52ed68f3.js",
    "revision": "3962a0089e2ee15efda6cbf97069dd74"
  },
  {
    "url": "assets/js/15.1b3bb0fc.js",
    "revision": "024137b6f97d18e76aa8c778081d9e02"
  },
  {
    "url": "assets/js/16.f9eb7cd7.js",
    "revision": "7f3784b5aa9ec8654acb888025ace2c9"
  },
  {
    "url": "assets/js/17.b517e16b.js",
    "revision": "dabe8dfff21b7374d2fbc04ae3c6fa2d"
  },
  {
    "url": "assets/js/18.98844f19.js",
    "revision": "6e2cfdcccd18d56c08da86714dbfc380"
  },
  {
    "url": "assets/js/19.ba8f64e7.js",
    "revision": "afa6cd21ed307cf762d0c4a6a8f01dd3"
  },
  {
    "url": "assets/js/2.f633ba12.js",
    "revision": "792866830df177f1cc7512bb230a320b"
  },
  {
    "url": "assets/js/20.4667a627.js",
    "revision": "fd0c9120bd930cebaab90373c285426f"
  },
  {
    "url": "assets/js/21.313693a3.js",
    "revision": "a8aca2296093069d1e0b30f13a106257"
  },
  {
    "url": "assets/js/22.9935df38.js",
    "revision": "f837a326a218cdaca42f95f7d0be4c17"
  },
  {
    "url": "assets/js/23.d3620906.js",
    "revision": "80988e6f629211e8b3294b8f599b2ca4"
  },
  {
    "url": "assets/js/24.85b37b2e.js",
    "revision": "a55282dcb0d81dbf24229fa5272ec47a"
  },
  {
    "url": "assets/js/25.0985a416.js",
    "revision": "a4932d0e3b35c2b2e364e82a63835148"
  },
  {
    "url": "assets/js/26.5b3ea318.js",
    "revision": "9c3c263963caf0260a82fe790227bb96"
  },
  {
    "url": "assets/js/27.0f12fc4f.js",
    "revision": "e3445702ac7cc597794d37904638e77d"
  },
  {
    "url": "assets/js/28.da74017e.js",
    "revision": "09d1d8168607bf86aee3c2d47f6d2022"
  },
  {
    "url": "assets/js/29.cad27597.js",
    "revision": "92457cffef34a730411a52a5f392edbb"
  },
  {
    "url": "assets/js/3.d3db95c9.js",
    "revision": "a16ab2634989f912b87bdccf6209cc93"
  },
  {
    "url": "assets/js/30.3ccb77ad.js",
    "revision": "78d4756f52bfe5cdf61019bee13c2b89"
  },
  {
    "url": "assets/js/31.f258d646.js",
    "revision": "efe5cfae12e4c6eace38510f69a5bf5b"
  },
  {
    "url": "assets/js/32.5442048f.js",
    "revision": "ec625dcc70c752ea0c170d772cbd583e"
  },
  {
    "url": "assets/js/33.10fde4f2.js",
    "revision": "b7a802ef4ea863eda6561562fcad9f3a"
  },
  {
    "url": "assets/js/34.3665d470.js",
    "revision": "59f2fd6985c2c99c1cb4e3e78f2b4090"
  },
  {
    "url": "assets/js/35.a6c48098.js",
    "revision": "e95172eed79d811db9f9f4ba2fb8bbf7"
  },
  {
    "url": "assets/js/36.00aae7c8.js",
    "revision": "53c63730817f6c2b353502e106277524"
  },
  {
    "url": "assets/js/37.934e27b8.js",
    "revision": "f9c063e870575760b54cd35d655e6801"
  },
  {
    "url": "assets/js/38.879ce0d5.js",
    "revision": "212142e17dd468f53bf63eb1a2a96571"
  },
  {
    "url": "assets/js/39.62fda40b.js",
    "revision": "51703099da97873dd46ed75c29a055f7"
  },
  {
    "url": "assets/js/4.ce4696ad.js",
    "revision": "d049136bd4e9b54503f62096bb4eb6b2"
  },
  {
    "url": "assets/js/40.fec53454.js",
    "revision": "d9cab8ac3ce769a52941369d8b9d962b"
  },
  {
    "url": "assets/js/41.d53cb6af.js",
    "revision": "aabf0026f6ddfc1b17d5901782f4049e"
  },
  {
    "url": "assets/js/5.6082c43d.js",
    "revision": "9535e68dedf996ca3b8be7b7d4e2914c"
  },
  {
    "url": "assets/js/6.2c49e9b9.js",
    "revision": "c2663d0bc1dec81fa09e6f7b5a349e93"
  },
  {
    "url": "assets/js/7.a260fb2c.js",
    "revision": "c9022136e7a471cbb6381b8afcd0d4d4"
  },
  {
    "url": "assets/js/8.5ee91fef.js",
    "revision": "c09bceb416df7070d9438ccd0269d1aa"
  },
  {
    "url": "assets/js/9.918c8d31.js",
    "revision": "35951819f3c2274a75849bfe4141baf2"
  },
  {
    "url": "assets/js/app.ba6a3aa4.js",
    "revision": "dbb5f706b0b8b07f40c543098b2d03da"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "b0b8695d42cdbaddf7806ee56b17dc92"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "4f13b0edf0846ab0e590181947df86ce"
  },
  {
    "url": "fr/about/index.html",
    "revision": "e946d9866bc3c25f3c81cea2dcb6b492"
  },
  {
    "url": "fr/about/license.html",
    "revision": "87c4227c657aa7a06b02df8e48257223"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "b176ba819fd1cda00cdd0e5cbb9ff7b9"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "86face3c067345398312803ad1320a6f"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "62cde29fcee25d3a3eabf2dde82153c7"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "ea8cd551ccf70d00409e5bc65a81cb83"
  },
  {
    "url": "fr/index.html",
    "revision": "ec4b04e353e8a70e5bf3c813a1dc107f"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "41cc8dfbd2aa61f0b81959769ae85033"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "4d4202390d1d54a616664cf597be6d7d"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "5d0cbad1e84fc5b7e8114d39803c3593"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "1cc4b29564c135494f463c61972781e2"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "de4beaf98300d18502059ab583329a72"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "6bd2b796f7e25cbff9ce9dfdbf14f06a"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "1be34d66bb965b2421c32e38ccd0a491"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "285bbe1efcd4709c27be2284fb04c5a7"
  },
  {
    "url": "gofurther/index.html",
    "revision": "26d8d5fe13012523174b0c47d223910c"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "83a46653141c82d84c93057a65363a79"
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
    "revision": "39ccb90e9c41fa9df089f5c6be84b33c"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "12849c65b347eed91095eda90178854f"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "0759056923a8dbe12582056b31449723"
  },
  {
    "url": "quickstart/features.html",
    "revision": "7ca9d29ee78e3fadb7a0828d60f8e5bd"
  },
  {
    "url": "quickstart/index.html",
    "revision": "8266ba3cb84f43562bbff4ae1cfd7541"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "da149612c0959791d252b205ed240a1f"
  },
  {
    "url": "quickstart/update.html",
    "revision": "140f5e685e3db67fc69a749c25074cd1"
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
