const multipart = require('parse-multipart');
const uWS = require('uWebSockets.js');
const db = require('./db.js');
const fs = require('fs');

const PORT = 3000;

global.app = uWS./*SSL*/App().listen(PORT, (token) => {
    if (token) {
        console.log('Server Listening to Port ' + PORT);
    } else {
        console.log('Failed to Listen to Child Server ' + PORT);
    }
});

app.get('/', (res, req) => {
    res.cork(() => {
        const path = './testingclient/index.html';
    
        if (fs.existsSync(path)) {
            const file = fs.readFileSync(path);
            res.end(file);
        } else {
            res.writeStatus('404 Not Found');
            res.end();
        }
    })
});

app.get('/test', (res, req) => {
    const downloadStream = db.getFile('test.js');

    downloadStream.on('data', (chunk) => {
        res.cork(() => {
            res.write(chunk);
        })
    });

    downloadStream.on('end', () => {
        res.cork(() => {
            res.end();
        })
    });

    downloadStream.on('error', (error) => {
        res.cork(() => {
            console.error('Error fetching file from GridFS:', error);
            res.status(500).send('Internal Server Error');
        })
    });

    res.onAborted(() => {
        res.cork(() => {
            res.end('File download aborted');
        })
    });

    res.cork(() => {
        res.writeHeader('Content-Disposition', `filename="test.js"`);
    })
})

app.post('/upload', (res, req) => {
    console.log('post recieved!');

    // res.writeHeader('Access-Control-Allow-Origin', '*');
    // res.writeHeader('Access-Control-Allow-Methods', 'POST');
    // res.writeHeader('Access-Control-Allow-Headers', 'Content-Type');

    const boundary = req.getHeader('content-type').split('boundary=')[1];

    let buffer = Buffer.alloc(0);
  
    // handle data streaming
    res.onData((ab, isLast) => {
        let chunk = Buffer.from(ab);
        buffer = Buffer.concat([buffer, chunk]);
  
        if (isLast) {
            // Extract the file content using parse-multipart
            const parts = multipart.Parse(buffer, boundary);

            // Assume the first part is the file
            const fileContent = parts[0].data;

            db.uploadFile(fileContent);
        }
    });
    
    res.onAborted(() => {
        // Request was aborted, clean up if necessary
        res.end('File upload aborted');
    });
});

// we'll have a post request handler here that will take file content and upload it to the db
//onPost: db.uploadFile(data);

// app.get("/:filename", (res, req) => {
//     const path = 'src/client' + req.getUrl();
    
//     // Check if the file exists
//     if (fs.existsSync(path)) {
//         // Read and serve the file
//         const file = fs.readFileSync(path);
//         res.end(file);
//     } else {
//         // File not found
//         res.writeStatus('404 Not Found');
//         res.end();
//     }
// });

const nodecallspython = require("node-calls-python");

const py = nodecallspython.interpreter;

py.import("./AI/main.py").then(async function(pymodule) {
    // we have no idea when the db finishes connecting, let's wait 3s
    setTimeout(async () => {
        const result = await py.call(pymodule, "magnificent_ai", "65b724abb0dbba1b7b2fc936");
        console.log(result);
    }, 3000)
});