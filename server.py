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
    dataIds = data2021['id']
    mylist=data2021['neighbourhood_group_cleansed'].tolist()
    unique = np.unique(mylist)
    # print(unique)
    for i in range(len(unique)):
        tempDict={'Borough': unique[i], 'value': int(mylist.count(unique[i]))}
        barData.append(tempDict)
        # print(tempDict) 
    return jsonify(barData)   

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
    print(data2021['availability_365'].unique())
    data = data2021['availability_365']
    mylist=data2021['availability_365'].tolist()
    data= dict()
    for i in range(365):
        data[i] = mylist.count(i)
    # print(data)
    return data


@app.route("/scatterplot",methods= ['POST','GET'])
def sendScatterPlotData():
    scatterData=[]
    dataIds = data2021['id']
    #dataPrice = data2021['price'].str.replace('$','').str.replace(',','')
    #dataPrice = data2021['price'].str.replace(',','')
    #dataRating = data2021['review_scores_rating']
    dataPrice = data2021['price']
    maxm =  max(data2021['review_scores_rating'])
    minm = min(data2021['review_scores_rating'])
    dataRating = 10*((data2021["review_scores_rating"] - minm)/(maxm - minm)) 
    for i in range(len(dataIds)):
        tempDict = {'id':int(dataIds[i]), 'price':float(dataPrice[i]), 'rating': float(dataRating[i])}
        scatterData.append(tempDict)
        #scatterData.append([dataIds[i], dataPrice[i], dataRating[i]])
        # scatterData[str(dataIds[i])] = {}
        # scatterData[str(dataIds[i])]['price'] = dataPrice[i] 
        # scatterData[str(dataIds[i])]['rating'] = dataRating[i]
    #print("in scatterplot")
    #print(data)
    #print(type(dataPrice))
    #data=  [{'id': 1,'x': 45, 'y': 50}, {'id': 2,'x': 200, 'y': 200}, {'id': 3,'x': 300, 'y': 300}
    return jsonify(scatterData)

#def sendScatterPlotData():
#    scatterData={}
    # dataIds = data2021['id']
    # dataPrice = data2021['price'].str.replace('$','')
    # dataRating = data2021['review_scores_rating']
    # #scatterData["price"] = dataPrice.str.replace(',','').astype(float).to_list()
    # #scatterData["ratings"] = dataRating.to_list()
    # for i in range(len(dataIds)):
    #     scatterData[str(dataIds[i])] = {}
    #     scatterData[str(dataIds[i])]['price'] = dataPrice[i] 
    #     scatterData[str(dataIds[i])]['rating'] = dataRating[i]
    # #print("in scatterplot")
    # #print(data)
    # #print(type(dataPrice))
    # return jsonify(scatterData)

if __name__ == "__main__":
    app.run(debug=True)
    