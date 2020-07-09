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
    "revision": "7223ec15b1e2d1c35431a26184e9a1ea"
  },
  {
    "url": "about/contact.html",
    "revision": "69392bb0cdf7542b6c563962af6627b8"
  },
  {
    "url": "about/contributing.html",
    "revision": "a58ecfc2e65c5b842c69bbad37f15f77"
  },
  {
    "url": "about/index.html",
    "revision": "51113b6540174988004781f3967b0281"
  },
  {
    "url": "about/license.html",
    "revision": "f2639b325028ffd9a0aa0896992040af"
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
    "url": "assets/js/10.d8e0155a.js",
    "revision": "f1f0a9a7366d4abe08c06ad2485ee5e1"
  },
  {
    "url": "assets/js/11.90aba367.js",
    "revision": "13479c326615e4f80f4fab71e7252f56"
  },
  {
    "url": "assets/js/12.392cada4.js",
    "revision": "c39d4c360166ac10da4eb59c11464438"
  },
  {
    "url": "assets/js/13.114c89f3.js",
    "revision": "8f605e0079f606fd9fd179c3436d2363"
  },
  {
    "url": "assets/js/14.1ebc47b4.js",
    "revision": "0732a5f30c766fde99d2f2fac108237d"
  },
  {
    "url": "assets/js/15.21afa002.js",
    "revision": "bd713e73456b93a49d8f1a1c916bb9d2"
  },
  {
    "url": "assets/js/16.cc7a280b.js",
    "revision": "0af3640f7f033e0345ca0b4c74451603"
  },
  {
    "url": "assets/js/17.052a8bd8.js",
    "revision": "67e7f11a85a6769e125b1f980d23cb02"
  },
  {
    "url": "assets/js/18.bf4c8250.js",
    "revision": "e54dc27d09af6c18aa059d39d835670b"
  },
  {
    "url": "assets/js/19.3a4498fe.js",
    "revision": "058262a6a4b25f4b9c58ae49f65110ce"
  },
  {
    "url": "assets/js/2.5c980080.js",
    "revision": "9a4e9c749502d352d7f6d4534b9f73c0"
  },
  {
    "url": "assets/js/20.d1d50cdb.js",
    "revision": "790e6fea6cfc6ac3193fa10cdd38d360"
  },
  {
    "url": "assets/js/21.0885c1ea.js",
    "revision": "6d7b9729e612185b2c100d91690e4cd6"
  },
  {
    "url": "assets/js/22.7d0ad016.js",
    "revision": "9c751bde14d8b3f9bb09e1f0f5623fa8"
  },
  {
    "url": "assets/js/23.c1fa2b3f.js",
    "revision": "0f4da9ad68ff4a345928bdb61da3838d"
  },
  {
    "url": "assets/js/24.27a4e7b8.js",
    "revision": "4f6e04db47a5a353c156d3164c44c18a"
  },
  {
    "url": "assets/js/25.922e99c0.js",
    "revision": "dab5a64e73e4d102db21475d9b0611aa"
  },
  {
    "url": "assets/js/26.acaaebe7.js",
    "revision": "8d0b51cf3e0e89985b0ae9f3f6e89060"
  },
  {
    "url": "assets/js/27.3e1fe1db.js",
    "revision": "b9564af58ffec1390a7f8324f4ef9c16"
  },
  {
    "url": "assets/js/28.97f88f9e.js",
    "revision": "886c71d372142e02ec78f94284d7fdef"
  },
  {
    "url": "assets/js/29.72b5e5ca.js",
    "revision": "3bed54fe9e5e3c06abba5fcf7c1e004f"
  },
  {
    "url": "assets/js/3.656a6e40.js",
    "revision": "7765d5c058aa4577c227e94a1febe219"
  },
  {
    "url": "assets/js/30.6e5dbf2e.js",
    "revision": "2efa33b4efdb69a159545da1acc3127b"
  },
  {
    "url": "assets/js/31.6b52d8af.js",
    "revision": "66a4cfd969a087a30f467ff427c828c8"
  },
  {
    "url": "assets/js/32.9e40ff37.js",
    "revision": "f967af87c9e2d6705db7895ea4f78aa7"
  },
  {
    "url": "assets/js/33.b48efe45.js",
    "revision": "eb414cb4862289de8047c2913a0e35cf"
  },
  {
    "url": "assets/js/34.06480e20.js",
    "revision": "61aea1f8669d793eefe932e95084ff63"
  },
  {
    "url": "assets/js/35.a85c381e.js",
    "revision": "55ebae09be31d8bd7bd6288bb41b873b"
  },
  {
    "url": "assets/js/4.7e94b453.js",
    "revision": "20229b9ad7ee8947b5f98c44854ecb95"
  },
  {
    "url": "assets/js/5.4b14be20.js",
    "revision": "a8c4a718b2ef2b27e9e22e35a23efa9e"
  },
  {
    "url": "assets/js/6.209ae385.js",
    "revision": "7a74643210e34109bea5499007656c24"
  },
  {
    "url": "assets/js/7.e1c03a65.js",
    "revision": "cb719ed842ae0d3f57517bd54d3704b2"
  },
  {
    "url": "assets/js/8.476cb34f.js",
    "revision": "87b2e0de62a9efd0f05809cbd9f044ea"
  },
  {
    "url": "assets/js/9.f1e15ee2.js",
    "revision": "dcb3d77f63590a1eb6ab07cc39667c9b"
  },
  {
    "url": "assets/js/app.f914a92a.js",
    "revision": "234e1870913c4639131efd842fd6f1c6"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "364ea61c5b95ede4c0556d9823167f8c"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "309c463f844a0be7204bf1690814d921"
  },
  {
    "url": "fr/about/index.html",
    "revision": "33c06ae4ab3b9e3d35c531c94986a91f"
  },
  {
    "url": "fr/about/license.html",
    "revision": "dc7924f709da46c56e0fdc9126b8c860"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "c7b5b068b3d13bc1881cb459d11ee5b5"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "e8b577d2b2b74e68dbdc61b875ba820a"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "133e5edbc52d373ab7842b164bd8ceb7"
  },
  {
    "url": "fr/gofurther/workflow.html",
    "revision": "f93bed8f88247ae2be0f9e5fcb2e72f5"
  },
  {
    "url": "fr/index.html",
    "revision": "9e7e2071115de5cef8f738cc71e13a57"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "6db0edf80d5adbd4f57b6ea412e68830"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "3a551a8ca245581ca98f3515b59a38e5"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "c8a06ef378c391e11ce3611cdc564afa"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "102aaa50a0ab9c01acecbe0e251971f1"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "8b7a63854aca381c37b75c0a15147e55"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "e5538c8f36c4f4dd8fc6971e28cc3c1c"
  },
  {
    "url": "gofurther/index.html",
    "revision": "5d718c0eb40a75471068c1f7a25afcff"
  },
  {
    "url": "gofurther/workflow.html",
    "revision": "9276fbee1aa3201305f104b1eb21f01b"
  },
  {
    "url": "index.html",
    "revision": "f38a073e50b6c83703e13705f8a12436"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "3b265e0d243a4d41875b3d71db26158b"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "f9e71cd921b64b1582063c42fc3efecb"
  },
  {
    "url": "quickstart/features.html",
    "revision": "5a0c2c76717b97373f77a93539b9ae75"
  },
  {
    "url": "quickstart/index.html",
    "revision": "3ddd394579e07d2d0f8cfe61c9e43986"
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
