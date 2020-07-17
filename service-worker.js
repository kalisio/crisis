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
    "revision": "92b4d9909f4ed86093a7f442f7620ad2"
  },
  {
    "url": "about/contact.html",
    "revision": "27074375622d74302e8cff2bfae39384"
  },
  {
    "url": "about/contributing.html",
    "revision": "52f94b73cc8ded0da688efd0f8b0e4ee"
  },
  {
    "url": "about/index.html",
    "revision": "39c1ac5ac930e8cd09986d1b509c3ef7"
  },
  {
    "url": "about/license.html",
    "revision": "ea7bab4bcb5db6ba24f49f6d43a2d09e"
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
    "url": "assets/js/app.fb1a7ed4.js",
    "revision": "1a67ba04220d2355ee218508409dd04b"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "92e96d650452536329a1aa1437c1efc8"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "0015ac41a4685c043978c465fcb7057e"
  },
  {
    "url": "fr/about/index.html",
    "revision": "3853fb3d379cb16f5a8eb14fc860efd3"
  },
  {
    "url": "fr/about/license.html",
    "revision": "da84042eedddca3ec4dfa99039555e17"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "f8a2d1fe32f77b1d946f3c13938ba28b"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "e02ff5fc7c01f7a7e3436b698c6f7efd"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "05f8ad7bfdd7b7848e47c79683aeb4ef"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "7ea713f9f53a271b0474fcce27f974cf"
  },
  {
    "url": "fr/index.html",
    "revision": "c12ec99663b96dae8c096ed59ace98ec"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "0edac77b96cd157e2dfa2c298e99acad"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "90cdaad13d2f7d4f7a3ebb420fa60126"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "283a31c148ec28d34aa3c5b80f1b45a5"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "4d7ae32f0d292f3e3f129d81678dacf1"
  },
  {
    "url": "fr/quickstart/installation.html",
    "revision": "942dbf45ba188e69a725bb20fbd09067"
  },
  {
    "url": "fr/quickstart/update.html",
    "revision": "868a716aaf6678507c7278ea390a4d9e"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "f72d7a3cfdb0f72418c6423d84990510"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "181b7e66af36c4197fb9dc94c086063d"
  },
  {
    "url": "gofurther/index.html",
    "revision": "b9e56d677a54a5a8717e78182a3cba76"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "99fe3439f89ec9a92c3d765059fa6b02"
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
    "revision": "6082846a9d320a15ba18f6cc2361b4bc"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "4da665bc7d299da3ba50f6312de45ae0"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "9a8d5eef92d851c9244461bcbd74cb2f"
  },
  {
    "url": "quickstart/features.html",
    "revision": "caa89c0f6f0f3d687b9c8f0cf1140c83"
  },
  {
    "url": "quickstart/index.html",
    "revision": "32f6db146dbdab0c98c8567592767f27"
  },
  {
    "url": "quickstart/installation.html",
    "revision": "757144f08747e68095ba1e0538f19c23"
  },
  {
    "url": "quickstart/update.html",
    "revision": "b16623d72bcd9aa77a7ca0243b9b9d45"
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
