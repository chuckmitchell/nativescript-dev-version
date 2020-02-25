# Nativescript hook plugin to maintain native app version

This plugin takes the `version` and `versionNumber` properties from `package.json` and puts on the specific platform resources: `AndroidManifest.xml` file for the Android sources, and `Info.plist` for iOS sources.

This plugin is mainly a fork of [jacargentina/nativescript-dev-version](https://github.com/jacargentina/nativescript-dev-version), with the great ideas from [speigg/nativescript-dev-version](https://github.com/speigg/nativescript-dev-version/tree/patch-1) and [simplec-dev/nativescript-dev-version](https://github.com/simplec-dev/nativescript-dev-version).

Compatible with NS 6.

## How to use

```
$ tns plugin add nativescript-dev-version
```

The above command installs this module and installs the necessary NativeScript hooks.

Then, specify and maintain the desired release version on the `./package.json` file under the `nativescript.version` property, for example:

```json
{
  "nativescript": {
    "id": "org.nativescript.MySampleApp",
    "buildVersion": {
      "ios": {
        "version": "1.2.3",
        "versionNumber": "1"
      },
      "android": {
        "version": "1.2.3",
        "versionNumber": "1"
      },
    },
    ...
  },
  ...
}
```

or:

```json
{
  "buildVersion": {
    "ios": {
      "version": "1.2.3",
      "versionNumber": "1"
    },
    "android": {
      "version": "1.2.3",
      "versionNumber": "1"
    }
  },
  ...
}
```

When running `tns prepare ...` the hooks will take care of the native resources.

On iOS, your `Info.plist` will get:

```
<key>CFBundleShortVersionString</key>
<string>1.2.3</string>
<key>CFBundleVersion</key>
<string>1</string>
```

On Android, `AndroidManifest.xml` will have:

```
<manifest
  (...) android:versionCode="10203001" android:versionName="1.2.3"
```