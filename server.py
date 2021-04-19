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

data2021 = pd.read_csv("./data/listings_2019.csv")
print(data2021.columns)
# borough = data2021['neighbourhood_group_cleansed'].tolist()
# print(data2021['neighbourhood_group_cleansed'].unique())

@app.route("/")
def init():
    return render_template('index.html')


@app.route("/test",methods = ['POST', 'GET'])
def test():
	return "test message"

@app.route("/Borough",methods = ['POST','GET'])
def sendBorough():
    borough = dict()
    mylist=data2021['neighbourhood_group_cleansed'].tolist()
    borough['Manhattan']=mylist.count("Manhattan")
    borough['Queens']=mylist.count("Queens")
    borough['Bronx']=mylist.count("Bronx")
    borough['Brooklyn']=mylist.count("Brooklyn")
    borough['Staten Island']=mylist.count("Staten Island")
    return jsonify(borough)

@app.route("/line",methods= ['POST','GET'])
def sendLine():
    print(data2021['availability_365'].unique())
    data = data2021['availability_365']
    mylist=data2021['availability_365'].tolist()
    data= dict()
    for i in range(365):
        data[i] = mylist.count(i)
    print(data)
    return data

if __name__ == "__main__":
    app.run(debug=True)
    