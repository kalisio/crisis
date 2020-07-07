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
    "revision": "4f6d1d8bd7506e9bf9284e09708431ff"
  },
  {
    "url": "about/contact.html",
    "revision": "27f77a0670d69b977b3e96f381bf432f"
  },
  {
    "url": "about/contributing.html",
    "revision": "3d179aecf9008bdfb3eeee9a86b2a3dd"
  },
  {
    "url": "about/index.html",
    "revision": "2377bf2f161abb57c185d2749bfd0cf5"
  },
  {
    "url": "about/license.html",
    "revision": "804e7d40ff18a7a5b5e98a1a16eba069"
  },
  {
    "url": "assets/css/0.styles.63401feb.css",
    "revision": "89f6e35f1b665fc46fd71f60fd66533a"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.ec04df26.js",
    "revision": "f026dd91d60162c93b0b06f5d75d74d3"
  },
  {
    "url": "assets/js/11.1609966d.js",
    "revision": "7cefa6af9624213dcc567bff168c6b0e"
  },
  {
    "url": "assets/js/12.01c5f693.js",
    "revision": "1e032d97d5637253218cc7d831229398"
  },
  {
    "url": "assets/js/13.0bce7a1a.js",
    "revision": "d131c4edee9d8abb468fe7328b5f450b"
  },
  {
    "url": "assets/js/14.516fcec2.js",
    "revision": "55145ca4deecbb7391e0e94f3e6bbb5d"
  },
  {
    "url": "assets/js/15.06e0ae5f.js",
    "revision": "9bc15e0719a63373536163785de3e551"
  },
  {
    "url": "assets/js/16.dcbf18ca.js",
    "revision": "ffcb030fa39424db5989d0f8e3b9e34e"
  },
  {
    "url": "assets/js/17.8495a32b.js",
    "revision": "89ce0872a2736b1591f693c28a0a4f20"
  },
  {
    "url": "assets/js/18.fc9a7777.js",
    "revision": "4bac8493dcafdc19f1db0e0ade03f91a"
  },
  {
    "url": "assets/js/19.ac92b4e0.js",
    "revision": "3d5008f2ec1ce147d36fc59340ef30d7"
  },
  {
    "url": "assets/js/2.77b98ac2.js",
    "revision": "8bf3548d2346e814d4d534ac90e284aa"
  },
  {
    "url": "assets/js/20.f5a70548.js",
    "revision": "300aa9805144457df82b26eb3e72072b"
  },
  {
    "url": "assets/js/21.a2f19396.js",
    "revision": "9577793eb879dd37d894e7a4e50656bb"
  },
  {
    "url": "assets/js/22.9878e8a5.js",
    "revision": "10f7f2227161b937a184aaf3f0cc03e7"
  },
  {
    "url": "assets/js/23.c3278f8b.js",
    "revision": "6f3c0a79b9101ea5e62d00c9b98a7e0d"
  },
  {
    "url": "assets/js/24.25a387fb.js",
    "revision": "95172005c25bc516378fa0f208608025"
  },
  {
    "url": "assets/js/25.8f7da961.js",
    "revision": "7e79e981061eb8910b7db8d2085542bf"
  },
  {
    "url": "assets/js/26.ea50ef1a.js",
    "revision": "e16e976e3d61a1790a325a48a9fc2108"
  },
  {
    "url": "assets/js/27.2b873be5.js",
    "revision": "0e401ad152188fcbb3041c4675acdd88"
  },
  {
    "url": "assets/js/28.6b41c2cd.js",
    "revision": "0fdac6102bde0ee019ca7a24f310df9d"
  },
  {
    "url": "assets/js/29.23b48d97.js",
    "revision": "7f62007c3be8cfb19332c1541233e949"
  },
  {
    "url": "assets/js/3.61d9df4f.js",
    "revision": "ed4946939bc54e44f0666947e4b017a0"
  },
  {
    "url": "assets/js/30.89966573.js",
    "revision": "759c516b87d9bb3b0c6e064a48b5ad0f"
  },
  {
    "url": "assets/js/31.1e4e2654.js",
    "revision": "8335ed86f79079226f3fc9b9c0e1a5f0"
  },
  {
    "url": "assets/js/32.0b49499e.js",
    "revision": "541c6d4c3ad549a99a435bca4f52d579"
  },
  {
    "url": "assets/js/33.3205fee2.js",
    "revision": "714ca96611a7e75b26a25ee464d0f510"
  },
  {
    "url": "assets/js/34.665a5270.js",
    "revision": "066835f2bacde040d1d5f81611884f03"
  },
  {
    "url": "assets/js/4.8f903346.js",
    "revision": "b2c37149a42ad8e26403c6b5b8f845cb"
  },
  {
    "url": "assets/js/5.5a0a6c49.js",
    "revision": "556799e3ef0076126124762e3f4ae97d"
  },
  {
    "url": "assets/js/6.a41b62e8.js",
    "revision": "9793da5713af918656ff06125c364375"
  },
  {
    "url": "assets/js/7.011161b6.js",
    "revision": "86c2f257124773bafff863640075eaba"
  },
  {
    "url": "assets/js/8.d9cc9bca.js",
    "revision": "781f291064fdbfeb06a77777e246c97d"
  },
  {
    "url": "assets/js/9.c3fc79e8.js",
    "revision": "cc94fd4901ae97891119d37e17798b88"
  },
  {
    "url": "assets/js/app.2f1a626c.js",
    "revision": "e1ae3beb070085aa3ac90a12fc8befda"
  },
  {
    "url": "fr/about/contact.html",
    "revision": "77a60e0625418f346cf23458b44ed8b1"
  },
  {
    "url": "fr/about/contributing.html",
    "revision": "ca30cf7badc479124b6c71bea35ab7f6"
  },
  {
    "url": "fr/about/index.html",
    "revision": "2cdeacf2796e17268b8e748bf92cc67e"
  },
  {
    "url": "fr/about/license.html",
    "revision": "61861b45fbc48f89084d9d6982464b57"
  },
  {
    "url": "fr/gofurther/archiving.html",
    "revision": "482840bc7d4dae76ed7706c13b6dc6fd"
  },
  {
    "url": "fr/gofurther/catalog.html",
    "revision": "8934f3263b56bbe42d50ef02838295cb"
  },
  {
    "url": "fr/gofurther/index.html",
    "revision": "ae703f30783b78c595dfadca39994783"
  },
  {
    "url": "fr/gofurther/processes.html",
    "revision": "b5a927a2ae603f642837b4dbca74eb71"
  },
  {
    "url": "fr/index.html",
    "revision": "8cc20443da6375f584b9d7e93c55711c"
  },
  {
    "url": "fr/quickstart/benefits.html",
    "revision": "d2c5e16ffe07b37af70e326e597e0f8b"
  },
  {
    "url": "fr/quickstart/concepts.html",
    "revision": "fc1ad9fa0eb9c7b5a03a91812be40cfc"
  },
  {
    "url": "fr/quickstart/features.html",
    "revision": "35c8f71c7faedbd42a5901f7e023b2cc"
  },
  {
    "url": "fr/quickstart/index.html",
    "revision": "25bbaacaf27408e4a176319d2667abc4"
  },
  {
    "url": "gofurther/archiving.html",
    "revision": "8262675e16f00d399a5db4c454f07bf1"
  },
  {
    "url": "gofurther/catalog.html",
    "revision": "adcad9ade875244677eecc0c4ede0fcc"
  },
  {
    "url": "gofurther/index.html",
    "revision": "10f422fd0d44a7c7260bcb703080a3d2"
  },
  {
    "url": "gofurther/processes.html",
    "revision": "c3fcb1c347bca1dbaeff00be1de49105"
  },
  {
    "url": "index.html",
    "revision": "bdc5da8e3749f5880661557cb1bbbbe6"
  },
  {
    "url": "quickstart/benefits.html",
    "revision": "5886ac56dc04a5c047fa552fc9b60b09"
  },
  {
    "url": "quickstart/concepts.html",
    "revision": "7785f1778bbf0d3a1264d71dcb97c947"
  },
  {
    "url": "quickstart/features.html",
    "revision": "0db62eaa41129c287d8c9d63083fa152"
  },
  {
    "url": "quickstart/index.html",
    "revision": "11738fcfbdc40c1a3921fe924d7b4f43"
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
