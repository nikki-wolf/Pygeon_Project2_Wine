# Wine History project, by Pygeons, v.2, Kevin, Renato, Matt, Angel (was moved to another group), and Heather.
# Jun-2019

# Input data:
# Our db is in mLAB (non-relational Mongo db) connected to Heroku environment. We have several collections on the db primarily describing two kind of wine data:
# 1) Wine rating: relating wine variety, subvariety, price, and rating for all producing wine countries.
#                  As an ETL project, we extracted features from the wine_price_rating_variety.csv (120915 rows) which in turn was generated on another ETL project by Pygeons from winemag-data-130k-v2.csv
#                  cleaned data and after the required data transferring, loaded the collection to mLab in two modes:
#                  1-a) wine_rating: features of each country and each year loaded as one documents: 120915 documents (we found it slow when called as a JSON in our flask app)
#                  1-b-1) wine_rating_list_World: features of each country but for all years loaded in one document: 42 documents (countries include all producing countries + The US + World)
#                  1-b-2) wine_rating_list_States: features of each State of the US but for all years loaded in one document: 42 documents (countries include all producing countries + The US + World)
# 2) Wine history: data relating wine production, consumption, export and import for volume, value, and volume/GDP for all producing countries. 
# More than 100 worksheets in raw data (Megafile_of_global_wine_data_1835_to_2016_1217.xlsx), cleaned data in another ETL project by Pygeons and transfered it to Wine_history.xlsx.
# We loaded data to mLab in three modes:
#                  2-a) wine_history_onedocument: all data loaded as one single document (a JSON format from a Pandas df). Performance of calling this collection was acceptable but the filtering option based on applying mongodb filter options were not available.
#                  2-b) wine_hisotry: features for each country and each year loaded as one document (8056 document). Filtering options are great by the performance of calling this collection was not acceptable particularly when data transferred to GeoJSON format.
#                  2-c) wine_history_list: features for each country but for all years loaded in one document (53 documents). It is the optimized calling performance and filtering option and was uselcted for the GeoJSON calls in this project.

# The Jupyter notebook (wine_db_v2.ipynb) is the code of ETL project.
import os
import psycopg2
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify, render_template, json, request,url_for
from flask_json import FlaskJSON, JsonError, json_response, as_json
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
import json
from bson import ObjectId
from collections import OrderedDict
from datetime import datetime
import ast
import simplejson
import pymongo

mlab_ID={
    "_id": "heroku_stp5z9b7.pygeons",
    "user": "pygeons",
    "db": "heroku_stp5z9b7",
    "roles": [
        {
            "role": "dbOwner",
            "db": "heroku_stp5z9b7"
        }
    ],
    "pass":'pygeons2019'
}

conn_mlab='mongodb://{one}:{two}@ds231377.mlab.com:31377/{three}'.format(one=mlab_ID['user'], two=mlab_ID['pass'], three=mlab_ID['db'])

client = pymongo.MongoClient(conn_mlab)

#connect to database heroku_stp5z9b7
db = client.heroku_stp5z9b7

# create/read collections for options 1 and 2:
wine_opt1=db.wine_rating # creating/reading collection by option 1
wine_opt2=db.wine_history # creating/reading collection by option 2  
wine_history_list=db.wine_history_list # reading wine history collection by option 2 
wine_rating_list_World=db.wine_rating_list_World # reading wine rating and price collection for all the producing countries including US
wine_rating_list_States=db.wine_rating_list_States # reading wine rating and price collection for The producing States
wine_rating=db.wine_rating #reading wine rating and price from the long collection (120915 documents)
wine_rating_world_unique=db.wine_rating_world_unique #reading wine rating and price from the one document collection with unique subvarieties

func = lambda s: s[:1].lower() + s[1:] if s else '' #function to return lower case of all character of a strign

app = Flask(__name__)
FlaskJSON(app) #initiate FLASK-JSON


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api_rating_unique")
def ratingunique():
     wd=wine_rating_world_unique.find({}, {'_id': False})
     rows=[]
     for data in wd:
        rows.append(data)
     return simplejson.dumps(rows)

