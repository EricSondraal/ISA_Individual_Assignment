const http = require('http');
const url = require('url');
const mysql = require('mysql');

const PUT = 'PUT';
const POST = 'POST';
const GET = 'GET';
const DELETE = 'DELETE';
const OPTIONS = 'OPTIONS';

//amount of questions on screen
let questionCount = 0;
//total amount of ansers created
let answerCount = 0;

let db;
handleDisconnect();



//drop answers table
// const dropAnswersTableQuery = "DROP TABLE answers";
// db.query(dropAnswersTableQuery, (err,result)=>{
// 	if (err) throw err;
// 	//console.log("'answers' Table Dropped");
// 	console.log(dropAnswersTableQuery);
// });

// //drop questions table
// const dropQuestionsTableQuery = "DROP TABLE questions";
// db.query(dropQuestionsTableQuery, (err,result)=>{
// 	if (err) throw err;
// 	//console.log("'questions' Table Dropped");
// 	console.log(dropQuestionsTableQuery);
// });


//Create the questions table
const createQuestionsTableQuery = [
	'CREATE TABLE IF NOT EXISTS questions',
	'(id INT PRIMARY KEY,',
	'question VARCHAR(511),',
	'rightAnswer INT,',
	'answerCount INT)'
].join(' ');
db.query(createQuestionsTableQuery, (err,result)=>{
	if (err) throw err;
	//console.log('Questions Table Created');
	console.log(createQuestionsTableQuery);
});

//Create the answers table
const createAnswersTableQuery = [
	'CREATE TABLE IF NOT EXISTS answers',
	'(id INT PRIMARY KEY,',
	'qID INT,',
	'aID INT,',
	'answer VARCHAR(511),',
	'CONSTRAINT FK_QLink FOREIGN KEY (qID) REFERENCES questions (id))'
].join(' ');
db.query(createAnswersTableQuery, (err,result)=>{
	if (err) throw err;
	//console.log('Answers Table Created');
	console.log(createAnswersTableQuery);
});


