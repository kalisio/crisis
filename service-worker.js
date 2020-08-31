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
    "revision": "94caf106b27a84a50c551bf5e69702ea"
  },
  {
    "url": "about/contact.html",
    "revision": "cfa71cbb74dcc771d4d70e4ae96a5258"
  },
  {
    "url": "about/contributing.html",
    "revision": "2bf4a5d0d7b3a3a32633444a52d33ca6"
  },
  {
    "url": "about/index.html",
    "revision": "c2fe5c71d91dd4aa7ae53a54e4940a0f"
  },
  {
    "url": "about/license.html",
    "revision": "6eb815e23f523dfb5f2a5d5e21234a2b"
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
    "url": "assets/js/10.d78ea88e.js",
    "revision": "8305dbfabf796f18ce8dd79942caa3e0"
  },
  {
    "url": "assets/js/11.0d05573f.js",
    "revision": "2eed7a7cf212ed2eae68ff922f36ba1c"
  },
  {
    "url": "assets/js/12.249e7273.js",
    "revision": "b8f47ebf68f6c8f0181d8c8415cb2024"
  },
  {
    "url": "assets/js/13.2e11a497.js",
    "revision": "9372c6bb4ba6c6a96840d0aec36aad74"
  },
  {
    "url": "assets/js/14.a462731f.js",
    "revision": "d4edf538d265fbab188c75d66af4b2b8"
  },
  {
    "url": "assets/js/15.fdf69e69.js",
    "revision": "3c6a37ce781dea2a891ab32b87703ba8"
  },
  {
    "url": "assets/js/16.c585fa30.js",
    "revision": "225e954002a7a4866a45b09a4b29d06a"
  },
  {
    "url": "assets/js/17.bbca8727.js",
    "revision": "991fd7a9ee5a530ac58b6fe38d5b1be2"
  },
  {
    "url": "assets/js/18.428f0c60.js",
    "revision": "64f6bc54548544ab292abf8848414339"
  },
  {
    "url": "assets/js/19.6bd42657.js",
    "revision": "0512c7714744e821e35cdb5b7bc5c9df"
  },
  {
    "url": "assets/js/2.1ceb8eba.js",
    "revision": "dc3442bd9ffe8ccf09143177eec8605e"
  },
  {
    "url": "assets/js/20.c466807e.js",
    "revision": "00888f0ee03529a61bdbed465fa6ea09"
  },
  {
    "url": "assets/js/21.a51a49ba.js",
    "revision": "8c14f0e5ab25a09e370dc9f81da1c125"
  },
  {
    "url": "assets/js/22.ad5f525c.js",
    "revision": "899876252f05401e522865b4904a38a3"
  },
  {
    "url": "assets/js/23.fa9aa98d.js",
    "revision": "ecbb88bc45b7e369cd23c0c2c9e612ca"
  },
  {
    "url": "assets/js/24.28cb7bf7.js",
    "revision": "74332d4f61caf87fbe24bc9e3cf9b829"
  },
  {
    "url": "assets/js/25.f9212df5.js",
    "revision": "f606984a14232e47f1a16930960a974b"
  },
  {
    "url": "assets/js/26.f139f0a1.js",
    "revision": "3016f1c99b9fd46effe8588ba09fe221"
  },
  {
    "url": "assets/js/27.faf77e6a.js",
    "revision": "6184c5ee00828df5f60bd0a804f751c7"
  },
  {
    "url": "assets/js/28.09879021.js",
    "revision": "f1e2a47676da6b218e08f0dc0eea6711"
  },
  {
    "url": "assets/js/29.7056b449.js",
    "revision": "9b772b228d7c7a7068413c09e20e3246"
  },
  {
    "url": "assets/js/3.cb7da1dd.js",
    "revision": "af11437436ccc14ac5b3f485421482b2"
  },
  {
    "url": "assets/js/30.e926d533.js",
    "revision": "628bd3f7b6ed9dd938d9006ace55ce39"
  },
  {
    "url": "assets/js/31.ee32e987.js",
    "revision": "8343faa34289a370c8ad3ad39e595240"
  },
  {
    "url": "assets/js/32.2338abe7.js",
    "revision": "7fa2ac7494bc810a10241090a8456bcf"
  },
  {
    "url": "assets/js/33.296a27ee.js",
    "revision": "8a69f00d406ccb67a0f4152c0b838f72"
  },
  {
    "url": "assets/js/34.f306744d.js",
    "revision": "56c8bb77e563af06922c9de2fbcdf58a"
  },
  {
    "url": "assets/js/35.2eab1f54.js",
    "revision": "8faa12c0c500ddce10ebbe66849336a4"
  },
  {
    "url": "assets/js/36.9e971bb4.js",
    "revision": "a26301a9969915e19b7c54729187806a"
  },
  {
    "url": "assets/js/37.05bcce2f.js",
    "revision": "7d65b26a19ec9d90ef956b5bdec5f7e1"
  },
  {
    "url": "assets/js/38.410a911c.js",
    "revision": "1153c2e6824c85f37ccaf16535077731"
  },
  {
    "url": "assets/js/39.2e6f11f8.js",
    "revision": "f5e999d347f849004bd58003fc81f460"
  },
  {
    "url": "assets/js/4.f9e73eee.js",
    "revision": "ff3dfac7a16cad9eb734431e18595791"
  },
  {
    "url": "assets/js/40.d7382aa9.js",
    "revision": "17c6d8d1686687d24d6c1754d437b8ea"
  },
  {
    "url": "assets/js/41.80fd2f07.js",
    "revision": "5a5a580091dd60ef3984552ff56c905b"
  },
  {
    "url": "assets/js/5.b2264029.js",
    "revision": "5f31ca34ee4ab943ecca453dd7b04e19"
  },
  {
    "url": "assets/js/6.3c9de4be.js",
    "revision": "db2ef02a55d733eb2a348c8c5cdff4c1"
  },
  {
    "url": "assets/js/7.7f76a0c7.js",
    "revision": "89fd47d53b47965310aec7db62009c37"
  },
  {
    "url": "assets/js/8.b0c0956d.js",
    "revision": "27466f3fbee3a1009b0e1b50172caa00"
  },
  {
    "url": "assets/js/9.1047b096.js",
    "revision": "5b931c1168afe71d195b218e924f1124"
  },
  {
    "url": "assets/js/app.a5c92d39.js",
    "revision": "1103a1c7e8c35b01c69e02e00e4c6f10"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "82e38d9ce2c0d5651a2df24769d70e2f"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "495b7595ae65dc3c1b611ba2b61661aa"
  },
  {
    "url": "fr/about/index.html",
    "revision": "bf07ec55a38c0fac3ede6101c2997df7"
  },
  {
    "url": "fr/about/license.html",
    "revision": "eac7d5a26e01762795e89a24c24711ea"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "d3fa35e0eda700e6509f23dbedc4e360"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "0f5589d6b3cec5d5d1b4303cd84bd76c"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "72db6a5d42208315c78aced58c827fbf"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "73027896db132d707adc37b7642ba285"
  },
  {
    "url": "fr/index.html",
    "revision": "4d2944f60e2678ffe326289c71389741"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "ee2ef661e9ebe23bef1fd96b371d3726"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "bdfff182d2771a53861b7dcb29d3788f"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "156679894d61367f084c57642266eee7"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "2b046cdbdffe9f67983facea5eca3100"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "615e94dc979e20492138c5b7e3d6b551"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "94815bd9d7cf0999b9061e8c83ace83e"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "990ac9c5043d6266d73652dc451bf406"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "ce8c411ee5fb6c198e307c60e013e775"
  },
  {
    "url": "gofurther/index.html",
    "revision": "bbcc0ac8f52a92cef6106ce238a13f50"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "fbf691cf2f74217739ad9b83cfb85806"
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
    "revision": "18b841b1191d68c13e87c49af5a7aaeb"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "5796bbdbc36258bb361fa5afc97e8a6e"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "68e97bc318b82837d83311f0f01cc1b3"
  },
  {
    "url": "quickstart/features.html",
    "revision": "90e157bc5c95308a084d4578e99c51fc"
  },
  {
    "url": "quickstart/index.html",
    "revision": "173d0aaa10297869e148c07e58e5308e"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "eaa26f803976bbfb1936d40fec2bb87f"
  },
  {
    "url": "quickstart/update.html",
    "revision": "ef1518ab6699dad71524e05dc46f28cd"
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
