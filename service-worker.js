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
    "revision": "7147e7f46200629ea1e2f8561c902817"
  },
  {
    "url": "about/contact.html",
    "revision": "ee695f56e8835bd6cbd912ae27a6c747"
  },
  {
    "url": "about/contributing.html",
    "revision": "dc38785e72f76c549cd9adac5f37f1fa"
  },
  {
    "url": "about/index.html",
    "revision": "27d71d7490af4c50f10ad7ad6cb68fd1"
  },
  {
    "url": "about/license.html",
    "revision": "c471d3469fd5f7d97baf1083a84b31fb"
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
    "url": "assets/js/10.c9d95c89.js",
    "revision": "e21789418a53b31dd215ab6468b549ca"
  },
  {
    "url": "assets/js/11.42fba489.js",
    "revision": "d86427e5b3af1a37498de87ce74fb0d4"
  },
  {
    "url": "assets/js/12.dc330381.js",
    "revision": "04e0af135fbbf6682a512fb8e8dbeed0"
  },
  {
    "url": "assets/js/13.2a4f2914.js",
    "revision": "6d92e4ac52c762d4c0dd12344cfe8301"
  },
  {
    "url": "assets/js/14.fc055e7a.js",
    "revision": "1ca0e6d057230f57dd6299d7b911f407"
  },
  {
    "url": "assets/js/15.a93acfbf.js",
    "revision": "a715862fa68c7eb5bcfe51f4cae33a3f"
  },
  {
    "url": "assets/js/16.f2d18cdf.js",
    "revision": "368010bc667b58469eb74d4e599f4563"
  },
  {
    "url": "assets/js/17.870b02ec.js",
    "revision": "1283d7fe6ffa53e67264e0206b476cca"
  },
  {
    "url": "assets/js/18.f8b801f7.js",
    "revision": "94895b7bf813cdf76e01961ae14cd9ff"
  },
  {
    "url": "assets/js/19.e940bf5a.js",
    "revision": "23e8b9eb616294f3fe7fb72c92138e01"
  },
  {
    "url": "assets/js/2.b8003ebf.js",
    "revision": "5737f86530d3968978166e9995ee0821"
  },
  {
    "url": "assets/js/20.83bf6719.js",
    "revision": "ab7ec74eb0b71bc6b5fae18423bc333c"
  },
  {
    "url": "assets/js/21.9bc2a722.js",
    "revision": "75b7c336a3c0b69907b4116b1463448e"
  },
  {
    "url": "assets/js/22.bdcf6bf7.js",
    "revision": "6a3a1ab9ded10a181860297750811328"
  },
  {
    "url": "assets/js/23.ee9ea61a.js",
    "revision": "282d0b8f22569e667318735c655b198f"
  },
  {
    "url": "assets/js/24.bc72d351.js",
    "revision": "f78ca444755758d719cac8fea51d135e"
  },
  {
    "url": "assets/js/25.c853af07.js",
    "revision": "d96966a7b60acec80ac409f9dfbd1c34"
  },
  {
    "url": "assets/js/26.e5980b5e.js",
    "revision": "e1bfc0656cf01596e9a769123c431236"
  },
  {
    "url": "assets/js/27.06d0e672.js",
    "revision": "d6641554ec7f93e96e9e0f1732c23f6e"
  },
  {
    "url": "assets/js/28.d5f52a11.js",
    "revision": "4409f2b69fb9743b59215be21658b5cd"
  },
  {
    "url": "assets/js/29.da5eede8.js",
    "revision": "1fca289c5f01d7683a10d98354edc45f"
  },
  {
    "url": "assets/js/3.e4dd68f0.js",
    "revision": "aa05a2460f75e970d767d39ea921783e"
  },
  {
    "url": "assets/js/30.02700811.js",
    "revision": "6953ae83ea82f7a21f055fc0faa23538"
  },
  {
    "url": "assets/js/31.ae790817.js",
    "revision": "e0e02d8bae3db5403df21cd4645e0727"
  },
  {
    "url": "assets/js/32.16e77833.js",
    "revision": "c837bfc62bbbc1cd7077dfe51691f584"
  },
  {
    "url": "assets/js/33.6a86b65d.js",
    "revision": "313e7ca7d5bb9b816e122b4fce445ef8"
  },
  {
    "url": "assets/js/34.fd85a14f.js",
    "revision": "6e44618bc12ebc9b6ac4c95b349392ea"
  },
  {
    "url": "assets/js/35.3fb4a61e.js",
    "revision": "9f70af6d6483e4c943a557ae59f7a656"
  },
  {
    "url": "assets/js/36.7fab78ba.js",
    "revision": "8194a62898a7ea46a485bbe714236620"
  },
  {
    "url": "assets/js/37.2a94c801.js",
    "revision": "b8c60be963b748c522bce67b52cce2c9"
  },
  {
    "url": "assets/js/38.ebfa5f78.js",
    "revision": "588794634049be0892009fff8a748bf9"
  },
  {
    "url": "assets/js/39.e247014a.js",
    "revision": "f694120d5ae35113f0fac2404be936e6"
  },
  {
    "url": "assets/js/4.ac30be16.js",
    "revision": "5e1ac9b6578a47669be8cabfb47b30a3"
  },
  {
    "url": "assets/js/40.d7382aa9.js",
    "revision": "17c6d8d1686687d24d6c1754d437b8ea"
  },
  {
    "url": "assets/js/41.fb841632.js",
    "revision": "ab6edeb707ae867c240a771b39c3c9c5"
  },
  {
    "url": "assets/js/5.af7b296e.js",
    "revision": "5fb11fb646d48855341d29ead934eaa3"
  },
  {
    "url": "assets/js/6.9b97d1f8.js",
    "revision": "f27aeddac80cf603920df33384dfeb5b"
  },
  {
    "url": "assets/js/7.10b41c29.js",
    "revision": "4379e0d0171d9131c628ee1504536102"
  },
  {
    "url": "assets/js/8.1ac8b156.js",
    "revision": "d8494df952a782769d6cbae60763581e"
  },
  {
    "url": "assets/js/9.2a95f0c6.js",
    "revision": "42fe70f96826508905e3cbb73ee131ce"
  },
  {
    "url": "assets/js/app.5d67ea66.js",
    "revision": "f4392fce96ba2c9582dfc5915a1f0d28"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "1f937cdd1a135bd6e06798bf078c4d24"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "0348068dfd50049d8adb5cbe7f10be06"
  },
  {
    "url": "fr/about/index.html",
    "revision": "a007b4ad58fd61bca34bc87d7b074521"
  },
  {
    "url": "fr/about/license.html",
    "revision": "7c857900a82cfed914fed73f55945f46"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "0c4f887066861086735c0d6f7c8d96bd"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "bc625ad31f64470cf417510ac8f1b14d"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "061ad5427231f82f4ada84f5c56af329"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "be7361267314778e5aa2c0f5389ecd27"
  },
  {
    "url": "fr/index.html",
    "revision": "a8dd82b00204cb3257fd82f738891371"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "75e72f52241f6f8d44c3c4b89a7bde30"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "a0d89d0411a1d713b3ad122b60849c81"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "943c46dd3a4fef41235989c4cf8e0d2d"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "32c373cbbef27b9e7ba0f546546c490a"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "0b971557fcbc057c594cb05d68f803cd"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "4ff91329e7e45c9dca702456b1eb882d"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "bee8289cce928fce50a9139773fed3a2"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "1f2be125bb9b93f487f9747fe6b790ea"
  },
  {
    "url": "gofurther/index.html",
    "revision": "1f5947739a435fa75167b51c2f039135"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "02d85a60443b7567496b1e22b5caf01f"
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
    "revision": "70422d3f939a8c53356c704ff1fb6800"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "5e0155ff9a3e0029dd03c12793082d98"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "bcde0be95b7bb3803460d00f3964d85f"
  },
  {
    "url": "quickstart/features.html",
    "revision": "bbbc21cbc13976765ecd5a829896de71"
  },
  {
    "url": "quickstart/index.html",
    "revision": "d54ec80593da74f55b873afd13b980e5"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "1b08e32344cc2cd0f10f26b0ccb1685f"
  },
  {
    "url": "quickstart/update.html",
    "revision": "adad6f6fc41bd168a88fcfebd6bcb7fd"
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
