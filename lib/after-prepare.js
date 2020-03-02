var fs = require('fs');
var AndroidManifest = require('androidmanifest');
var iOSPList = require('plist');

module.exports = function($logger, $projectData, hookArgs) {
  var appPackage = require($projectData.projectFilePath);
  let appVersionIOS =
    (appPackage.nativescript && appPackage.nativescript.buildVersion && appPackage.nativescript.buildVersion.ios && appPackage.nativescript.buildVersion.ios.version) ||
    (appPackage.buildVersion.ios && appPackage.buildVersion.ios.version);
  let appVersionNumberIOS =
    (appPackage.nativescript && appPackage.nativescript.buildVersion && appPackage.nativescript.buildVersion.ios && appPackage.nativescript.buildVersion.ios.versionNumber) ||
    (appPackage.buildVersion.ios && appPackage.buildVersion.ios.versionNumber);
  
  let appVersionAndroid =
    (appPackage.nativescript && appPackage.nativescript.buildVersion && appPackage.nativescript.buildVersion.android && appPackage.nativescript.buildVersion.android.version) ||
    (appPackage.buildVersion.android && appPackage.buildVersion.android.version);
  let appVersionNumberAndroid =
    (appPackage.nativescript && appPackage.nativescript.buildVersion && appPackage.nativescript.buildVersion.android && appPackage.nativescript.buildVersion.android.versionNumber) ||
    (appPackage.buildVersion.android && appPackage.buildVersion.android.versionNumber);

  // Check if we have ios and android versions;
  let skipIOS, skipAndroid;
  if (!appVersionIOS) {
    $logger.warn(
      'Nativescript ios version is not defined. Skipping set native package version.'
    );
    skipIOS = true;
  }
  
  if (!appVersionAndroid) {
    $logger.warn(
      'Nativescript android version is not defined. Skipping set native package version.'
    );
    skipAndroid = true;
  }

  var platformsData = getPlatformsData($injector);
  var platform = (
    hookArgs.platform ||
    (hookArgs.prepareData && hookArgs.prepareData.platform)
  ).toLowerCase();
  $logger.info(`Platform: ${platform}`);

  var platformData = platformsData.getPlatformData(platform);
  $logger.info(
    `platformData.configurationFilePath: ${platformData.configurationFilePath}`
  );
  if (platform == 'android' && !skipAndroid) {
    var manifest = new AndroidManifest().readFile(
      platformData.configurationFilePath
    );

    // transforms e.g. "1.2.3" into 102003.
    let versionCode = appVersionAndroid
      .split('.')
      .reduce(
        (acc, v, i, a) => acc + v * Math.pow(10, (a.length - i - 1) * 2),
        0
      );

    if (appVersionNumberAndroid) {
      versionCode = appVersionNumberAndroid;
      //versionCode = versionCode * 100 +
      //  (appVersionNumberAndroid < 10 ? '0' : '') + // left pad appVersionNumber
      //  appVersionNumberAndroid;
    }

    manifest.$('manifest').attr('android:versionCode', versionCode);
    manifest.$('manifest').attr('android:versionName', appVersionAndroid);
    manifest.writeFile(platformData.configurationFilePath);

    console.log(VERSION_CODE, " ", versionCode);

  } else if (platform == 'ios' && !skipIOS) {
    var plist = iOSPList.parse(
      fs.readFileSync(platformData.configurationFilePath, 'utf8')
    );
    plist.CFBundleShortVersionString = appVersionIOS;
    plist.CFBundleVersion = appVersionNumberIOS;
    fs.writeFileSync(platformData.configurationFilePath, iOSPList.build(plist));
  }
};

function getPlatformsData($injector) {
  try {
    return $injector.resolve('platformsData');
  } catch (err) {
    return $injector.resolve('platformsDataService');
  }
}
