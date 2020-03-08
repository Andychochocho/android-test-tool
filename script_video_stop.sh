pkill -9 $1
trap "kill 0" SIGINT SIGTERM EXIT
echo $1 > /dev/tty
    echo "return value"