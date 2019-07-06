# android-testing-tool
Android Test Tool is a lightweight MacOS app designed for QA testers who need a quick way to repeatedly save android device logs for bug reports when testing Android apps without stressing system resources.

Currently only Android OS versions 7.0 and up are supported for the save log feature. Older OS version support will come in future releases though! We will also have a Windows app coming in 2020.

Temporary Build Link (ZIP): https://www.dropbox.com/s/1l1hxinlwni6xhn/Android%20Test%20Tool.zip?dl=0

Temporary Build Link (DMG): https://www.dropbox.com/s/enzqotr5bmqtr13/Android%20Test%20Tool.dmg?dl=0

**NOTE**: In order to be able to use this tool, you first need ADB installed. We recommend this method on MacOS:

Open terminal and install home-brew and adb with the following commands (if not done so already):
```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

brew cask install android-platform-tools
```

Make sure that the path of your platform tools is  /Users/USERNAME/.android-sdk-macosx/platform-tools

-----------------------------------------------------------------

2019 Roadmap:

July: Mac installer, device status and model indicator, save logcat to desktop as text file (Android 7.0+ only)

August: Screenshot capture, Android 5.x and 6.x support

September: Video capture to mp4 or GIF

October: View and search log in app

November: Screenshot annotations

December: Device performance stats dashboard

2020 Roadmap: 

Network traffic control, Analytics calls filtering, Windows installer
