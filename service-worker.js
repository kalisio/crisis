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
    "revision": "1ca0c3794b099c516afc5d129c0b965f"
  },
  {
    "url": "about/contact.html",
    "revision": "eab5854af25266c1a4281c1bdf04ab32"
  },
  {
    "url": "about/contributing.html",
    "revision": "dc52b014492c0cbfd0875eec16ab3766"
  },
  {
    "url": "about/index.html",
    "revision": "4d1878663995df8bb0678f614fdedfc7"
  },
  {
    "url": "about/license.html",
    "revision": "459c577d33122f96b678b7b03714dded"
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
    "url": "assets/img/Account-EN.f53e78aa.png",
    "revision": "f53e78aab760de162e33451c93573695"
  },
  {
    "url": "assets/img/Account-FR.9b2a0ecf.png",
    "revision": "9b2a0ecfcd3eed067c584da77a9fdd4e"
  },
  {
    "url": "assets/img/Alert-EN.6b934b78.png",
    "revision": "6b934b783b2235eb40b1888c88a6aaa8"
  },
  {
    "url": "assets/img/Alert-FR.aab2e659.png",
    "revision": "aab2e65912408b7ad61676f0ab6458f6"
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
    "url": "assets/js/10.54a0e6a0.js",
    "revision": "b59ce876b9bdb387cffb094b714c216e"
  },
  {
    "url": "assets/js/11.13b82cd0.js",
    "revision": "a017bfcb8a5fe6c7dff5e7f3dcea80f1"
  },
  {
    "url": "assets/js/12.f87a0954.js",
    "revision": "58b88835ad9ce3c74e0e88da165d2cbd"
  },
  {
    "url": "assets/js/13.a501a0d8.js",
    "revision": "bc24d1ca9ab2da8a6944b7a2243ae5d5"
  },
  {
    "url": "assets/js/14.2fc5f359.js",
    "revision": "886def37d374a9c9a4b33c49a3d89318"
  },
  {
    "url": "assets/js/15.9efcd193.js",
    "revision": "13bf9f8c9078a3f25cfc6815153dae5c"
  },
  {
    "url": "assets/js/16.2dd34bc2.js",
    "revision": "47a4bf6e285ba68f2b0199fdd0e73a8b"
  },
  {
    "url": "assets/js/17.ba7808fe.js",
    "revision": "83362d17787b96903eab5a336ebc3174"
  },
  {
    "url": "assets/js/18.45114c83.js",
    "revision": "860cc5a8a2ce85d84160a6e832fa55d3"
  },
  {
    "url": "assets/js/19.f1bb2bdb.js",
    "revision": "893fd6ee97ef958025ba481567a7b048"
  },
  {
    "url": "assets/js/2.d914f2c7.js",
    "revision": "066b40254566dcc5b93529596cea6208"
  },
  {
    "url": "assets/js/20.461a3a80.js",
    "revision": "44155aeaa4fd08e7e9361f3341cfb3f8"
  },
  {
    "url": "assets/js/21.58d45c88.js",
    "revision": "b9da0a9a5ac77a88c1c6b96a2d6761b1"
  },
  {
    "url": "assets/js/22.fcf41e9a.js",
    "revision": "0e95e54d0e265cf10ca2cb517c0c0406"
  },
  {
    "url": "assets/js/23.d2281eea.js",
    "revision": "0bf0371733f2988fe26504fedfa9e007"
  },
  {
    "url": "assets/js/24.05d8331d.js",
    "revision": "4ab64219c937aafa6c3a3ad02be5f632"
  },
  {
    "url": "assets/js/25.aa19af6e.js",
    "revision": "b82156c6f5a662d7c5d61e2ff1e6ea6f"
  },
  {
    "url": "assets/js/26.d1875247.js",
    "revision": "f568ec43c6f935c6132dff8cf287a04a"
  },
  {
    "url": "assets/js/27.de8bcaff.js",
    "revision": "f4eae8baaa5bbd3b64f9344353b7a854"
  },
  {
    "url": "assets/js/28.13d49f44.js",
    "revision": "a7b59f354a0be556d3fd02323886c59f"
  },
  {
    "url": "assets/js/29.9ea9fcf0.js",
    "revision": "434eb12a448e02e05ec2cad92d3ecf03"
  },
  {
    "url": "assets/js/3.abe7a753.js",
    "revision": "a5421153e9988d2e9309ec1b04a5a957"
  },
  {
    "url": "assets/js/30.1ffcc46c.js",
    "revision": "e37ad5de8a36aad6909a7785f09e6dbd"
  },
  {
    "url": "assets/js/31.1caccfb3.js",
    "revision": "464e3478be451f023265e71328f8a560"
  },
  {
    "url": "assets/js/32.cf3832ba.js",
    "revision": "9edfb75d60a973cb6944112128192850"
  },
  {
    "url": "assets/js/33.4310f8b4.js",
    "revision": "27245cc6ae7e4bb7dfbed63b8244416c"
  },
  {
    "url": "assets/js/34.1fb82c61.js",
    "revision": "fce2c3c53b7a9aa30a25f80aa35848c6"
  },
  {
    "url": "assets/js/35.bc873909.js",
    "revision": "475ce1590be619f2afe0de4e21595a4f"
  },
  {
    "url": "assets/js/36.7d59861b.js",
    "revision": "fff8f2208990bbbc5f994e325e44c0aa"
  },
  {
    "url": "assets/js/37.6039c3e7.js",
    "revision": "f1b827129b2825e4f20dd8f8d0f2f7c0"
  },
  {
    "url": "assets/js/38.9165f62b.js",
    "revision": "1ea3957f93de10f71c4b172388d25b50"
  },
  {
    "url": "assets/js/39.dc449fe3.js",
    "revision": "f8de76b11933251ac40b0283fe89bf75"
  },
  {
    "url": "assets/js/4.9b5e355c.js",
    "revision": "8a4999173cbc39d5865eefad07445f12"
  },
  {
    "url": "assets/js/40.4f38931c.js",
    "revision": "dd292d9cb105203dd4c49310e6ca4cf9"
  },
  {
    "url": "assets/js/41.9afa8357.js",
    "revision": "58d38d55da6d2b37a4f045967e559b4e"
  },
  {
    "url": "assets/js/42.453259f1.js",
    "revision": "fb463e41c5fc6cee0edd4babd240f44f"
  },
  {
    "url": "assets/js/43.cf408a74.js",
    "revision": "b14b39dfd6c161a2baae35fe77c28fef"
  },
  {
    "url": "assets/js/44.d04568e6.js",
    "revision": "b532c605a8b15a8caa23d634325b5a4e"
  },
  {
    "url": "assets/js/45.a7e8c3dc.js",
    "revision": "f787e0b8f023a8b90096e4ab89e1122f"
  },
  {
    "url": "assets/js/46.e84db234.js",
    "revision": "68fab9c7f9c09298d6d1a498424c7214"
  },
  {
    "url": "assets/js/5.6aca1cbe.js",
    "revision": "b5ce2c1dda3a5d39d7136c81f7d95bbb"
  },
  {
    "url": "assets/js/6.4da383c0.js",
    "revision": "74f424b015247f4762a750d885a259e6"
  },
  {
    "url": "assets/js/7.6324e845.js",
    "revision": "231e6483e2be5b4d8ba8b76f06a306af"
  },
  {
    "url": "assets/js/8.3eab658e.js",
    "revision": "89799ef0759e1fa57aa63fba4ec0e7df"
  },
  {
    "url": "assets/js/9.eb090f72.js",
    "revision": "004942ef51b5d59d3a2ec44959bd2cd5"
  },
  {
    "url": "assets/js/app.ea613860.js",
    "revision": "7816ac07b9c3500e28a33bd600374140"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "a71ecacee6c73bba0e2f365bae01d294"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "89be9df17b2393746ab07726fcee6cef"
  },
  {
    "url": "fr/about/index.html",
    "revision": "faa7f05b20340b4a6d80f5ea08c6a4be"
  },
  {
    "url": "fr/about/license.html",
    "revision": "7865df6b9a4524365a174ba0365bc61a"
  },
  {
    "url": "fr/gofurther/alert.html",
    "revision": "08ac57161191c5ebbf812ef3be69b729"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "02e0e997e0a887737c3cfd6c47427d6d"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "2312bede8841b6abc6215e25883f0d72"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "9ba23d77cb438fb063345054d76292b7"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "ec53f52da98501a8fa7270c140e332b5"
  },
  {
    "url": "fr/index.html",
    "revision": "13568ba53ed231b167060d7ec08166e6"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "80d2139a2a63c5aa451bfba8d3065741"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "1d3ded41143fa16338a2d88fe2acd001"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "eaba9692c2ad5d2b7e36e1d03c5e80bc"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "b6124a2bf10d4dc19524ba5d4445a6b8"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "d5bcee3afe75169668583b8313e546b5"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "b8b1db534e9257d1cc2434a7fb791297"
  },
  {
    "url": "gofurther/alert.html",
    "revision": "353cede175bcc6711103ef5dbb0ed634"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "4fd959f79f76e830d1000ac9a1c84455"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "5390f77136ba80078b043b4131b41c83"
  },
  {
    "url": "gofurther/index.html",
    "revision": "f7ef47d9badaaf5deea015a01c27b3de"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "6962e5e1ba8d75bcbc84291240f4d483"
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
    "revision": "6817235eedae655925d5957953608864"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "9105424706fd9354a2390a181e83ed33"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "bcd3bcb9c2012a7fb3c7c0c39d668dbb"
  },
  {
    "url": "quickstart/features.html",
    "revision": "1ff0d7e29e1a4d8d76d1e473e4304a07"
  },
  {
    "url": "quickstart/index.html",
    "revision": "b76d32d459908970fd8aceb65c5bda30"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "721a3a0724db70065b5084d4f9d5fa99"
  },
  {
    "url": "quickstart/update.html",
    "revision": "0a6323b840532eebb76a5b410d980603"
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
