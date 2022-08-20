<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<widget id="$PACKAGE_ID" version="2.0.0" ios-CFBundleVersion="$BUILD_NUMBER" android-versionCode="$BUILD_NUMBER" xmlns:android="http://schemas.android.com/apk/res/android">
  <name>$TITLE</name>
  <description>Akt'n'Map application</description>
  <icon src="res/icons/icon.png"/>
  <author email="support@kalisio.com" href="http://www.kalisio.com">Kalisio</author>
  <content src="index.html"/>
  <access origin="*"/>
  <allow-intent href="http://*/*"/>
  <allow-intent href="https://*/*"/>
  <allow-intent href="tel:*"/>
  <allow-intent href="sms:*"/>
  <allow-intent href="mailto:*"/>
  <allow-intent href="geo:*"/>
  <preference name="scheme" value="app" /> 
  <preference name="hostname" value="localhost" />  
  <preference name="android-minSdkVersion" value="23"/>
  <preference name="android-targetSdkVersion" value="30"/>
  <preference name="permissions" value="none"/>
  <preference name="orientation" value="default"/>
  <preference name="target-device" value="universal"/>
  <preference name="fullscreen" value="true"/>
  <preference name="webviewbounce" value="true"/>
  <preference name="prerendered-icon" value="true"/>
  <preference name="stay-in-webview" value="false"/>
  <preference name="ios-statusbarstyle" value="black-opaque"/>
  <preference name="detect-data-types" value="true"/>
  <preference name="exit-on-suspend" value="false"/>
  <preference name="show-splash-screen-spinner" value="true"/>
  <preference name="auto-hide-splash-screen" value="true"/>
  <preference name="disable-cursor" value="false"/>
  <preference name="android-installLocation" value="auto"/>
  <preference name="loadUrlTimeoutValue" value="30000"/>
  <preference name="SplashScreen" value="screen"/>
  <preference name="StatusBarOverlaysWebView" value="false"/>
  <platform name="android">
    <hook src="hooks/android-before-build.js" type="before_build"/>
    <allow-intent href="market:*"/>
    <resource-file src="google-services.json" target="app/google-services.json"/>
    <custom-config-file parent="/*" target="AndroidManifest.xml">
      <uses-permission android:name="android.permission.CAMERA"/>
      <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    </custom-config-file>
    <icon density="ldpi" src="res/icons/android/icon-36-ldpi.png"/>
    <icon density="mdpi" src="res/icons/android/icon-48-mdpi.png"/>
    <icon density="hdpi" src="res/icons/android/icon-72-hdpi.png"/>
    <icon density="xhdpi" src="res/icons/android/icon-96-xhdpi.png"/>
    <icon density="xxhdpi" src="res/icons/android/icon-144-xxhdpi.png"/>
    <icon density="xxxhdpi" src="res/icons/android/icon-192-xxxhdpi.png"/>
    <splash density="hdpi" src="res/screens/android/screen-hdpi-portrait.png"/>
    <splash density="ldpi" src="res/screens/android/screen-ldpi-portrait.png"/>
    <splash density="mdpi" src="res/screens/android/screen-mdpi-portrait.png"/>
    <splash density="xhdpi" src="res/screens/android/screen-xhdpi-portrait.png"/>
    <splash density="xxhdpi" src="res/screens/android/screen-xxhdpi-portrait.png"/>
    <splash density="xxxhdpi" src="res/screens/android/screen-xxxhdpi-portrait.png"/>
    <splash density="land-hdpi" src="res/screens/android/screen-hdpi-landscape.png"/>
    <splash density="land-ldpi" src="res/screens/android/screen-ldpi-landscape.png"/>
    <splash density="land-mdpi" src="res/screens/android/screen-mdpi-landscape.png"/>
    <splash density="land-xhdpi" src="res/screens/android/screen-xhdpi-landscape.png"/>
    <splash density="land-xxhdpi" src="res/screens/android/screen-xxhdpi-landscape.png"/>
    <splash density="land-xxxhdpi" src="res/screens/android/screen-xxxhdpi-landscape.png"/>
    <splash density="port-hdpi" src="res/screens/android/screen-hdpi-portrait.png"/>
    <splash density="port-ldpi" src="res/screens/android/screen-ldpi-portrait.png"/>
    <splash density="port-mdpi" src="res/screens/android/screen-mdpi-portrait.png"/>
    <splash density="port-xhdpi" src="res/screens/android/screen-xhdpi-portrait.png"/>
    <splash density="port-xxhdpi" src="res/screens/android/screen-xxhdpi-portrait.png"/>
    <splash density="port-xxxhdpi" src="res/screens/android/screen-xxxhdpi-portrait.png"/>
  </platform>
  <platform name="ios">
    <allow-intent href="itms:*"/>
    <allow-intent href="itms-apps:*"/>
    <feature name="CDVWKWebViewEngine">
      <param name="ios-package" value="CDVWKWebViewEngine"/>
    </feature>
    <preference name="WKWebViewOnly" value="true"/>
    <preference name="CordovaWebViewEngine" value="CDVWKWebViewEngine"/>
    <preference name="AllowBackForwardNavigationGestures" value="true"/>
    <preference name="Allow3DTouchLinkPreview" value="false"/>
    <edit-config target="NSLocationAlwaysUsageDescription" file="*-Info.plist" mode="merge">
      <string>Need to access your position to build meaningful events</string>
    </edit-config>
    <edit-config target="NSLocationWhenInUseUsageDescription" file="*-Info.plist" mode="merge">
      <string>Need to access your position to build meaningful events</string>
    </edit-config>
    <edit-config target="NSCameraUsageDescription" file="*-Info.plist" mode="merge">
      <string>Need camera access to take pictures</string>
    </edit-config>
    <edit-config target="NSPhotoLibraryUsageDescription" file="*-Info.plist" mode="merge">
      <string>Need photo library access to get pictures from there</string>
    </edit-config>
    <edit-config target="NSPhotoLibraryAddUsageDescription" file="*-Info.plist" mode="merge">
      <string>Need photo library access to save pictures there</string>
    </edit-config>
    <icon height="29" src="res/icons/ios/icon-small.png" width="29"/>
    <icon height="58" src="res/icons/ios/icon-small-2x.png" width="58"/>
    <icon height="87" src="res/icons/ios/icon-small-3x.png" width="87"/>
    <icon height="40" src="res/icons/ios/icon-40.png" width="40"/>
    <icon height="80" src="res/icons/ios/icon-40-2x.png" width="80"/>
    <icon height="120" src="res/icons/ios/icon-40-3x.png" width="120"/>
    <icon height="50" src="res/icons/ios/icon-50.png" width="50"/>
    <icon height="100" src="res/icons/ios/icon-50-2x.png" width="100"/>
    <icon height="57" src="res/icons/ios/icon-57.png" width="57"/>
    <icon height="114" src="res/icons/ios/icon-57-2x.png" width="114"/>
    <icon height="60" src="res/icons/ios/icon-60.png" width="60"/>
    <icon height="120" src="res/icons/ios/icon-60-2x.png" width="120"/>
    <icon height="180" src="res/icons/ios/icon-60-3x.png" width="180"/>
    <icon height="72" src="res/icons/ios/icon-72.png" width="72"/>
    <icon height="144" src="res/icons/ios/icon-72-2x.png" width="144"/>
    <icon height="76" src="res/icons/ios/icon-76.png" width="76"/>
    <icon height="152" src="res/icons/ios/icon-76-2x.png" width="152"/>
    <icon height="167" src="res/icons/ios/icon-83.5-2x.png" width="167"/>
    <splash height="1136" src="res/screens/ios/screen-iphone-568h-2x.png" width="640"/>
    <splash height="480" src="res/screens/ios/screen-iphone-portrait.png" width="320"/>
    <splash height="960" src="res/screens/ios/screen-iphone-portrait-2x.png" width="640"/>
    <splash height="1334" src="res/screens/ios/screen-iphone-portrait-667h.png" width="750"/>
    <splash height="2208" src="res/screens/ios/screen-iphone-portrait-736h.png" width="1242"/>
    <splash height="1242" src="res/screens/ios/screen-iphone-landscape-736h.png" width="2208"/>
    <splash height="1024" src="res/screens/ios/screen-ipad-portrait.png" width="768"/>
    <splash height="2048" src="res/screens/ios/screen-ipad-portrait-2x.png" width="1536"/>
    <splash height="768" src="res/screens/ios/screen-ipad-landscape.png" width="1024"/>
    <splash height="1536" src="res/screens/ios/screen-ipad-landscape-2x.png" width="2048"/>
    <splash height="2048" src="res/screens/ios/screen-ipad-landscape-ipadpro.png" width="2732"/>
    <splash height="2732" src="res/screens/ios/screen-ipad-portrait-ipadpro.png" width="2048"/>
  </platform>
  <plugin name="cordova-custom-config" spec="~5.1.0"/>
  <plugin name="cordova-plugin-statusbar" spec="~3.0.0"/>
  <plugin name="cordova-plugin-android-permissions" spec="~1.1.3"/>
  <plugin name="cordova-plugin-device" spec="~2.1.0"/>
  <!--plugin name="cordova-plugin-geolocation" spec="~4.1.0"/>
  <plugin name="cordova-plugin-camera" spec="~6.0.0"/-->
  <plugin name="cordova-plugin-sim" spec="~1.3.3"/>
  <plugin name="cordova-plugin-whitelist" spec="~1.3.5"/>
  <plugin name="cordova-plugin-inappbrowser" spec="~5.0.0"/>
  <!--plugin name="cordova-plugin-file" spec="~7.0.0"/>
  <plugin name="cordova-plugin-file-opener2" spec="~3.0.5"/>
  <plugin name="uk.co.workingedge.phonegap.plugin.launchnavigator" source="npm">
    <variable name="GOOGLE_API_KEY_FOR_ANDROID" value="$GOOGLE_API_KEY_FOR_ANDROID"/>
  </plugin>
  <plugin name="@havesource/cordova-plugin-push" spec="3.0.1"/-->
  <engine name="android" spec="~10.1.2"/>
  <engine name="ios" spec="~6.2.0"/>
</widget>