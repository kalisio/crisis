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
    "revision": "036911bcf83fe518b0517090ed9074b1"
  },
  {
    "url": "about/contact.html",
    "revision": "31117166412e043397a472e6444800e4"
  },
  {
    "url": "about/contributing.html",
    "revision": "b652ceb336f5c4bf246244978ad05c45"
  },
  {
    "url": "about/index.html",
    "revision": "fa07ab575318d4657d47f426e949ffe6"
  },
  {
    "url": "about/license.html",
    "revision": "48fa8375ef3807ce31027581900abe8b"
  },
  {
    "url": "api/components.html",
    "revision": "51a78c072cf3c6a5c14af8a0ce9deeaa"
  },
  {
    "url": "api/hooks.html",
    "revision": "e4d9f3296a1fd3dc1fe6e514812089e1"
  },
  {
    "url": "api/index.html",
    "revision": "7b02446813aafb78b44ed5174c22ccb2"
  },
  {
    "url": "api/services.html",
    "revision": "b75a530ad33f78e223a424585db29b4e"
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
    "url": "assets/js/10.8327500d.js",
    "revision": "8165aa4cca3c2b98d3daf4c7889cc081"
  },
  {
    "url": "assets/js/11.5413a892.js",
    "revision": "a532bdf6a332eeb1d38382610296351b"
  },
  {
    "url": "assets/js/12.f8455abc.js",
    "revision": "edbf90027722ad71be11a8ae2a4d4a8e"
  },
  {
    "url": "assets/js/13.a7800a9f.js",
    "revision": "9064ce66bfad7abc51a2b924d253741f"
  },
  {
    "url": "assets/js/14.7c367208.js",
    "revision": "7bd90b1b4beaffdf9ec04a0cbfa80c74"
  },
  {
    "url": "assets/js/15.bcc3f86b.js",
    "revision": "a8ba2d53c559ba64d12411a6c330a625"
  },
  {
    "url": "assets/js/16.9b2bf867.js",
    "revision": "2b2cf80643721f103ef7b431c5dac4c5"
  },
  {
    "url": "assets/js/17.96212bef.js",
    "revision": "0c838dd9881c07f1bdd9f9e830335e04"
  },
  {
    "url": "assets/js/18.66f3626a.js",
    "revision": "3b3980e8d1d4c6770167c40fc3be140f"
  },
  {
    "url": "assets/js/19.ffe6f9e5.js",
    "revision": "360e244bc5a3eed50cc5789655974d18"
  },
  {
    "url": "assets/js/2.0e0b1261.js",
    "revision": "9b5008c6c94c0f12498de3affdf412b7"
  },
  {
    "url": "assets/js/20.ea7859db.js",
    "revision": "55335aa1c9ac2e5664d230ea090eacb4"
  },
  {
    "url": "assets/js/21.5d94ff1d.js",
    "revision": "00cd1272557d1e4abfd577386e1cf5f7"
  },
  {
    "url": "assets/js/22.007e8b52.js",
    "revision": "3d54add08621dac90d25b6df0a70dcb5"
  },
  {
    "url": "assets/js/23.47a6b0a5.js",
    "revision": "f62986358daba72f8717702e52ac6714"
  },
  {
    "url": "assets/js/24.b12d0745.js",
    "revision": "e946d38601fb3f21dd6c032edf8de627"
  },
  {
    "url": "assets/js/25.1dba617d.js",
    "revision": "3ae77c2ce1cec6d0c3257953ce7f1bcf"
  },
  {
    "url": "assets/js/26.84b89e36.js",
    "revision": "384b78ae8790bef492eb86aff4ceca70"
  },
  {
    "url": "assets/js/27.6381ef9a.js",
    "revision": "605f0818fa0e1de6a64cdb29c8a8ac9b"
  },
  {
    "url": "assets/js/28.02df5b25.js",
    "revision": "77e3e5bbf68cf112dd0bf6d79cf3ac4e"
  },
  {
    "url": "assets/js/29.df2efd5f.js",
    "revision": "b4005733ebd9fb967306e1026f51368d"
  },
  {
    "url": "assets/js/3.6cbc87d3.js",
    "revision": "29b50795e70deb497bb9f448d0d53848"
  },
  {
    "url": "assets/js/30.86744952.js",
    "revision": "6a0b3b831f91a01b6b04687a8dd80dc3"
  },
  {
    "url": "assets/js/31.92a9069b.js",
    "revision": "2d98ba174c582d44b2b30c517f2b0872"
  },
  {
    "url": "assets/js/32.616ece4c.js",
    "revision": "14410792beafb3a55cac43204b38178e"
  },
  {
    "url": "assets/js/33.c3d4674a.js",
    "revision": "460e1ee393a3f0ec2ca8d1dd7b6681e9"
  },
  {
    "url": "assets/js/34.bbe8dfdf.js",
    "revision": "09184ccc2e6b7647effc9cbef578dd12"
  },
  {
    "url": "assets/js/35.53a5d58f.js",
    "revision": "1cf693d5af2a405ef733d1df9ba12edb"
  },
  {
    "url": "assets/js/36.d9ce89e9.js",
    "revision": "730b42473237d27d2715c35ab2dc3049"
  },
  {
    "url": "assets/js/37.b44fa039.js",
    "revision": "edb88161f1d0f79d775437ff613658e2"
  },
  {
    "url": "assets/js/38.ad312d87.js",
    "revision": "e6e32cec0a66c077661c387dacac7ffb"
  },
  {
    "url": "assets/js/39.1ebe50e0.js",
    "revision": "42ae8aa9f741b7efb13804d68ad25536"
  },
  {
    "url": "assets/js/4.954f455c.js",
    "revision": "bb10bf7396043fcc702efd5d5cf26eb3"
  },
  {
    "url": "assets/js/40.872c7f66.js",
    "revision": "0fd020c78c55f695bc71bb6192648d26"
  },
  {
    "url": "assets/js/41.5851c856.js",
    "revision": "463b1e82dbe29e6d6aae4a5e17d7e35d"
  },
  {
    "url": "assets/js/42.5a4199e5.js",
    "revision": "650ea690982741c66b43ac9be10cca5c"
  },
  {
    "url": "assets/js/43.e73b3559.js",
    "revision": "5df1af5f243245adb76c161914d4db45"
  },
  {
    "url": "assets/js/44.0dfb6cfb.js",
    "revision": "69650984b93bcac9e192456263d47b08"
  },
  {
    "url": "assets/js/45.303fece2.js",
    "revision": "2a3f0494be6207e7d995b86c36b7d6d3"
  },
  {
    "url": "assets/js/46.50179391.js",
    "revision": "c78f3fe8c9dd16a9c0e02b37a0e2c739"
  },
  {
    "url": "assets/js/47.b7f744f3.js",
    "revision": "0f62af206d9a5fc10d3a1cc9e9cafc8a"
  },
  {
    "url": "assets/js/48.f7e9a43c.js",
    "revision": "d1629bb3320d1c6bdf9243bc04a6ec7d"
  },
  {
    "url": "assets/js/49.ccd46e7e.js",
    "revision": "e5f22cae643f98cad0f8d5e02079cdb5"
  },
  {
    "url": "assets/js/5.44d65cf3.js",
    "revision": "ffa49d05e602f5626ca0a04bbc0fdd9a"
  },
  {
    "url": "assets/js/50.38652fe5.js",
    "revision": "2280dd3783bdfb27a79c25e5c0850cf4"
  },
  {
    "url": "assets/js/6.78ec7046.js",
    "revision": "64d912e31548a6f5ca0d71306b06a4c5"
  },
  {
    "url": "assets/js/7.c185a1da.js",
    "revision": "93644cbee3b72061cb3c8b2ceb94b29d"
  },
  {
    "url": "assets/js/8.48e04365.js",
    "revision": "77d5a787c8e0afdbc075143863bfc215"
  },
  {
    "url": "assets/js/9.36a4d876.js",
    "revision": "f08f6d3c4a852fd8b6d44028ad1a3d3d"
  },
  {
    "url": "assets/js/app.77a92fb3.js",
    "revision": "d51f698ca168cdee6030e1956ccf34cd"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "c87532fa43c95c93b970fa56a76209ac"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "7c9b679d329edb089b5dfc8285a0b070"
  },
  {
    "url": "fr/about/index.html",
    "revision": "cd9bc89097704501cc4fa541c481fe7d"
  },
  {
    "url": "fr/about/license.html",
    "revision": "fdd1cc4eb95ca9fdbfb43c1d245f663f"
  },
  {
    "url": "fr/gofurther/alert.html",
    "revision": "f7ab46ce2ec305c0e2cef1af6db92597"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "d481ca36d1ef455b5fe57239c7c5063d"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "1fdcb4cbbf83ba09e8a0b662f0305dec"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "b1d069fad610688fa0dce1665863503c"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "3791f5af9c4db8f1b05d1a155a86e9f8"
  },
  {
    "url": "fr/index.html",
    "revision": "652fa11f5337470f3fd6c09c00491b6c"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "4e186993d0226715ad1af430ea45f0e0"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "1313b3ddb3cd942c788b481cd8032c6f"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "2882e59b2bd5a128175c319e7f2de2ff"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "72d7c5e9172dee35249cf8ad3e26e9ed"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "9ed76e0487765e7e4c14bc26a7ccd954"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "40d146f08737b0f2c5e7dc2c126c468c"
  },
  {
    "url": "gofurther/alert.html",
    "revision": "361cbf1c5316d72645277c3d1a23646e"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "788840b661df2cfc16323283c65e324e"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "716fd8da8789b8387b0332025aaac514"
  },
  {
    "url": "gofurther/index.html",
    "revision": "3aa2e9e790a3cd4cdcefa81fc41ac8df"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "a5fbf2fe595db19058575f64804d5718"
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
    "revision": "e03ead53b9ff12098539da49bfe3d75c"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "761ca34082392e3e4f05ee11ae3bb50e"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "f4fb4e058efb3a1e2cbb3af92d323036"
  },
  {
    "url": "quickstart/features.html",
    "revision": "8ccee062d00fa0c7177bd4da1e5f165f"
  },
  {
    "url": "quickstart/index.html",
    "revision": "c2b4a93b3a6090cb52ed0e0c9ae2de11"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "b8ae906554f31d206eb3b9a8cdc8eb0b"
  },
  {
    "url": "quickstart/update.html",
    "revision": "f8d12801849932d55072b6cb80b72c7d"
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
