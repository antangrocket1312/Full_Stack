import flask
from flask import request
import mysql.connector
import json
from flask_cors import CORS, cross_origin


mydb = mysql.connector.connect(
host="database-2.cl2nau7u0aaw.ap-southeast-1.rds.amazonaws.com",
port="3306",
user="admin",
password="thanh123",
database="mydb"
)

app = flask.Flask(__name__)

# insert api
def insert_students(name):
   mycursor = mydb.cursor(dictionary=True)
   mycursor.execute("insert into student(name) values('"+name+"')")
   mydb.commit()
@app.route('/students', methods=['POST'])
@cross_origin()
def insert():
   name = request.json['name']
   insert_students(name)
   return json.dumps(request.json)

# update api
def update_students(id, name):
   mycursor = mydb.cursor(dictionary=True)
   mycursor.execute("update student set name='"+name+"' where id="+str(id))
   mydb.commit()
@app.route('/students', methods=['PUT'])
@cross_origin()
def update():
   id = request.json['id']
   name = request.json['name']
   update_students(id, name)
   return json.dumps(request.json)

# delete api
def delete_students(id):
   mycursor = mydb.cursor(dictionary=True)
   mycursor.execute("delete from student where id="+str(id))
   mydb.commit()
@app.route('/students', methods=['DELETE'])
@cross_origin()
def delete():
   id = request.json['id']
   delete_students(id)
   return json.dumps(request.json)

# read api
def get_students():
   mycursor = mydb.cursor(dictionary=True)
   mycursor.execute("select * from student")
   myresult = mycursor.fetchall()
   return json.dumps( [dict(item) for item in myresult] , default=str)
@app.route('/students', methods=['GET'])
@cross_origin()
def get():
   return get_students()



#app.run(debug=True)
app.run(host= '0.0.0.0')
