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
    "revision": "2e7dc887bfee8dd0e19ac7aeef3c511c"
  },
  {
    "url": "about/contact.html",
    "revision": "aeab64b8dbf499e13ae4ccdadf1ee8e7"
  },
  {
    "url": "about/contributing.html",
    "revision": "0d96401d16da9b3c0b306ec0c99e79ce"
  },
  {
    "url": "about/index.html",
    "revision": "da629be93ed715467e610f051ad2b0db"
  },
  {
    "url": "about/license.html",
    "revision": "751a491a5af4e69d9432af425fc82725"
  },
  {
    "url": "assets/css/0.styles.63401feb.css",
    "revision": "89f6e35f1b665fc46fd71f60fd66533a"
  },
  {
    "url": "assets/img/Account-EN.f04e1bf6.png",
    "revision": "f04e1bf63811807650edb543bd99a181"
  },
  {
    "url": "assets/img/Account-FR.96db1b2f.png",
    "revision": "96db1b2f371b8d6fc8e865025db9b08f"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
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
    "url": "assets/js/10.5df2681c.js",
    "revision": "d83b495734105a9deab8129665d89ca3"
  },
  {
    "url": "assets/js/11.682e941c.js",
    "revision": "7c2e2c4446963cbefb85987ce349b44e"
  },
  {
    "url": "assets/js/12.2b9c9145.js",
    "revision": "468bd12667ddc5495e3d65018b3e47e5"
  },
  {
    "url": "assets/js/13.2df0b80b.js",
    "revision": "0e00299ed0dd46a2e62f8c3494c067d0"
  },
  {
    "url": "assets/js/14.592be645.js",
    "revision": "f2bb891c3f5c60dc4f3d70c3a940b9f1"
  },
  {
    "url": "assets/js/15.c554b65e.js",
    "revision": "228c0a199c3fc7b7f353fab509d327d7"
  },
  {
    "url": "assets/js/16.c4ec84f8.js",
    "revision": "7847399630272285646f7e1ee2e5f587"
  },
  {
    "url": "assets/js/17.02a55daa.js",
    "revision": "8ccb026a9bf535cbda5ca9054ce9d807"
  },
  {
    "url": "assets/js/18.c048f8fe.js",
    "revision": "ad713777a373bdc1eda9b72dd8216cca"
  },
  {
    "url": "assets/js/19.d5f025dc.js",
    "revision": "d4887462f9d6f4b57f522bb97fa8d196"
  },
  {
    "url": "assets/js/2.3cafea57.js",
    "revision": "43380a00f4ce43b6327db5e594c76fd1"
  },
  {
    "url": "assets/js/20.387265b8.js",
    "revision": "2733f20383503ff0b7d9bc25d48ab311"
  },
  {
    "url": "assets/js/21.fd9942d9.js",
    "revision": "09215ed5447e933b79b9db70d6036a08"
  },
  {
    "url": "assets/js/22.ee56ab0a.js",
    "revision": "bb53958d9fff7b2f71cc75789879f923"
  },
  {
    "url": "assets/js/23.bc13e6fa.js",
    "revision": "79f7dcde00894faa3f052befd67e9e69"
  },
  {
    "url": "assets/js/24.91d5fae7.js",
    "revision": "8b87edbe0595b1344733bcb72dd4ad69"
  },
  {
    "url": "assets/js/25.32ae972f.js",
    "revision": "95253e7e2fe5305b5a16074ed3cf0e2f"
  },
  {
    "url": "assets/js/26.df872b45.js",
    "revision": "2b6f4a2cb56c23003fdcf7cdeb9acb9f"
  },
  {
    "url": "assets/js/27.d4fdd7c9.js",
    "revision": "22cfbab653432c2004bdb1c213b80b1c"
  },
  {
    "url": "assets/js/28.0d8ac6c5.js",
    "revision": "06974e930b6d535d7cca816afbb079b6"
  },
  {
    "url": "assets/js/29.2ef886b1.js",
    "revision": "8ff27e9412497e34b06a03506dcbb764"
  },
  {
    "url": "assets/js/3.d059fcc3.js",
    "revision": "00e31c92ccdc3dbfa36642e422c1c5ae"
  },
  {
    "url": "assets/js/30.242e16d6.js",
    "revision": "8944ca88daa6b8883038256661f55ff1"
  },
  {
    "url": "assets/js/31.4deb0df4.js",
    "revision": "e2e88ca01ed031c11fe42db6c9a57610"
  },
  {
    "url": "assets/js/32.62cd34c9.js",
    "revision": "f869e456dab7fd9c94af89fee311fb5a"
  },
  {
    "url": "assets/js/33.f6cb4fd7.js",
    "revision": "ed675a4bf05ca6544db319e4ea92e983"
  },
  {
    "url": "assets/js/34.e17e509b.js",
    "revision": "b7ab99618b5b643d254b6c4cd6d8d1a7"
  },
  {
    "url": "assets/js/35.a85c381e.js",
    "revision": "55ebae09be31d8bd7bd6288bb41b873b"
  },
  {
    "url": "assets/js/4.07b13074.js",
    "revision": "a75d1f86fbd3062dd2a5c0db0488b913"
  },
  {
    "url": "assets/js/5.f6625176.js",
    "revision": "0b6e03df2bc98ac6ae2d28b719b10ad0"
  },
  {
    "url": "assets/js/6.1438739d.js",
    "revision": "d1760e21ee8c1de447cfdfabf1c1857e"
  },
  {
    "url": "assets/js/7.606da3dd.js",
    "revision": "4538a91dca74b3626a86b41cdbe54a07"
  },
  {
    "url": "assets/js/8.d23a0ddf.js",
    "revision": "df4566d9099070bb891b02b568e74d26"
  },
  {
    "url": "assets/js/9.5a487020.js",
    "revision": "929095ff02257923b4e98d3519f82609"
  },
  {
    "url": "assets/js/app.aa78afda.js",
    "revision": "12618426b77e46b9f25c0403f9e00e4f"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "0e72368a87cec8e60d5d3101463548fd"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "bd8cf3542353510b14861c3d98b12de6"
  },
  {
    "url": "fr/about/index.html",
    "revision": "d19b9b900d143663e10ddb33187fa137"
  },
  {
    "url": "fr/about/license.html",
    "revision": "c7a12bb9e34a03985d77a875374c529a"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "8caf1c6d54e9d3c10db2366a0cc4eaf5"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "0cee7aa5401d2d351d7142291edf1d97"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "a341a9fc1c937d5316d662845240b9be"
  },
  {
    "url": "fr/gofurther/processes.html",
    "revision": "07454aa6da17648388b6476c7200c7e6"
  },
  {
    "url": "fr/index.html",
    "revision": "2b1192b90ede38b01200370eba5c366c"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "5207bff08346ccfcf01a15a7d1a3840d"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "4d99faf6080b67544b034b8e0daa08d6"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "93d2d06cc9d2a8492c018c9729eeaac8"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "c071f602a07c365e97722d6cceb94917"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "700f5e6e00ec32761d6766dafd2d9c66"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "6723c539668487ab8681b7ae9060b38d"
  },
  {
    "url": "gofurther/index.html",
    "revision": "371dc6b68c68beb84be2e864860a7351"
  },
  {
    "url": "gofurther/processes.html",
    "revision": "e886e29b3036e4fc9f78b2de522d344a"
  },
  {
    "url": "index.html",
    "revision": "b3386adac12533c4effa24af94900e64"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "f7100a34a05d05cb050f28b6eec28355"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "1825fc473227aa45f3f0ca3a9c4ea7b3"
  },
  {
    "url": "quickstart/features.html",
    "revision": "d37acbfc8116fe82e5e54feb7f18588b"
  },
  {
    "url": "quickstart/index.html",
    "revision": "2fb010ee9d66c16481db774872401106"
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
