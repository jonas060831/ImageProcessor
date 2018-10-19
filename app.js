const s3 = require('./controllers/s3'); //AWS PUT,GET,DELETE object inside the specified bucket
const express = require('express');
const fileUpload = require('express-fileupload'); //so we can access the parameter name directly from the req.file
const cors = require('cors');
const uniqueString = require('unique-string'); //gives a unique set of strings
const unixTime = require('unix-time'); //gives a timestamp
const downloadsFolder = require('downloads-folder'); //Users Download Folder compatibility helper
const gm = require('gm').subClass({imageMagick: true}); //required

const app = express();

app.use(cors()); //use CORS so when the app is uploaded in ec2 it will work
app.options('*', cors());

app.use(fileUpload()); //so we can use the parameter name

//on this app we will create 4 routes uploading single,multiple image,download the image,delete the i
const PORT = 3000;

// process.env.TEST_STRING
// process.env.TEST_STRING2
// process.env.MY_S3_URL
// process.env.MY_S3_BUCKET
// process.env.S3_API_VERSION
// process.env.DEV_S3_REGION

//Uploading Image
app.post('/upload-image', function(req, res){

  if (!req.files){

        console.log('no image is being uploaded');
        res.status(400).send('no image is being uploaded.')
  } else {


    //deleting the original name and putting each character between period
    //use singleImage as name parameter.
    var filename =  req.files.singleImage.name.split(".");

    //a combination of uniqueString plus unixTimeStamp plus another uniqueString
    //getting the last period of the file type to lower case this will be the new filename pop the .fileExt from the name
    var newfilename = uniqueString() + '.'+ unixTime(new Date()) + '.'+ uniqueString() + '.' + filename.pop().toLowerCase();

    s3.putObject(req.files.singleImage.data, process.env.MY_S3_BUCKET , newfilename)
        .then(() => {
          //hardcode value
          console.log('image successfully uploaded');
          var imageURL = process.env.MY_S3_URL + newfilename;
          res.status(200).send(imageURL);
        })
        .catch(() => {
          console.log('there was an error while uploading the image');
          res.status(410).send('there was an error while uploading the image');
        })
    }
});


//Deleting the image
app.post('/delete-image', function(req, res) {

    //supply the image name inside the s3 bucket
    if(!req.body.deleteImage){
      console.log('no image name has been passed');
      res.status(400).send('no image name has been passed.');
    }else {
      //get the image first
      s3.getObject(process.env.MY_S3_BUCKET, req.body.deleteImage)
      .then((data) => {
        //once there is a match on the database then you can finally delete that buffer using s3.deleteObject
        s3.deleteObject(process.env.MY_S3_BUCKET, req.body.deleteImage)
        .then(() => {
          console.log('image successfully deleted');
          //just return a status code ok
           res.status(200).send('image successfully deleted');
        })
        .catch(() => {
          console.log('there is an error while deleting the image');
          res.status(400).send('there is an error while deleting the image');
        })
      })
      .catch(() => {
        console.log('no such file name');
        res.status(400).send("no such file name");
      })
    }
  });

//Uploading Multiple Images
app.post('/upload-multiple-images', function(req, res){

  if (!req.files){

        console.log('no images is being uploaded');
        res.status(400).send('no images is being uploaded.');
  }else {

    var filename = [];
    var newfilename = [];
    var imageURL = [];

      for (var i = 0; i < req.files.multipleImages.length; i++) {

        //add each file inside the array
        filename.push(req.files.multipleImages[i].name.split("."));

        //a combination of index number plus uniqueString plus unixTimeStamp plus another uniqueString
        //getting the last period of the file type to lower case this will be the new filename pop the .fileExt from the name
        newfilename.push(i + uniqueString() + '.'+ unixTime(new Date()) + '.'+ uniqueString() + '.' + filename[i].pop().toLowerCase());

        s3.putObject(req.files.multipleImages[i].data, process.env.MY_S3_BUCKET, newfilename[i])
            .then(() => {

              console.log("image successfully uploaded");
            })
            .catch(() => {
              console.log('there was an error while uploading the image');
            })
            //push each imageURL string in the imageURL array
            imageURL.push(process.env.MY_S3_URL + newfilename[i])
      }
      var json = JSON.stringify({
        imagesArray: imageURL
      });
      res.status(200).send(json);
  }
});

app.listen(PORT, function() {
      console.log("Listening on port: " + PORT);
});
