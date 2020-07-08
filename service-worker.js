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
    "revision": "21ff69ea624065b37648f816884bba81"
  },
  {
    "url": "about/contact.html",
    "revision": "631aa22cec0bef5b885674b7b51250cb"
  },
  {
    "url": "about/contributing.html",
    "revision": "0fa83e6010ff29597265d7c428aacd1f"
  },
  {
    "url": "about/index.html",
    "revision": "a7f2917231c38d95e6ed8ebb443988d0"
  },
  {
    "url": "about/license.html",
    "revision": "ff22dd5edda60896af5c3853e7f68580"
  },
  {
    "url": "assets/css/0.styles.63401feb.css",
    "revision": "89f6e35f1b665fc46fd71f60fd66533a"
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
    "url": "assets/js/16.d8c32f55.js",
    "revision": "e0b093a24df7b1f74ea2e872197317e1"
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
    "url": "assets/js/4.dcf9dc79.js",
    "revision": "66da84d281ab864ea9ed356085f5459f"
  },
  {
    "url": "assets/js/5.d6bf9b89.js",
    "revision": "2f0e2a2595b67d710bdc40464bf90a33"
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
    "url": "assets/js/app.ce296f91.js",
    "revision": "d308d7254ffb3d90cca4282fccad970f"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "30ff592de6b50fd7b1c40bb11654899e"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "a4499fa59c54c4413cb43616b2d9f4fc"
  },
  {
    "url": "fr/about/index.html",
    "revision": "b678a28588fe203f4515813b969f781f"
  },
  {
    "url": "fr/about/license.html",
    "revision": "791facdc56fbd57119719e385cc7dbb6"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "8984d2c0e2b3bb768fdf5e3e276a26c8"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "9a4aea8fddc99a1b5a422c3679a0e29f"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "9b2cffee627902a5f3fe25fb768fc138"
  },
  {
    "url": "fr/gofurther/processes.html",
    "revision": "b221a3c2cd01465a7fc9f11bf2eaed7a"
  },
  {
    "url": "fr/index.html",
    "revision": "4cb7e04fe722ab54233f091522c09b72"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "0f6f9e75b6525d8b5a946b549c240955"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "d1ab874ef2a09ef09ec677d24f1fd066"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "567cb4794a13b149cdcdbc31986b2602"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "0eabdd0125de544742159f1352ad2b20"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "3eb79766be5dc7e03e49b25f2f8abc51"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "c5e756409080eaf4a0cb3fe9fd48cd04"
  },
  {
    "url": "gofurther/index.html",
    "revision": "ea18200c05e4d5e796ce5cc5d2127857"
  },
  {
    "url": "gofurther/processes.html",
    "revision": "3baf313e9a2fd0e50c1d01a5ca1bed45"
  },
  {
    "url": "index.html",
    "revision": "5d90815f3047c6cf5642960109a1c180"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "93a5f986a94837764d37fa5ac51549b2"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "86fb3ad9e026838c47bf0a22cad20142"
  },
  {
    "url": "quickstart/features.html",
    "revision": "608d3427effaa76d5faf6d4235cf7686"
  },
  {
    "url": "quickstart/index.html",
    "revision": "7a6361560aeeb0774747477278582490"
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