#generate data in json format to be called by indexPlotly.html  
@app.route("/plotlyData")
def plotlyData():
    dummy=0.0000001
    country=request.args.get('country')
    wd=wine_history_list.find({'Country': country}, {'_id': False})
    production_volume=ast.literal_eval(wd[0]['Production_volume'].replace("nan",str(dummy))) #convert string of list of numeric values to list of numerics
    production_volume=[np.nan if x==dummy else x for x in production_volume] #replace generate dummy value with nan

    consumption_volume=ast.literal_eval(wd[0]['Consumption_volume'].replace("nan",str(dummy))) #convert string of list of numeric values to list of numerics
    consumption_volume=[np.nan if x==dummy else x for x in consumption_volume] #replace generate dummy value with nan 

    Export_volume=ast.literal_eval(wd[0]['Export_volume'].replace("nan",str(dummy))) #convert string of list of numeric values to list of numerics
    Export_volume=[np.nan if x==dummy else x for x in Export_volume] #replace generate dummy value with nan 

    Import_volume=ast.literal_eval(wd[0]['Import_volume'].replace("nan",str(dummy))) #convert string of list of numeric values to list of numerics
    Import_volume=[np.nan if x==dummy else x for x in Import_volume] #replace generate dummy value with nan 

    years=ast.literal_eval(wd[0]['Year']) #convert string of list of numeric values to list of numerics
   
    trace1 = {
        "x": years,
        "y": production_volume,
        "name": "Production Volume (kL)",
        "type": 'scatter'
    }
    trace2 = {
        "x": years,
        "y": consumption_volume,
        "name": "Consumption Volume (kL)",
        "type": 'scatter'
    }

    trace3 = {
        "x": years,
        "y": Export_volume,
        "name": "Export Volume (kL)",
        "type": 'scatter'
    } 
    trace4 = {
        "x": years,
        "y": Import_volume,
        "name": "Import Volume (kL)",
        "type": 'scatter'
    }

    chartData=[trace1, trace2, trace3, trace4]  

    chartLayout={"title": country, "showlegend": False}

    data={"data":chartData, 
          "layout": chartLayout}
    #return jsonify(data)
    return simplejson.dumps(data, ignore_nan=True)

# return json data to test d3.tree   
@app.route("/graphJSON")
def plottreeD3():
    
    graph={
        "name" : "Father",
        "children": [
            { "name" : "Son",
            "children": [
                {"name" : "Grandson"},
                {"name" : "Granddaughter"}
            ]
            }
        ]
        }
    return jsonify(graph)

#post data from JS to flask
@app.route('/JSONTree')
def get_javascript_data():
    with open(os.path.join('wineData.json')) as json_file:
        json_data = json.load(json_file)
    return json.dumps(json_data)

    
#plots charts for each country using Plotly and load it to /plotly/?country=countryname (it will be called in leaflet map popup in logic.js)
@app.route("/plotlyChart")
def plotlyChart():
    country=request.args.get('country')
    return render_template("indexPlotly.html",country=country)

# Route to return wine price, rating for all producing coutnries Worldwide in JSON format
@app.route("/api_rating")
def idata():
    country=request.args.get('country')
    if (country): 
        country=func(country).title()
        wd=wine_rating_list_World.find({'Country':country},{'_id': False})
    else:
        wd=wine_rating_list_World.find({},{'_id': False})

    rows=[]
    for data in wd:
        rows.append(data)

    return jsonify(rows)

#route to return wine price ... from wine_rating collection
@app.route("/api_rating_extended")
def idata_extended():
    country=request.args.get('country')
    if (country): 
        country=func(country).title()
        wd=wine_rating.find({'country':country},{'_id': False})
    else:
        wd=wine_rating.find({},{'_id': False})

    rows=[]
    for data in wd:
        rows.append(data)

    return jsonify(rows)


# Route to return wine price, rating for all the producing States in JSON format
# user can make a query by State, e.g. State=Texas
@app.route("/api_rating/States")
def idata_state():
    state=request.args.get('state')
    if (state): 
        state=func(state).title()
        wd=wine_rating_list_States.find({'State':state},{'_id': False})
    else:
        wd=wine_rating_list_States.find({},{'_id': False})

    rows=[]
    for data in wd:
        rows.append(data)
    return jsonify(rows)

# Route to return wine price, rating data for all producing countries worldwide in GeoJSON format. User can add country as an argument
# e.g., /GeoJSON?country=frANCE
@app.route("/api_rating/GeoJSON")
def idata_geojson_country():
    country=request.args.get('country')
    if (country):
        if country !='US':
            country=func(country).title()
        wd=wine_rating_list_World.find({'Country': country}, {'_id': False})
    else:
        wd=wine_rating_list_World.find({}, {'_id': False})
    rows=[]
    for data in wd:
        rows.append(data)

    geojson = {
        "type": "FeatureCollection",
        "metadata": {
        "title": "Wine History by Pygeons",
        "status": 200,
        "count": len(rows)
        },
        "features": [
        {
            "type": "Feature",

            "geometry" : {
                "type": "Point",
                "coordinates": [d["coordinate"]["lon"], d["coordinate"]["lat"]],
            },

            "properties" : 
            {
              "Country":d["Country"],
              "Province": d["Province"],
              "Price":  d["Price"],
              "Rating": d["Rating"],
              "Variety": d["Variety"],
              "Subvariety": d["Subvariety"], 
            } 
        }  for d in rows]
    }
    return json.dumps(geojson)

# Route to return wine price, rating data for all producing countries worldwide in GeoJSON format. User can add country as an argument
# e.g., /GeoJSON?country=frANCE

