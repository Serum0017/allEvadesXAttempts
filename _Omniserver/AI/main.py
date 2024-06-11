from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
from gridfs import GridFS

db = None
collection = None
bucket = None

# your task @Paul: from the user's database id, return the index of the best video from the database.
# you will likely want to use some sort of sublinear algorithm because we could have millions of entries in the db
def magnificent_ai(userid):
    # here's how you would look up the user in the database
    print("User Data ", collection.find_one({"_id": ObjectId(userid)}))

    # here's how you get a game (stored as simply js code)
    print("Code Data ", bucket.get(ObjectId("65b711723d7e74008ce77f1f")).read())
    # see https://pymongo.readthedocs.io/en/stable/api/gridfs/index.html for more db stuff

    # return the best video id
    return 0

# connecting to the db
def connect_to_mongo():
    uri = "mongodb+srv://omni.afimhbq.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority"
    client = MongoClient(uri,
        tls=True,
        tlsCertificateKeyFile='cert.pem',
        server_api=ServerApi('1'))
    
    try:
        global db
        global collection
        global bucket
        db = client['Omni']
        collection = db['testCol']
        bucket = GridFS(db)
        print('connected to the db in python!')
    except Exception as e:
        print("python mongo connecting error: " + e)

connect_to_mongo()

# btw if you want to develop without having to install node-gyp and all this other fancy build stuff, just uncomment the following function:
# magnificent_ai("65b724abb0dbba1b7b2fc936")