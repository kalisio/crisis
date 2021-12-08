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
    "revision": "f16253df967d42381c414b051ee0ff36"
  },
  {
    "url": "about/contact.html",
    "revision": "2a27c6006573d53c222731ec120c02bb"
  },
  {
    "url": "about/contributing.html",
    "revision": "47d6db5a0b923d75afae0820e99c027d"
  },
  {
    "url": "about/index.html",
    "revision": "8035b6d3a0ee9c05bb3dc8997e3a3980"
  },
  {
    "url": "about/license.html",
    "revision": "7a09e29476736e34b1aa48c814f4c5ba"
  },
  {
    "url": "api/components.html",
    "revision": "b7bb427782917bb80af38e6c326f0abe"
  },
  {
    "url": "api/hooks.html",
    "revision": "1b3d8c5ff0e0b6a32841155fd68cc7da"
  },
  {
    "url": "api/index.html",
    "revision": "37e9c8552bdf80428658990542ddb945"
  },
  {
    "url": "api/services.html",
    "revision": "d4bb8275494d3de22ac29c02689767b2"
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
    "url": "assets/js/10.b8bdabe2.js",
    "revision": "c44f2d90bd84f6f88c0f22f7df6a4737"
  },
  {
    "url": "assets/js/11.4b8a842e.js",
    "revision": "cd1bef1e590a40e8d1ac752bf042a1f7"
  },
  {
    "url": "assets/js/12.88520ec6.js",
    "revision": "91d4f7dce425484bee1a0ea6eb3bb85c"
  },
  {
    "url": "assets/js/13.baf8012c.js",
    "revision": "d6617d1017d83fdc71a41cd81e782268"
  },
  {
    "url": "assets/js/14.cf73751a.js",
    "revision": "26ad94ddac3471c42ac697c00ddc2e7d"
  },
  {
    "url": "assets/js/15.5f0e35ed.js",
    "revision": "5488b2310648b0fbb729e2649b0e8e67"
  },
  {
    "url": "assets/js/16.12608c64.js",
    "revision": "7376c706e61180b539276feff928a8f8"
  },
  {
    "url": "assets/js/17.9e014b8b.js",
    "revision": "8d05c616f7de0eadb2b4c6c705e20f3f"
  },
  {
    "url": "assets/js/18.2e27c752.js",
    "revision": "77c811df77398423e865f90776805832"
  },
  {
    "url": "assets/js/19.d15fd169.js",
    "revision": "6e0383b711da157e12888fd61d414ba0"
  },
  {
    "url": "assets/js/2.9730c007.js",
    "revision": "9a6971e72d90eb2334f8aae88844a4cc"
  },
  {
    "url": "assets/js/20.5460f9e9.js",
    "revision": "70a7c8d135311666d8432b1817766df8"
  },
  {
    "url": "assets/js/21.7499c5e5.js",
    "revision": "fa53ea99227219993778a61dbdc1f663"
  },
  {
    "url": "assets/js/22.2478ed99.js",
    "revision": "bb13c16c82222ecbf2bf3b0f24154a88"
  },
  {
    "url": "assets/js/23.796d8bcb.js",
    "revision": "d91f3056d82902ba9edce8ff0a1f00b0"
  },
  {
    "url": "assets/js/24.57884460.js",
    "revision": "baf426a57da9fc58bf0d041f86d335bf"
  },
  {
    "url": "assets/js/25.917279a4.js",
    "revision": "79a14e190d0b61dea27271c5fd1b873d"
  },
  {
    "url": "assets/js/26.84c9bfdf.js",
    "revision": "025b244ba26c468b5e0d59fabc5356b6"
  },
  {
    "url": "assets/js/27.b03dab79.js",
    "revision": "3aebecada1b94b24e66c04c362873e4e"
  },
  {
    "url": "assets/js/28.5051ad35.js",
    "revision": "e47407e566d91318d4b23790c6fbad75"
  },
  {
    "url": "assets/js/29.65fbb531.js",
    "revision": "d0f2e2e6c70c9486852887259accfd18"
  },
  {
    "url": "assets/js/3.3476d46e.js",
    "revision": "80deefbf831745906fd59deada8a94a1"
  },
  {
    "url": "assets/js/30.bfafe867.js",
    "revision": "e32b93c1baf6993b94b13ff9b8085d5b"
  },
  {
    "url": "assets/js/31.8ec42de9.js",
    "revision": "7435d25dfeb3ca9da8d9b693b861d884"
  },
  {
    "url": "assets/js/32.88c727e5.js",
    "revision": "0a00cb02f18166f783564d095492ec19"
  },
  {
    "url": "assets/js/33.d0baaaa4.js",
    "revision": "912cbe8e878bd6f66a47d11b2e827472"
  },
  {
    "url": "assets/js/34.2f863625.js",
    "revision": "483098742c0ce4866be85bdec9608b55"
  },
  {
    "url": "assets/js/35.55299a94.js",
    "revision": "74570b3d057f1df7f2cafcef922955c6"
  },
  {
    "url": "assets/js/36.e0385211.js",
    "revision": "7700fdad902b8fd7e4eae3924aaf1f69"
  },
  {
    "url": "assets/js/37.ca7c0e86.js",
    "revision": "2f66a2126c84e933059014c3c2d33c23"
  },
  {
    "url": "assets/js/38.ec7c0d4f.js",
    "revision": "0d2fc2346efbf0ea3467ee48a0cabede"
  },
  {
    "url": "assets/js/39.81ef676e.js",
    "revision": "7b4c54e70d69a784f434a98c006cabad"
  },
  {
    "url": "assets/js/4.9a4f2586.js",
    "revision": "125c0225e2f23691f9a61b5fc93ed119"
  },
  {
    "url": "assets/js/40.538df7d8.js",
    "revision": "f0c8770a0abe0c8d8cf2e3fd98a2f581"
  },
  {
    "url": "assets/js/41.0b90e7bf.js",
    "revision": "22771a4c3a228fa316897bf379c1d975"
  },
  {
    "url": "assets/js/42.9d3a6812.js",
    "revision": "6e98fc7f29317cc8bc3ba439e610d8f3"
  },
  {
    "url": "assets/js/43.08bda98e.js",
    "revision": "4cc5a0c2eeeaad57ddc96fbfd3e662cd"
  },
  {
    "url": "assets/js/44.4b6e37f3.js",
    "revision": "c2395fdd2948586cddee34005010bde6"
  },
  {
    "url": "assets/js/45.a47244a8.js",
    "revision": "6f715a30a482c5cf986e9226011a0996"
  },
  {
    "url": "assets/js/46.35ba1dac.js",
    "revision": "a736d7803b8b94acbab2d55f0cf65dd6"
  },
  {
    "url": "assets/js/47.2a9f7b07.js",
    "revision": "01986f435fba6825b6815b6ea46986a8"
  },
  {
    "url": "assets/js/48.5d505614.js",
    "revision": "de81dadf117543fee54ef14a905671be"
  },
  {
    "url": "assets/js/49.0ca99aa2.js",
    "revision": "22a8e2b942caedaf6a4d0626afb05b91"
  },
  {
    "url": "assets/js/5.eb3c147c.js",
    "revision": "7737fbc5507f41880f9b24bf8bde752a"
  },
  {
    "url": "assets/js/50.fb75b914.js",
    "revision": "811ddb80d05ac3b8f8dbaf8f1e685402"
  },
  {
    "url": "assets/js/51.b02bf658.js",
    "revision": "0aa58db3a0236e2ff9410dfb9c1f2650"
  },
  {
    "url": "assets/js/52.9fb2f71a.js",
    "revision": "82acc6e0c2e332f639f7be21698f4d37"
  },
  {
    "url": "assets/js/53.1b3c17bc.js",
    "revision": "9bd85d1459a28bff9e61bae59607eb51"
  },
  {
    "url": "assets/js/54.abb623f6.js",
    "revision": "5990089d339153d11aea42f527d274cd"
  },
  {
    "url": "assets/js/6.2effa0dc.js",
    "revision": "5fa9bd9f3ad0e175e04d0e96b42f8427"
  },
  {
    "url": "assets/js/7.510c46a3.js",
    "revision": "8624137d519c169d93db2051fb7c4334"
  },
  {
    "url": "assets/js/8.a29f28e3.js",
    "revision": "ac2ab013e9ab7bd1d58a2dc8d2dae4e8"
  },
  {
    "url": "assets/js/9.01500eed.js",
    "revision": "8838376a64034ce356a21c108bed1806"
  },
  {
    "url": "assets/js/app.d7d39731.js",
    "revision": "786b92a611f07207d21f4c4e7914df55"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "e80a7d8facf8628069bd814d41238990"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "63dc9b76cc32dd270d4288ad6c35a05c"
  },
  {
    "url": "fr/about/index.html",
    "revision": "43a2f52e8cae3235142c1c3c145ee6f2"
  },
  {
    "url": "fr/about/license.html",
    "revision": "a2f7278a3638aa793adc4a9fd16162da"
  },
  {
    "url": "fr/gofurther/alert.html",
    "revision": "1c99628be91a9ca80d3eaf4315e4c29c"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "d72cde6ed2a8f49dde4401903a61ea8e"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "832d063c56b94d717180921e387ba314"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "5f1d4e15bc01439316db757598d04453"
  },
  {
    "url": "fr/gofurther/plan.html",
    "revision": "baf5164ef90ed7dfb741465f0a011e8d"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "e4e80a1472c8ba01f700ec2cadc78fd2"
  },
  {
    "url": "fr/index.html",
    "revision": "75541c528de119042a56bf8ae2092eec"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "9f512166f812458ae69cc0efe8952d6a"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "f8d350f9d36803679fb70490acb11121"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "fac2aa5a43487b4203adee9ea12c1420"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "27ed0777fc007871b3cf754214423738"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "933510eb5bc76acefeb9daa77c19c6ba"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "90e23fe1c3c01e0d362bcb1c4592c04a"
  },
  {
    "url": "fr/tutorials/index.html",
    "revision": "a36b7ec6de6209b961078624190343cc"
  },
  {
    "url": "gofurther/alert.html",
    "revision": "664c83a933ba4051c1c1ed0056dfc03f"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "24b44ddaae8fd8f10c0ceb28f5af07ab"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "4d80ba7a86eae311ab21b015f4b42431"
  },
  {
    "url": "gofurther/index.html",
    "revision": "f76f0c16c420b2b59b3195c06588eff9"
  },
  {
    "url": "gofurther/plan.html",
    "revision": "ad28a02c91400d9d799ee2f6dcc7fbfa"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "802ea6a29a20993c914d5b171d73b7ec"
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
    "revision": "f707bece2690ed91d0aa326b3c206788"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "450d01b8fe06ba37a0d93818b618365c"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "9e6b67b45d870410ca6cf1d12a1fae3b"
  },
  {
    "url": "quickstart/features.html",
    "revision": "6566e6ccdb0547142861f34135640e64"
  },
  {
    "url": "quickstart/index.html",
    "revision": "20a45abce6d46f2e5b4aecca21472b85"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "b5a708cfd827d36de7e4ef5b24e9da41"
  },
  {
    "url": "quickstart/update.html",
    "revision": "6ef464515270d882ac5d211bb4c46a15"
  },
  {
    "url": "tutorials/index.html",
    "revision": "8282791abbaf1d70e128615fac31375d"
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
