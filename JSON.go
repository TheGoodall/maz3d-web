package main

import (
	"encoding/json"
	"strings"
	"fmt"
	"strconv"
)

type subportal struct {
	World int
	X float64
	Y float64
	Rotation int64
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


	var PortalsUnstringified []string
	var SubportalUnstringified []string
	var NumUnstringified1 []string
	var NumUnstringified2 []string


	PortalsUnstringified = strings.Split(portals, "\n")
	Portals = []portal{}
	for i := range(PortalsUnstringified){
		SubportalUnstringified = strings.Split(PortalsUnstringified[i], "-")

		NumUnstringified1 = strings.Split(SubportalUnstringified[0], ",")

		World1, _ := strconv.Atoi(NumUnstringified1[0])
		X1, _ := strconv.ParseFloat(NumUnstringified1[1], 64)
		Y1, _ := strconv.ParseFloat(NumUnstringified1[2], 64)
		Rot1, _ := strconv.ParseInt(strings.TrimSpace(NumUnstringified1[3]), 10, 64)
		
		numsIn = subportal{World1, X1, Y1, Rot1}

		NumUnstringified2 = strings.Split(SubportalUnstringified[1], ",")

		World2, _ := strconv.Atoi(NumUnstringified2[0])
		X2, _ := strconv.ParseFloat(NumUnstringified2[1], 64)
		Y2, _ := strconv.ParseFloat(NumUnstringified2[2], 64)
		Rot2, _ := strconv.ParseInt(strings.TrimSpace(NumUnstringified2[3]), 10, 64)


		numsOut = subportal{World2, X2, Y2, Rot2}
		
		Subportals = portal{numsIn, numsOut}
		Portals = append(Portals, Subportals)
			
	}
		



	datums := datum{Maps, Portals}
	jsondatums, _:= json.Marshal(datums)
	return string(jsondatums)
}
