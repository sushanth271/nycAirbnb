from flask import Flask, request
from flask import render_template
import pandas as pd
import json
from sklearn.cluster import KMeans
import math
from sklearn.preprocessing import StandardScaler
from sklearn import preprocessing
from sklearn.decomposition import PCA
import numpy as np
from flask import jsonify


app = Flask(__name__)

data2021 = pd.read_csv("Data\listings_2020_stratified.csv")


year = 2019
# data2021 = pd.read_csv("C:\\Users\\madhu\\listings_2020_stratified.csv")




# print(data2021.columns)
# borough = data2021['neighbourhood_group_cleansed'].tolist()
# print(data2021['neighbourhood_group_cleansed'].unique())

# barData = []
# dataBorough = data2021['id']
# features=['neighbourhood_cleansed','neighbourhood_group_cleansed']
# localities_data = data2021[features]
# print(localities_data)



# mylist=data2021['neighbourhood_cleansed','neighbourhood_group_cleansed'].tolist()
# unique = np.unique(mylist)
# # print(unique)
# for i in range(len(unique)):
#     tempDict={'Borough': unique[i], 'value': int(mylist.count(unique[i]))}
#     barData.append(tempDict)
@app.route("/kval")
def init():
    return render_template('index.html')



@app.route("/")
def init():
    return render_template('index.html')


@app.route("/test",methods = ['POST', 'GET'])
def test():
	return "test message"

@app.route("/Borough",methods = ['POST','GET'])
def sendBorough():
    # borough = dict()
    # mylist=data2021['neighbourhood_group_cleansed'].tolist()
    # borough['Manhattan']=mylist.count("Manhattan")
    # borough['Queens']=mylist.count("Queens")
    # borough['Bronx']=mylist.count("Bronx")
    # borough['Brooklyn']=mylist.count("Brooklyn")
    # borough['Staten Island']=mylist.count("Staten Island")
    # return jsonify(borough)
    barData = []
    barData = getUniversalData(data2021, barData)
    #dataIds = data2021['id']
    #mylist=data2021['neighbourhood_group_cleansed'].tolist()
    #unique = np.unique(mylist)
   # # print(unique)
    #for i in range(len(unique)):
       # tempDict={'Borough': unique[i], 'value': int(mylist.count(unique[i]))}
       # barData.append(tempDict)
        # print(tempDict) 
    return barData  

@app.route("/Localities",methods = ['POST','GET'])
def sendLocalities():
    # borough = dict()
    # mylist=data2021['neighbourhood_group_cleansed'].tolist()
    # borough['Manhattan']=mylist.count("Manhattan")
    # borough['Queens']=mylist.count("Queens")
    # borough['Bronx']=mylist.count("Bronx")
    # borough['Brooklyn']=mylist.count("Brooklyn")
    # borough['Staten Island']=mylist.count("Staten Island")
    # return jsonify(borough)
    barData = []
    dataBorough = data2021['id']
    mylist=data2021['neighbourhood_cleansed'].tolist()
    unique = np.unique(mylist)
    # print(unique)
    for i in range(len(unique)):
        tempDict={'Borough': unique[i], 'value': int(mylist.count(unique[i]))}
        barData.append(tempDict)
        # print(tempDict) 
    return jsonify(barData)   



@app.route("/Pie",methods = ['POST','GET'])
def sendPie():
    # borough = dict()
    # mylist=data2021['neighbourhood_group_cleansed'].tolist()
    # borough['Manhattan']=mylist.count("Manhattan")
    # borough['Queens']=mylist.count("Queens")
    # borough['Bronx']=mylist.count("Bronx")
    # borough['Brooklyn']=mylist.count("Brooklyn")
    # borough['Staten Island']=mylist.count("Staten Island")
    # return jsonify(borough)
    pieData = []
    data1 = []
    data2 = []
    unique = data2021['bathrooms'].unique().tolist()
    print(unique)
    unique.sort()
    mylist=data2021['bathrooms'].tolist()
    pieData = []
    for i in range(len(unique)):
        tempDict={'Bathroom': unique[i], 'value': int(mylist.count(unique[i]))}
        data1.append(tempDict)
    unique = data2021['bedrooms'].unique().tolist()
    print(unique)
    unique.sort()
    mylist=data2021['bedrooms'].tolist()
    pieData = []
    for i in range(len(unique)):
        tempDict={'bedrooms': unique[i], 'value': int(mylist.count(unique[i]))}
        data2.append(tempDict)
    pieData.append(data1)
    pieData.append(data2)
    return jsonify(pieData)
    
    # return jsonify(pieData)
    return ""



