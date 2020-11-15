while true
do
	nc -N 127.0.0.1 46920 < data.txt
	sleep 10
done
