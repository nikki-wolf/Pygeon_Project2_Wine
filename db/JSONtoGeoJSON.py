#! usr/bin/env python

from sys import argv
from os.path import exists 

#script, in_file, out_file = argv

in_file= "wine_db.json"
out_file="wine_db.geojson"

import requests


#data = json.load(open(in_file,"w"))
with open(in_file,"r") as input_file:
    data=requests.get(input_file).json()
    geojson = {
        "type": "FeatureCollection",
        "features": [
        {
            "type": "Feature",
            "geometry" : {
                "type": "Point",
                "coordinates": [d["lon"], d["lat"]],
                },
            "properties" : d,
        } for d in data]
    }


output = open(out_file, 'w')
json.dump(geojson, output)

print (geojson)