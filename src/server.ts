import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
var fs = require('fs');
var path = require('path');
(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage", async (req, res) => {
    let imageUrl = req.query.image_url;
    let resFile;
    try {
      if (imageUrl) {
        console.log("Image Url : " + imageUrl);
        resFile = await filterImageFromURL(imageUrl as string).catch(() => { console.log("Image could not be processed !") });
        if (resFile) {
          res.sendFile(resFile);
          console.log("Image Processed Successfully !");
          res.on('finish', () => {
            var loadedImageFileNames: string[] = fs.readdirSync(__dirname + '/util/tmp/');
            loadedImageFileNames.forEach((name: string, index: number) => {
              const filePath = path.join(__dirname, '/util/tmp/' + name);
              loadedImageFileNames[index] = filePath;
            });
            console.log("Loaded Image File Names : " + loadedImageFileNames);
            if (loadedImageFileNames.length > 0) {
              deleteLocalFiles((loadedImageFileNames)).catch(() => { console.log("Image could not be deleted, check the filename !") });
            }
          });
        }
        else {
          res.status(500).send("Image could not be processed !");
        }
      }
      else {
        res.status(404).send("Image Url is needed !");
      }
    }
    catch (e) {
      res.status(500).send("Image could not be processed !" + e.toString());
    }

  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();