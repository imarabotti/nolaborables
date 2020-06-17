'use strict';
const { spawn } = require('child_process');
const http = require('http');

exports.handler = async (event) => {
    
	let response;

	const subprocess = spawn(
	  'sh',
	  [
	    '-c',
	    `NODE_PATH=. node index.js`
	  ], {
	    stdio: ['inherit', 'inherit', 'inherit']
	  }
	);

	setTimeout(() => {
		http.get('http://0.0.0.0:1337/api/v2/feriados/2016', (resp) => {
			let data = '';

			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
			  data += chunk;
			});

			// The whole response has been received. Print out the result.
			resp.on('end', () => {
			  response = {
			      statusCode: 200,
			      body: JSON.stringify(JSON.parse(data)),
			  };
			});
		}).on("error", (err) => {
			console.log("Error: " + err.message);
		});
	}, 1000);


	setTimeout(() => {
	  subprocess.kill(); // Does not terminate the node process in the shell
	}, 2000);

    return response;
};
