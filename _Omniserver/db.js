const { MongoClient, ServerApiVersion, GridFSBucket }= require('mongodb');

const credentials = 'cert.pem';
const client = new MongoClient('mongodb+srv://omni.afimhbq.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
  tlsCertificateKeyFile: credentials,
  serverApi: ServerApiVersion.v1
});

let db;
let connected = false;
let bucket;
let collection;

async function run() {
    try {
        await client.connect();

        db = client.db("Omni");
        bucket = new GridFSBucket(db);
        collection = db.collection("testCol");

        connected = true;
        console.log('connected to db!');
    } catch(e){
        console.log('mongo connecting error: ', e);
    }
}
run().catch(console.dir);

const isConnected = () => {return connected === true};
function until (condition, checkInterval=400) {
    if(!!condition()) return true;
    return new Promise(resolve => {
        let interval = setInterval(() => {
            if (!condition()) return;
            clearInterval(interval);
            resolve();
        }, checkInterval)
    })
}

// upload file to db from buffer
async function uploadFile(buffer){
    const uploadStream = bucket.openUploadStream('test.js'); // , {metadata: {field: 'testfield', value: 'testvalue'}}
    uploadStream.end(buffer);

    uploadStream.on('finish', () => {
        console.log('File uploaded to GridFS');
    });

    uploadStream.on('error', (error) => {
        console.error('Error uploading file to GridFS:', error);
    });
}

// async function addTestUserToDb(){
//     await until(isConnected);
//     const doc = {juicyData: [0, 1, 2], dateCreated: 1706501181592, weightedThemes: {games: 10, animations: 12, pron: 2}, iPromiseTheseNumbersMeanSomething: 1234, uploadedVideoIds: []};
//     const result = await collection.insertOne(doc);

//     console.log('inserted with userid: ' + result.insertedId, {result});
// }
// addTestUserToDb();

// fileName will be determined by the python ai thing, later
function getFile(filename){
    return bucket.openDownloadStreamByName(filename);
}

module.exports = {
    uploadFile,
    getFile
};