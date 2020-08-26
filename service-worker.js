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
    "revision": "92654c0226af201a40ecd9354e709688"
  },
  {
    "url": "about/contact.html",
    "revision": "9b096a14105b1ada9c1bf738858a3770"
  },
  {
    "url": "about/contributing.html",
    "revision": "e83b6afb780703966995fe532d0b63fe"
  },
  {
    "url": "about/index.html",
    "revision": "79c634cfadf2c00d7d4fe4292103ed85"
  },
  {
    "url": "about/license.html",
    "revision": "d93e338d5b09e84dcfa30a925031086d"
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
    "url": "assets/js/10.2f9f9451.js",
    "revision": "e02e89cc1e35ed3a4ddea2aec938c3cc"
  },
  {
    "url": "assets/js/11.b556d5be.js",
    "revision": "2c696902e734c54ccafaf558b6ef9f1f"
  },
  {
    "url": "assets/js/12.be72e64e.js",
    "revision": "87e6a241bbe492ab535be75e68576f49"
  },
  {
    "url": "assets/js/13.c4313a4f.js",
    "revision": "eba0af0ef1baee5d196a580382c10ba5"
  },
  {
    "url": "assets/js/14.b786314a.js",
    "revision": "63785f5568786c5577639370bdbc1a02"
  },
  {
    "url": "assets/js/15.b1c1794d.js",
    "revision": "b50411e959242d29e05336ab47f61638"
  },
  {
    "url": "assets/js/16.0dc73627.js",
    "revision": "086eb2fbda708fba5032d2f402fbb1d4"
  },
  {
    "url": "assets/js/17.130c5806.js",
    "revision": "b51437c54fa15bbc43e9713d40780aa5"
  },
  {
    "url": "assets/js/18.970c1aca.js",
    "revision": "cb567bc78f63d0ac7d5091fa86821359"
  },
  {
    "url": "assets/js/19.752ae332.js",
    "revision": "623a8a49647c945894929b25d5caf6f4"
  },
  {
    "url": "assets/js/2.a5cd2daa.js",
    "revision": "4dd4d10416c6dc3136799cdfb2fe3dcf"
  },
  {
    "url": "assets/js/20.5ea22df5.js",
    "revision": "b340928420352e068a558ff939eb615a"
  },
  {
    "url": "assets/js/21.4ef78f90.js",
    "revision": "9ad524bb23141baf8fa57f1ab7e87c9c"
  },
  {
    "url": "assets/js/22.d9964018.js",
    "revision": "e413322055b50c9d2a4cc4c25eee05dc"
  },
  {
    "url": "assets/js/23.128c2623.js",
    "revision": "1b9952b3fa52c2a522571e22003ce872"
  },
  {
    "url": "assets/js/24.fee0ec92.js",
    "revision": "0ee6133172b40bc23537515f6ed94c98"
  },
  {
    "url": "assets/js/25.9743caec.js",
    "revision": "f3359a3d039db0e3b5eaca8b1046c795"
  },
  {
    "url": "assets/js/26.88302060.js",
    "revision": "28fc732f73cb010ecd7ded7ada351651"
  },
  {
    "url": "assets/js/27.08d8c1bf.js",
    "revision": "a6990d98fb20bdf903bd3490a81ce1dc"
  },
  {
    "url": "assets/js/28.a585f90e.js",
    "revision": "37c135a2e9d4c30a3062240f025fa39a"
  },
  {
    "url": "assets/js/29.27e2d6fb.js",
    "revision": "d87b382fd36cb0ac3bf3b3d20e231b3b"
  },
  {
    "url": "assets/js/3.c6237887.js",
    "revision": "92b1036f6c53cac964735e830afdd944"
  },
  {
    "url": "assets/js/30.b93e52cf.js",
    "revision": "b0463831a2655710aa58654c0cda42b8"
  },
  {
    "url": "assets/js/31.5d1ebb5c.js",
    "revision": "8b70c9774928ae50a224034b51dd5dd4"
  },
  {
    "url": "assets/js/32.b28622d6.js",
    "revision": "2250a2567d14f5127a542fa02e1bf98f"
  },
  {
    "url": "assets/js/33.719368c0.js",
    "revision": "c9c09ee54bed82bb8e7ea2c19aac76fe"
  },
  {
    "url": "assets/js/34.b29fc157.js",
    "revision": "e6d931acbc7a7d243e3f00729d25803a"
  },
  {
    "url": "assets/js/35.55b96809.js",
    "revision": "58fcffd5b7773fc4497fc23761f25d85"
  },
  {
    "url": "assets/js/36.99592904.js",
    "revision": "4262fbce391c39dca3cdb9fa09e33831"
  },
  {
    "url": "assets/js/37.5134c14f.js",
    "revision": "a43aa681fb9d62bbd07025ea9d655535"
  },
  {
    "url": "assets/js/38.159fa734.js",
    "revision": "b2ac91d444082c6a391451171962a42d"
  },
  {
    "url": "assets/js/39.fbf21781.js",
    "revision": "6a5f42620db91f7dd35542680ede45c8"
  },
  {
    "url": "assets/js/4.acaa1aed.js",
    "revision": "97becf440eac053a25e9f6211da82cbb"
  },
  {
    "url": "assets/js/40.d7382aa9.js",
    "revision": "17c6d8d1686687d24d6c1754d437b8ea"
  },
  {
    "url": "assets/js/41.b567d6a4.js",
    "revision": "4e4e0f20be8c2c1fc3f38a79a121133f"
  },
  {
    "url": "assets/js/5.a60afc61.js",
    "revision": "7ec4b4b984918db82bf69593ecd839e6"
  },
  {
    "url": "assets/js/6.4a693103.js",
    "revision": "92b5afd71017c9822a84a9acc7e454b1"
  },
  {
    "url": "assets/js/7.2edf5844.js",
    "revision": "350293eea28277a077966c3f72d02a33"
  },
  {
    "url": "assets/js/8.13ae3be7.js",
    "revision": "087d00418c9fc0ddc4a897f61d243766"
  },
  {
    "url": "assets/js/9.53c69685.js",
    "revision": "5f02f3c7981b460b849fd81b2daa8f97"
  },
  {
    "url": "assets/js/app.9659fad5.js",
    "revision": "5133c287bacd68e389d0e05e24af87a8"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "ea29632c1e511ae3fa3260b638acb8b8"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "65239b5fd657c829937cda2562b54d82"
  },
  {
    "url": "fr/about/index.html",
    "revision": "e455ea08418d53e3ea4cea83a6e4e7ad"
  },
  {
    "url": "fr/about/license.html",
    "revision": "f776d0c42d70eee3780272d2f1b924f4"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "35b7d927e5fd7aca6f96b1e08226383e"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "abf4cf170f3361f20fc356955885f299"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "1fe3a3ffdf16282ffd60a5e014127ecb"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "a337e865b6ab0e28bd9c9c7c80ed7380"
  },
  {
    "url": "fr/index.html",
    "revision": "0896cafe09db5f083a7655b971d7acde"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "7fc579353a5a9d920e4426da51491d99"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "805ebd12c1735bff6320bf496a5e4ea4"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "d5b5e9e59d9d57f18f2896712118fc32"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "8bd7c5a69c8bdabb5884a1b1c9dc8c76"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "0fc0ee969e85e43be3d72addb5104c99"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "6e393a6d4370d73b24bd18c9b4ebbfa8"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "cbe1dac8b9ee28fce396927d64e3e831"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "1c6da34198ab9810de76bd2d4ee253b7"
  },
  {
    "url": "gofurther/index.html",
    "revision": "17f8d34b02a77ba0a9100390809ec6e4"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "cbf76a61bd233cb9d70d933c520e1776"
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
    "revision": "8f39ab8fab7d87d86d033c1fd647db0d"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "3c169db09308a7c87a98fce464eaae7f"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "6e602abf93556887bfd823c3b43c3896"
  },
  {
    "url": "quickstart/features.html",
    "revision": "6098d6821393a78fb1eb657cc96e6425"
  },
  {
    "url": "quickstart/index.html",
    "revision": "a3fa7b3c5fc5c2a9b3431fb0ca083c68"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "3dc3947f3392d8f8f00cdc4e27aafd67"
  },
  {
    "url": "quickstart/update.html",
    "revision": "ab2cf87c314f7c7ab76e4a25f79aa874"
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