//CREATE THE SERVER
http.createServer(function(req, res) {



	let qURL = url.parse(req.url, true);

	console.log(req.url + "::" + req.method);

	//OPTIONS REQUEST
	if (req.method === OPTIONS) {
		var headers = {};
		// IE8 does not allow domains to be specified, just the *
		// headers["Access-Control-Allow-Origin"] = req.headers.origin;
		headers["Access-Control-Allow-Origin"] = "*";
		headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
		headers["Access-Control-Allow-Credentials"] = false;
		headers["Access-Control-Max-Age"] = '86400'; // 24 hours
		headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
		res.writeHead(200, headers);
		res.end();
  	} 

	//POST REQUEST
	else if(req.method === POST){
		// convert Buffer to string
		let body = '';
		req.on('data', chunk => {
			body += chunk; 
		});
		req.on('end', () => {
			console.log(body);
			//Create a table request
			if(qURL.pathname =="/questions"){
				let questionData = JSON.parse(body);
		
		


				//Insert the question
				const insertQuestionQuery = "INSERT INTO questions (id, question, rightAnswer, answerCount) VALUES ("+questionData.qID +",'"+questionData.question+"', "+questionData.right+","+questionData.count+")";
				db.query(insertQuestionQuery, (err,result)=>{
					if (err) throw err;
					//console.log("Record Inserted Into 'questions'");
					console.log(insertQuestionQuery);
				});

				//Insert the answers
				let i;
				for(i=0;i<questionData.count;i++){
					const insertAnswerQuery = "INSERT INTO answers (id, qID, aID, answer) VALUES ("+answerCount++ +","+questionData.qID+", "+i+",'"+questionData.answers[i]+"')";
					db.query(insertAnswerQuery, (err,result)=>{
						if (err) throw err;
						//console.log("Record Inserted Into 'answers'");
						console.log(insertAnswerQuery);
					});
				}


				res.writeHead(200, {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
				});

				
				res.end('COMPLETE');
			}
		});
	}

	//PUT REQUEST
	else if(req.method === PUT){
		// convert Buffer to string
		let body = '';
		req.on('data', chunk => {
			body += chunk; 
		});
		req.on('end', () => {
			console.log(body);
			//Create a table request
			if(qURL.pathname =="/questions"){
				let questionData = JSON.parse(body);
		
		

				//Retrieve question data
				const retrieveQuestionsQuery = "SELECT * FROM questions WHERE id = "+questionData.qID;
				db.query(retrieveQuestionsQuery, (errQ,resultQ,fieldsQ)=>{
					if (errQ) throw errQ;
					console.log(retrieveQuestionsQuery);
					
					//for(g=0;g<resultQ[i]['answerCount'];g++){

					let oldAnswerSize=resultQ[0]['answerCount'];
					let newAnswerSize=questionData.count;
					let lowestBetweenTwo = oldAnswerSize < newAnswerSize ? oldAnswerSize : newAnswerSize;
					let i;
					//update answers
					console.log("lowestBetweenTwo: " + lowestBetweenTwo);
					for(i=0;i<lowestBetweenTwo;i++){
						const insertAnswerQuery = "UPDATE answers SET answer='"+questionData.answers[i]+"' WHERE qID="+questionData.qID+" AND aID="+i;
						
						db.query(insertAnswerQuery, (err,result)=>{
							if (err) throw err;
							//console.log("Record Updated In 'answers'");
							console.log(insertAnswerQuery);
						});
					}

					//delete answers
					for(i=lowestBetweenTwo;i<oldAnswerSize;i++){
						const insertAnswerQuery = "DELETE FROM answers WHERE qID="+questionData.qID+" AND aID="+i;
						db.query(insertAnswerQuery, (err,result)=>{
							if (err) throw err;
							//console.log("Record Deleted From 'answers'");
							console.log(insertAnswerQuery);
						});
					}
					//create answers
					for(i=lowestBetweenTwo;i<newAnswerSize;i++){
						const insertAnswerQuery = "INSERT INTO answers (id, qID, aID, answer) VALUES ("+answerCount++ +","+questionData.qID+", "+i+",'"+questionData.answers[i]+"')";
						db.query(insertAnswerQuery, (err,result)=>{
							if (err) throw err;
							//console.log("Record Inserted Into 'answers'");
							console.log(insertAnswerQuery);
						});
					}

					//Update the question
					const insertQuestionQuery = "UPDATE questions SET question='"+questionData.question+"', rightAnswer="+questionData.right+", answerCount="+questionData.count+" WHERE id = "+questionData.qID;
					//console.log(insertQuestionQuery);
					db.query(insertQuestionQuery, (err,result)=>{
						if (err) throw err;
						//console.log("Record Updated In 'questions'");
						console.log(insertQuestionQuery);
					});

					//Update the answers
	

					



					res.writeHead(200, {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
						'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
					});

					
					res.end('COMPLETE');



				});


			}
		});
	}



	
	//DELETE REQUEST
	else if(req.method === DELETE){
		// convert Buffer to string
		let body = '';
		req.on('data', chunk => {
			body += chunk; 
		});
		req.on('end', () => {
			console.log(body);
			//Create a table request
			if(qURL.pathname =="/questions"){
				let questionData = body;
		
		
				//Delete the answers
				const deleteAnswersQuery = "DELETE FROM answers WHERE qID="+questionData;
				
				db.query(deleteAnswersQuery, (err,result)=>{
					if (err) throw err;
					//console.log("Record(s) Deleted From 'answers'");
					console.log(deleteAnswersQuery);
				});

				//Delete the question
				const deleteQuestionQuery = "DELETE FROM questions WHERE id="+questionData;
				
				db.query(deleteQuestionQuery, (err,result)=>{
					if (err) throw err;
					//console.log("Record Deleted From 'questions'");
					console.log(deleteQuestionQuery);
				});





				res.writeHead(200, {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
				});

				
				res.end('COMPLETE');
			}
		});
	}


	//GET REQUEST
	else if(req.method === GET){
		//Retrieve data
		const retrieveQuestionsQuery = "SELECT * FROM questions";
		db.query(retrieveQuestionsQuery, (errQ,resultQ,fieldsQ)=>{
			if (errQ) throw errQ;
			console.log(retrieveQuestionsQuery);
			const retrieveAnswersQuery = "SELECT * FROM answers";
			db.query(retrieveAnswersQuery, (errA,resultA,fieldsA)=>{
				if (errA) throw errA;
				console.log(retrieveAnswersQuery);

				// console.log("id: " + result[0]['id']);
				// console.log("qID: " + result[0]['qID']);
				// console.log("aID: " + result[0]['aID']);
				// console.log("answer: " + result[0]['answer']);
				let packetMessage = [];
				let i;
				let answerCurrentIndex=0;
				for(i=0;i<resultQ.length;i++){
					let packetMessageAnswers = [];

					let realQuestionID = resultQ[i]['id'];

					let g;
					for(g=0;g<resultA.length;g++){
						//look for answers from the question we are currently on (in the outer loop)
						realAnswerID = resultA[g]['id'];
						console.log(resultA[g]['qID'] + " = " + realQuestionID);
						if(resultA[g]['qID']==realQuestionID){
							packetMessageAnswers.push(resultA[g]['answer']);
						}


						
					}

					packetMessage.push(
						{
							question:resultQ[i]['question'],
							answers: packetMessageAnswers,
							right:resultQ[i]['rightAnswer']
						}
					);
				}



				res.writeHead(200, {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
				});

				
				res.end(JSON.stringify(packetMessage));

			});
		});
	}





}).listen(process.env.PORT || 5000);


function handleDisconnect() {
	//open the connection again
    db = mysql.createConnection({
		host: 'us-cdbr-east-03.cleardb.com',
		user:'b41e21c9a78ca8',
		password:'c267fe5c',
		database:'heroku_768bf2b64b24b57'
	});
    db.connect( function onConnect(err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000);
        }
    });

    db.on('error', function onError(err) {
        //console.log('db error', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}
