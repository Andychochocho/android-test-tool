kill "$(pgrep -f "adb shell screenrecord")"

sleep 3
adb pull /sdcard/video.mp4 $1
sleep 1
adb shell rm /sdcard/video.mp4