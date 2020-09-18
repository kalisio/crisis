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
    "revision": "5fbc4ebbdcc781a9d13d1ec72a89006d"
  },
  {
    "url": "about/contact.html",
    "revision": "0ec3d128d8b2967317d44c89bd1971ca"
  },
  {
    "url": "about/contributing.html",
    "revision": "506a265871cfb6f5e93260a48ea7190b"
  },
  {
    "url": "about/index.html",
    "revision": "3c5d716e161251bff6c98f5193ed52b4"
  },
  {
    "url": "about/license.html",
    "revision": "1e7a62532601399fd3483b2622e56a28"
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
    "url": "assets/js/10.62c9ff6f.js",
    "revision": "0d6918ff81e93eebfb094e3411febe87"
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
    "url": "assets/js/13.9944e851.js",
    "revision": "0c2c10ba06b9318069d26a4e42b8f5a5"
  },
  {
    "url": "assets/js/14.a5928441.js",
    "revision": "1d2f7d5916ada39dba7d165516571a5b"
  },
  {
    "url": "assets/js/15.9a976fe7.js",
    "revision": "365140bcef1788aa9c14a4cbd50df8cd"
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
    "url": "assets/js/18.d7a309fc.js",
    "revision": "8c138f563335e710769ea20dccdd6dd3"
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
    "url": "assets/js/29.b657d4e2.js",
    "revision": "09da6a5cd212a08651e7cefd7de6ce28"
  },
  {
    "url": "assets/js/3.76bb9041.js",
    "revision": "c9572a23351502f3468ba39cb922bb2e"
  },
  {
    "url": "assets/js/30.bed638b4.js",
    "revision": "062b6e2a7d7da4b74486a29016a133b8"
  },
  {
    "url": "assets/js/31.83213ea0.js",
    "revision": "5b5cfd7e15e95d82c5b19ea72d612c71"
  },
  {
    "url": "assets/js/32.e9638f87.js",
    "revision": "ca2577d64495810fcb59317e8c72bc8b"
  },
  {
    "url": "assets/js/33.dc273c95.js",
    "revision": "0ee6bd27cdbef72bd71c265803f46176"
  },
  {
    "url": "assets/js/34.fa385eb9.js",
    "revision": "c1af58d0590af3f2dd5cb911d4f03f00"
  },
  {
    "url": "assets/js/35.aa86fa58.js",
    "revision": "86804b25ad0d456f64c789f0c5436cda"
  },
  {
    "url": "assets/js/36.78ada839.js",
    "revision": "458439a7e43f7e852e3ea39bdaa13a10"
  },
  {
    "url": "assets/js/37.3fa0b32c.js",
    "revision": "be183029ed397d48c174852c9e9e6f9f"
  },
  {
    "url": "assets/js/38.af864bbc.js",
    "revision": "2317fcff7998dae7f2ec9a2c2416f6d1"
  },
  {
    "url": "assets/js/39.8cf999d0.js",
    "revision": "a5c9ca8d0f55eadb6de849c61d81bea4"
  },
  {
    "url": "assets/js/4.a449ea53.js",
    "revision": "b7dac93ce983fecd9a8c445534eb17fc"
  },
  {
    "url": "assets/js/40.950da6e8.js",
    "revision": "e9c94d1e658d9e927cc48379a04a9af8"
  },
  {
    "url": "assets/js/41.a6423fb3.js",
    "revision": "9d27316ffd8761abf443e619de2bc18b"
  },
  {
    "url": "assets/js/42.270d907d.js",
    "revision": "36cab39cbabb6188414d49b194081065"
  },
  {
    "url": "assets/js/43.0821d048.js",
    "revision": "b2f0a6feebf109091a6bc61644fdced8"
  },
  {
    "url": "assets/js/5.fb3b9347.js",
    "revision": "92ccfe2cfd26182c9e6bbbb93e5cfa10"
  },
  {
    "url": "assets/js/6.a1f90bd4.js",
    "revision": "aeb35bb696f78c84f96864a61058afd9"
  },
  {
    "url": "assets/js/7.f7ffe194.js",
    "revision": "ec08fc28619a0d377f0713e61c95400c"
  },
  {
    "url": "assets/js/8.c2212af6.js",
    "revision": "35dbbb7f6fa185eb508f7c0d2ecc51b3"
  },
  {
    "url": "assets/js/9.d7e5a8d4.js",
    "revision": "f4238afcb9eef965a3c19076f3d4f492"
  },
  {
    "url": "assets/js/app.8da6b0c6.js",
    "revision": "eff85d6eeee1d18ee46c94396b5043c7"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "b646a9ae799c5d0d17284dc6735121ee"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "4d3e24b051fdc023b80bea52e9d54454"
  },
  {
    "url": "fr/about/index.html",
    "revision": "3109f559763ccc01a11942cd90c1b2c6"
  },
  {
    "url": "fr/about/license.html",
    "revision": "90b05cfaaeafc3388fd1629ee43eedae"
  },
  {
    "url": "fr/gofurther/alert.html",
    "revision": "ff7ebf92ea9aae3cf96d4e332c57e654"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "9093658e56c61637875cab8d52c5f7a2"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "6f8de48fe9efa044e354298e4e1c96ec"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "9ee30a32bc026b29f0b172d9d0642060"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "47ddfde04a2ff77c64d9647f7813e6c6"
  },
  {
    "url": "fr/index.html",
    "revision": "86b476c4a4e617ef9c113eb833ef66d4"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "6a314507bc33debc8b51bb457e101721"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "ec39c5246b7b3c79fc338404e4a15edd"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "73eb09e57a9eb37f3c01ecae5e6670ba"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "45e00bc361e3c6088fbaaa8b6b1c84de"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "28eb8e54c8bcd3a222518ec0b12b95b8"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "9e1fa981a05aa2a47187474dea8af43e"
  },
  {
    "url": "gofurther/alert.html",
    "revision": "494f07726f3f09d958c7bcaf2499d66d"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "cb09603ef957baae787ced82a4bb2fb9"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "3082825afa05175a0aee8d5ecd7ea5e3"
  },
  {
    "url": "gofurther/index.html",
    "revision": "04be02cc9d968ffe1d619c95ab2f493b"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "8078a1f411c789ce0b2a45bc353e9041"
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
    "revision": "f45fc19240a2e7c8d485e3e69f4a6639"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "d276a9caea737931c313faad41dc040f"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "bc4a1e66a212004b2b8c2b295d398c33"
  },
  {
    "url": "quickstart/features.html",
    "revision": "ff854786157eea463a77d284520a0ad7"
  },
  {
    "url": "quickstart/index.html",
    "revision": "f59fb3c6c160889f096c0eb939d2bcfb"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "ef36697bcefdcb2ffd84fa7c3eef4448"
  },
  {
    "url": "quickstart/update.html",
    "revision": "e48910d174ae1cb6d0cc58eb200a4407"
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
