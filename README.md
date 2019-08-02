# android-test-tool
Android Test Tool is a lightweight MacOS app designed for QA testers who need a quick way to repeatedly save android device logs for bug reports when testing Android apps without stressing system resources.

You can find the latest release details at https://github.com/Andychochocho/android-testing-tool/releases. The downloadable installer can be found under the Assets section for each release.

See the Product Backlog for features coming in future releases: https://github.com/Andychochocho/android-testing-tool/projects/2

**NOTE**: In order to be able to use this tool, you first need ADB installed. We recommend this method on MacOS:

Open terminal and install home-brew and adb with the following commands (if not done so already):
```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

brew cask install android-platform-tools
```

Make sure that the path of your platform tools is  /Users/USERNAME/.android-sdk-macosx/platform-tools

