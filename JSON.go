package main

import (
	"fmt"
	"encoding/json"
	"strings"
	"strconv"
)

type subportal struct {
	World int
	X float64
	Y float64
	Rotation float64
}
type portal struct {
	In subportal
	Out subportal
}

type datum struct {
	Maps [][][]bool
	Portals []portal
}





func formatToJSON(data string) string {
	split := strings.Split(data, "/")
	MapsStr := strings.TrimSpace(split[0])
	portals := strings.TrimSpace(split[1])
	
	var Line []bool
	var Map [][]bool
	var Maps [][][]bool
	
	var MapsUnstringed []string
	var LineUnstringed []string
	var BoolUnstringed string

	MapsUnstringed = strings.Split(MapsStr, "-")
	Maps = [][][]bool{}
	for i :=  range(MapsUnstringed){
		Map = [][]bool{}
		LineUnstringed = strings.Split(strings.TrimSpace(MapsUnstringed[i]), "\n")

		for j := range(LineUnstringed){
			Line = []bool{}
			BoolUnstringed = strings.TrimSpace(LineUnstringed[j])
			for k := range(BoolUnstringed){
				if BoolUnstringed[k] == '0' {
					Line = append(Line, false)
				} else {
					Line = append(Line, true)
				}
			}
			Map = append(Map, Line)
		}
		Maps = append(Maps,Map)

	}
	var numsIn subportal
	var numsOut subportal
	var Subportals portal
	var Portals []portal


	var World int
	var X float64
	var Y float64
	var Rot float64

	var PortalsUnstringified []string
	var SubportalUnstringified []string
	var NumUnstringified []string


	
	PortalsUnstringified = strings.Split(portals, "\n")
	Portals = []portal{}
	for i := range(PortalsUnstringified){
		SubportalUnstringified = strings.Split(PortalsUnstringified[i], "-")

		NumUnstringified = strings.Split(SubportalUnstringified[0], ",")

		World, _ =strconv.Atoi(NumUnstringified[0])
		X, _ = strconv.ParseFloat(NumUnstringified[1], 64)
		Y, _ = strconv.ParseFloat(NumUnstringified[2], 64)
		Rot, _ = strconv.ParseFloat(NumUnstringified[3], 64)
		
		numsIn = subportal{World, X, Y, Rot}

		NumUnstringified = strings.Split(SubportalUnstringified[1], ",")

		World, _ =strconv.Atoi(NumUnstringified[0])
		X, _ = strconv.ParseFloat(NumUnstringified[1], 64)
		Y, _ = strconv.ParseFloat(NumUnstringified[2], 64)
		Rot, _ = strconv.ParseFloat(NumUnstringified[3], 64)
		
		numsOut = subportal{World, X, Y, Rot}
		
		Subportals = portal{numsIn, numsOut}
		Portals = append(Portals, Subportals)
			
	}
		



	datums := datum{Maps, Portals}
	print("\n\n")
	fmt.Printf("%v", datums)
	print("\n\n")
	jsondatums, _:= json.Marshal(datums)
	print(string(jsondatums))
	print("\n\n")
	return string(jsondatums)
}
