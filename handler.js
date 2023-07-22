'use strict';

const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'ca-central-1', maxRetries: 3, httpOptions: {timeout: 5000} });

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

const send = (statusCode, data)=>{

  return {
    statusCode,
    body: JSON.stringify(data)
  }
}

module.exports.createNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let data = JSON.parse(event.body)

  try{
    const params = {
      TableName: NOTES_TABLE_NAME,
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body
      },
      ConditionExpression: "attribute_not_exists(notesId)"
    }

    await documentClient.put(params).promise();

    cb(null, send(201, data))
  } 
  catch(err){
    cb(null, send(500, err.message))
  }
};

module.exports.updatNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let id = event.pathParameters.id;
  let data = JSON.parse(event.body)

  try{
    let params = {
      TableName: NOTES_TABLE_NAME,
      Key: { notesId: id, },
      UpdateExpression: "set #title = :title, #body = :body",
      ExpressionAttributeNames:{
        "#title": "title",
        "#body": "body"
      },
      ExpressionAttributeValues:{
        ":title": data.title,
        ":body": data.body
      },
      ConditionExpression: "attribute_exists(notesId)"
    }
    await documentClient.update(params).promise();
    
    cb(null, send(200, data))
  }
  catch(err){
    cb(null, send(500, err.message))
  }

};

module.exports.deleteNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let id = event.pathParameters.id;

  try{
    let params = {
      TableName: NOTES_TABLE_NAME,
      Key: { notesId: id, },
      ConditionExpression: "attribute_exists(notesId)"
    }
    await documentClient.delete(params).promise();
    
    cb(null, send(200, notesId))
  }
  catch(err){
    cb(null, send(500, err))
  }

};

module.exports.getAllNotes = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try{
    // console.log('Incoming event:', JSON.stringify(event));
    let params = {
      TableName: NOTES_TABLE_NAME
    }
    const notes = await documentClient.scan(params).promise();
    // console.log('Retrieved notes:', JSON.stringify(notes));
    cb(null, send(200, notes))
  }
  catch(err){
    cb(null, send(500, err.message))
  }
};