"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = require("./util/util.js");
var fs = require('fs');
var path = require('path');
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Init the Express application
    const app = (0, express_1.default)();
    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(body_parser_1.default.json());
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
    app.get("/filteredimage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let imageUrl = req.query.image_url;
        let resFile;
        try {
            if (imageUrl) {
                console.log("Image Url : " + imageUrl);
                resFile = yield (0, util_1.filterImageFromURL)(imageUrl).catch(() => { console.log("Image could not be processed !"); });
                if (resFile) {
                    res.sendFile(resFile);
                    console.log("Image Processed Successfully !");
                    res.on('finish', () => {
                        var loadedImageFileNames = fs.readdirSync(__dirname + '/util/tmp/');
                        loadedImageFileNames.forEach((name, index) => {
                            const filePath = path.join(__dirname, '/util/tmp/' + name);
                            loadedImageFileNames[index] = filePath;
                        });
                        console.log("Loaded Image File Names : " + loadedImageFileNames);
                        if (loadedImageFileNames.length > 0) {
                            (0, util_1.deleteLocalFiles)((loadedImageFileNames)).catch(() => { console.log("Image could not be deleted, check the filename !"); });
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
    }));
    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send("try GET /filteredimage?image_url={{}}");
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map