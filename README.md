
<strong>ImageUploader</strong>

1. single image upload <br>
2. delete single image <br>
3. multiple image upload

<pre>
#required
1. configure .env variables in your project folder or
   in case of an ec2 instance in .bashrc whatever pleases you.
2. log in to your aws cli and provide credentials
3. create your s3 bucket
4. install gm on your ec2 instance with :
</pre>

```
sudo add-apt-repository ppa:dhor/myway
sudo apt-get update
sudo apt-get install graphicsmagick
sudo apt-get install imagemagick

```
<pre>
#note
1.when using env variables from .bashrc you can directly run node app.js
2.when using env variables from .env run node bin/dev
</pre>
