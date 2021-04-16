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

app = Flask(__name__)

@app.route("/")
def init():
    return render_template('index.html')


@app.route("/test",methods = ['POST', 'GET'])
def test():
	return "test message"


if __name__ == "__main__":
    app.run(debug=True)
    