@app.route("/line",methods= ['POST','GET'])
def sendLine():
    lineData = []
    lineData = getUniversalData(data2021, lineData)
    print(data2021['availability_365'].unique())
    data = data2021['availability_365']
    mylist=data2021['availability_365'].tolist()
    data= dict()
    #for i in range(365):
    #    data[i] = mylist.count(i)

    # print(data)
    return lineData

@app.route("/map",methods= ['POST','GET'])
def sendMap():
    lineData = []
    lineData = getUniversalData(data2021, lineData)
    print(data2021['availability_365'].unique())
    data = data2021['availability_365']
    mylist=data2021['availability_365'].tolist()
    data= dict()
    #for i in range(365):
    #    data[i] = mylist.count(i)
    # print(data)
    return lineData

@app.route("/scatterplot",methods= ['POST','GET'])
def sendScatterPlotData():
    scatterData=[]
    dataIds = data2021['id']
    #dataPrice = data2021['price'].str.replace('$','').str.replace(',','')
    #dataPrice = data2021['price'].str.replace(',','')
    #dataRating = data2021['review_scores_rating']
    dataPrice = data2021['price']
    dataAvail = data2021['availability_365'].tolist()
    dataBathRooms = data2021['bathrooms']
    dataBedRooms = data2021['bedrooms']
    dataBorough = data2021['neighbourhood_group_cleansed']
    dataLocality = data2021['neighbourhood_cleansed']
    maxm =  max(data2021['review_scores_rating'])
    minm = min(data2021['review_scores_rating'])
    dataRating = 10*((data2021["review_scores_rating"] - minm)/(maxm - minm)) 
    for i in range(len(dataIds)):
        tempDict = { 'price':float(dataPrice[i]), 'rating': float(dataRating[i]), 'availability': dataAvail[i], 'bathrooms' : dataBathRooms[i], 'bedrooms': dataBedRooms[i], 'borough': dataBorough[i] , 'locality': dataLocality[i]}
        scatterData.append(tempDict)
    return jsonify(scatterData)


@app.route("/parallelPlot",methods= ['POST','GET'])
def sendPcpData():
    pcpData=[]
    dataIds = data2021['id']
    dataPrice = data2021['price']
    maxm =  max(data2021['review_scores_rating'])
    minm = min(data2021['review_scores_rating'])
    dataRating = 10*((data2021["review_scores_rating"] - minm)/(maxm - minm)) 
    dataBorough = data2021['neighbourhood_group_cleansed']
    dataBathRooms = data2021['bathrooms']
    dataBedRooms = data2021['bedrooms']
    dataAccomodates = data2021['accommodates']
    dataAvail = data2021['availability_365']
    for i in range(len(dataIds)):
        #tempDict = {'id':int(dataIds[i]), 'borough': str(dataBorough[i]), 'price':float(dataPrice[i]), 'rating': float(dataRating[i]), 'bedrooms' : int(dataBedRooms[i]), 'bathrooms': float(dataBathRooms[i]), 'availability' : int(dataAvail[i]) }
        tempDict = { 'borough': str(dataBorough[i]), 'price':float(dataPrice[i]), 'rating': float(dataRating[i]), 'bedrooms' : int(dataBedRooms[i]), 'bathrooms': float(dataBathRooms[i]), 'availability' : int(dataAvail[i]) }
        pcpData.append(tempDict)
    return jsonify(pcpData)

def getUniversalData(data2021, lineData):
    dataIds = data2021['id']
    #dataPrice = data2021['price'].str.replace('$','').str.replace(',','')
    #dataPrice = data2021['price'].str.replace(',','')
    #dataRating = data2021['review_scores_rating']
    dataPrice = data2021['price']
    dataAvail = data2021['availability_365'].tolist()
    dataBathRooms = data2021['bathrooms']
    dataBedRooms = data2021['bedrooms']
    dataBorough = data2021['neighbourhood_group_cleansed']
    dataLocality = data2021['neighbourhood_cleansed']
    maxm =  max(data2021['review_scores_rating'])
    minm = min(data2021['review_scores_rating'])
    dataRating = 10*((data2021["review_scores_rating"] - minm)/(maxm - minm)) 
    for i in range(len(dataIds)):
        tempDict = { 'price':float(dataPrice[i]), 'rating': float(dataRating[i]), 'availability': dataAvail[i], 'bathrooms' : dataBathRooms[i], 'bedrooms': dataBedRooms[i], 'borough': dataBorough[i], 'locality': dataLocality[i] }
        lineData.append(tempDict)
    return jsonify(lineData)

if __name__ == "__main__":
    app.run(debug=True)
    