@app.route("/api_rating/States/GeoJSON")
def idata_geojson_state():
    state=request.args.get('state')
    if (state):
        state=func(state).title()
        wd=wine_rating_list_States.find({'State': state}, {'_id': False})
    else:
        wd=wine_rating_list_States.find({}, {'_id': False})
    rows=[]
    for data in wd:
        rows.append(data)

    geojson = {
        "type": "FeatureCollection",
        "metadata": {
        "title": "Wine History by Pygeons",
        "status": 200,
        "count": len(rows)
        },
        "features": [
        {
            "type": "Feature",

            "geometry" : {
                "type": "Point",
                "coordinates": [d["coordinate"]["lon"], d["coordinate"]["lat"]],
            },

            "properties" : 
            {
              "Country":d["Country"],
              "State":d['State'],
              "Price":  d["Price"],
              "Rating": d["Rating"],
              "Variety": d["Variety"],
              "Subvariety": d["Subvariety"], 
            } 
        }  for d in rows]
    }
    return json.dumps(geojson)




@app.route("/api_history")
def jsondata():
    country=request.args.get('country')
    year=request.args.get('year')
    syear=request.args.get('startyear')
    eyear=request.args.get('endyear')
    
    def wd_probe(country,year,syear,eyear):
        print("inside fund: country=",country,"year=",year,"syear=",syear,"eyear=",eyear)         
        if (country): 
            country=func(country).title()
            if (year):# user input country, year
                return wine_opt2.find({'country': country, 'year': year}, {'_id': False})
            else: 
                if (syear): 
                    if (eyear): #user input country, staryear, endyear
                        return wine_opt2.find({'$and':[
                            {'year': {'$gte': syear}}, 
                            {'year': {'$lte': eyear}},
                            {'country': country}]}, {'_id': False})
                    else: #user input country, staryear
                        return wine_opt2.find({'$and':[
                            {'year': {'$gte': syear}}, 
                            {'country': country}]}, {'_id': False})
                else:
                    if (eyear): #user input country, endyear
                        return wine_opt2.find({'$and':[
                            {'year': {'$lte': eyear}},
                            {'country': country}]}, {'_id': False})
                    else: #user input country
                        return wine_opt2.find({'country': country}, {'_id': False})
        else: 
            if (year):# user input year
                return wine_opt2.find({'year': year}, {'_id': False})
            else:                    
                if (syear): 
                    if (eyear): #user input staryear, endyear
                        return wine_opt2.find({'$and':[
                            {'year': {'$gte': syear}}, 
                            {'year': {'$lte': eyear}}]}, {'_id': False})
                    else: #user input staryear
                        return wine_opt2.find({'$and':[
                            {'year': {'$gte': syear}}]}, {'_id': False})
                else:
                    if (eyear): #user input endyear
                        return wine_opt2.find({'$and':[
                            {'year': {'$lte': eyear}}]}, {'_id': False})
                    else: #user input nothing
                        return wine_opt2.find({}, {'_id': False})
            
    wd = wd_probe(country,year,syear,eyear)
    rows=[]
    for data in wd:
        rows.append(data)

    return jsonify(features=rows)


# Route to return data in GeoJSON format. User can add country as an argument
# e.g., /GeoJSON?country=frANCE
@app.route("/api_history/GeoJSON")
def jdata_geojson_country():
    country=request.args.get('country')
    if (country):
        country=func(country).title()
        wd=wine_history_list.find({'Country': country}, {'_id': False})
    else:
        wd=wine_history_list.find({}, {'_id': False})
    rows=[]
    for data in wd:
        rows.append(data)

    geojson = {
        "type": "FeatureCollection",
        "metadata": {
        "title": "Wine History by Pygeons",
        "status": 200,
        "count": len(rows)
        },
        "features": [
        {
            "type": "Feature",

            "geometry" : {
                "type": "Point",
                "coordinates": [d["Coordinate"]["lon"], d["Coordinate"]["lat"]],
            },

            "properties" : 
            {
              "Country":d['Country'],
              "Year": d['Year'],
              "Production_volume":  d["Production_volume"],
              "Production_capita": d["Production_capita"],
              "Production_capita_GDP": d["Production_capita_GDP"],
              "Consumption_volume": d["Consumption_volume"],
              "Consumption_capita": d["Consumption_capita"],
              "Consumption_capita_GDP": d["Consumption_capita_GDP"],
              "Export_volume": d["Export_volume"],
              "Export_value": d["Export_value"],
              "Export_volume_GDP": d["Export_volume_GDP"],
              "Import_volume": d["Import_volume"],
              "Import_value": d["Import_value"],
              "Import_volume_GDP": d["Import_volume_GDP"],
              "Excess_volume":d["Excess_volume"],
              "Population": d["Population"],     
            } 
        }  for d in rows]
    }
    return json.dumps(geojson)



if __name__ == "__main__":
    app.run()





