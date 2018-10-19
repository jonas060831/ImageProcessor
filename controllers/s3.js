const AWS = require('aws-sdk')

AWS.config.apiVersions = {
  s3: process.env.S3_API_VERSION,
};

AWS.config.update({
  region: process.env.DEV_S3_REGION,

});

const s3 = new AWS.S3();

//put object s3 func
const putObject = (body, bucket, key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Body: body,
      Bucket: bucket,
      Key: key,
     };
     s3.putObject(params, (err, data) => {
       if (err) reject(err); // an error occurred
       else {
          resolve(data)// successful response
       }
     });
  })
}
//get object s3 func
const getObject = (bucket, key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: key,
     };
     s3.getObject(params, (err, data) => {
       if (err) reject(err); // an error occurred
       else {
          resolve(data)// successful response
       }
     });
  })
}
//delete object s3 func
const deleteObject = (bucket, key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: key
     };
     s3.deleteObject(params, (err, data) =>{
       if (err) reject(err); // an error occurred
       else {
         resolve(data)// successful response
       }
     });
  })
}

module.exports = {
  putObject,
  getObject,
  deleteObject
}
