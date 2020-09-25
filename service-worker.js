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
    "revision": "2a9baea79153e42ad2aa07e1fc377a1a"
  },
  {
    "url": "about/contact.html",
    "revision": "5c91afc92fe1a732bec86d3dbc04fd84"
  },
  {
    "url": "about/contributing.html",
    "revision": "d5a19d5d37d4fefabdcc9b75a990cff5"
  },
  {
    "url": "about/index.html",
    "revision": "eeb19c1a4f188d53d20fa53f9682580e"
  },
  {
    "url": "about/license.html",
    "revision": "dc8d8b82c63107c6de16ab8f13ecba21"
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
    "url": "assets/js/app.188325e1.js",
    "revision": "db3578df27efa5627b816af3d50e27aa"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "e2343c60d2dc2c135d1cc646310bda3f"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "a744ced60dff96d595786e9bf821aab8"
  },
  {
    "url": "fr/about/index.html",
    "revision": "d610f10d762ea1b65eb09c29c12ddef7"
  },
  {
    "url": "fr/about/license.html",
    "revision": "363d9f043bceee1e84accec2adf9cf74"
  },
  {
    "url": "fr/gofurther/alert.html",
    "revision": "15d81da3ff689a282ab04d54197aa465"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "998808b39d596583a2a4f5a2f8012daf"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "87337a380ca03967ea08f8f549e69a23"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "52d629aa3b7b08cf98e7891dc2a272f2"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "27eb77190d88bee38545324f46bb2a60"
  },
  {
    "url": "fr/index.html",
    "revision": "980b2d29527f49ea334fd67bf2769e5d"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "82bad7c5dea6093e3e8a8fe4e7f89cb0"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "a8c1b3526444bb5c8925d7362e008add"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "941365473bf4f12212e4db01a4f5b0f1"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "7d33865fea51a1ff896dc1a5bbf9c213"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "cd19b4aa6ab4cbf16162c42e51881df5"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "c2800ef18fd9ae7d24e652721e58b915"
  },
  {
    "url": "gofurther/alert.html",
    "revision": "582ec6297e145aafb2062b969642b7b8"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "b04efd4c8d87c4453cceb94b730bb94e"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "ee5d0cc9de518b4db87df34847b02570"
  },
  {
    "url": "gofurther/index.html",
    "revision": "c7f687a3caaeed54f74d84af5fda7546"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "975cb8d2f7886675d8d60156bf675acb"
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
    "revision": "75aa2e8eff41560643afa7c1409e6151"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "5221d174ce973bd4aa367b38b618f01a"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "1981b52445c6812a66fe2f52ac0d1aad"
  },
  {
    "url": "quickstart/features.html",
    "revision": "200f26a244c2aab904effea958390850"
  },
  {
    "url": "quickstart/index.html",
    "revision": "6391cb973702fe32ec880609830b0417"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "2475bd6a4819671824b852ee0fa4f683"
  },
  {
    "url": "quickstart/update.html",
    "revision": "bf3250979a7da3555f961f4b8cacf82d"
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
