compile : main.go
	packr build
run : compile
	maz3d-web
