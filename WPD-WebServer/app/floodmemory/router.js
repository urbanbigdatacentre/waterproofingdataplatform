var express     = require('express')
var path        = require('path')
var cors        = require('cors')
const graphql   = require('graphql.js')
// const _         = require('lodash')
const shortid   = require('shortid')
const multer    = require('multer')
const jwt       = require('jsonwebtoken')
const turf      = require('turf')
const booleanPointInPolygon = require('@turf/boolean-point-in-polygon').default
const moment    = require('moment')
const NodeGeocoder = require('node-geocoder');

const config    = require('../config')
const fmUtil    = require('./util')

var router = new express.Router()

const MAX_IMAGE_FILESIZE = 1000000;
const MAX_VIDEO_FILESIZE = 1000000;
const DELETE_OPERATION = 'delete';
const EDIT_OPERATION = 'edit';
const ASSET_TAG = '<input type="hidden" id="assets" value=';
// Response as list of pages (array)
let pagesResponse = {
  "pages": {
      "list": []
  }
}

/**
 * Checks for authentication of the user by jwt
 * Adds user's jwt to subsequent request's header which are fired to wiki graphql
 * Internal used function not an Endpoint function
 * @param {HTTP Request} req 
 */
function authenticateRequest(req) {
  let header = req.headers.authorization;

  if(! header) {
    // throw new Error('Authentication required');
    return false;
  }

  if(header.indexOf('Bearer') === -1) {
    header = 'Bearer ' + header
  }

  const graph = graphql(config.wikiApi.url, {
    headers: {
      "Authorization": header
    }
  });
  return graph;
}

/**
 * Decodes jwt toekn from request object and returns requested user's details
 * Internal function
 * 
 * @param {*} request object 
 */
function getReqUserDetails(req) {
  let header = req.headers.authorization;

  if(! header) {
    throw new Error('Authentication required');
  }

  // console.log(req.headers.authorization.split(' ')[1]);
  // console.log(req.headers.authorization);
  const decoded = jwt.decode(req.headers.authorization);
  // console.log('decoded = ', decoded);
  return decoded;
}

/**
 * Checks if the Creator of the page is the same as User request it to Edit/Delete it
 * Internal function 
 * 
 * @param {*} user user.id 
 * @param {*} op 
 * @param {*} pageDetails { pages: { single: { id: 10, creatorId: 3, creatorName: 'Abc' } } }
 */
function isOperationAllowed(user, op, pageDetails) {
  // console.log('>>> isOperationAllowed ', user, pageDetails)
  let allowed = false;
  // if(op === DELETE_OPERATION) {
    if( user.id === pageDetails.pages.single.creatorId ) {
      allowed = true;
    }
  // }
  return allowed
}

/**
 * Queries to get page details, specially creatorId
 * 
 * @param {*} graph graph object after authentication
 * @param {*} pageId 
 */
function getPageDetails(graph, pageId) {
  // console.log('>>> getPageDetails ', pageId)
  const query = graph(`{
    pages {
      single(id: ${pageId}) {
        id
        content
        creatorId
        creatorName
      }
    }
  }`);

  return query();
}

/**
 * Returns times for all Flood memories
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getFMTimes(req, res) {
  console.log('>>> FloodMemory >>> getFMTimes ');
  fmUtil.getStoriesList(req).then( 
    async result => {
      // get time from all FM
      // arange them in ascending order
      let sortedArray  = await fmUtil.sortPagesByTime(result.pages.list)
      sortedArray = await fmUtil.removePagesWithTime(sortedArray)
      // console.log('sortedArray = ', sortedArray)
      const available_times = await fmUtil.getTimeFromPages(sortedArray)
      // console.log(fmUtil.getTimeFromPages(sortedArray))
      let resObj = {
        available_times
      }
      res.send(resObj)
    },
    err => {
      console.error(err)
      res.status(500).send(err)
    }
  );
}

/**
 * Gets all Flood memories spatio-temporal filtered 
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getList(req, res) {
  console.log('>>> Floodmemory >>> getList ', req.body);
  fmUtil.getStoriesList(req).then(
    async result => {
      // console.log(JSON.stringify(result, null, 2));
      // console.log(result.pages.list)
      let filteredPages = await getFilteredFeatures(req.body.bbox, req.body.time, result.pages.list)
      pagesResponse.pages.list = filteredPages
      if(filteredPages.length === 0) {
        res.send(pagesResponse)
      }
      else {
        const sortedPagesByTime = await fmUtil.sortPagesByTime(filteredPages)
        pagesResponse.pages.list = sortedPagesByTime;
        res.send(pagesResponse)
      }
      
    },
    err => {
      console.error(err)
      res.status(500).send(err)
    }
  );
}

/**
 * Gets all Flood memories without apply and filter on it
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getAllFMList(req, res) {
  console.log('>>> Floodmemory >>> getAllFMList ', req.body);
  fmUtil.getStoriesList(req).then(
    async result => {
      // console.log(JSON.stringify(result, null, 2));
      // console.log(result.pages.list)
      /* let filteredPages = await getFilteredFeatures(req.body.bbox, req.body.time, result.pages.list)
      pagesResponse.pages.list = filteredPages
      if(filteredPages.length === 0) {
        res.send(pagesResponse)
      }
      else {
        const sortedPagesByTime = await fmUtil.sortPagesByTime(filteredPages)
        pagesResponse.pages.list = sortedPagesByTime;
        res.send(pagesResponse)
      } */
      pagesResponse.pages.list = result.pages.list.filter((page) => fmUtil.tryParseJSON(page.description))
      console.log(pagesResponse)
      res.send(pagesResponse)
    },
    err => {
      console.error(err)
      res.status(500).send(err)
    }
  );
}

function getFilteredFeatures(extent, reqtime, pages) {
  // console.log('getFeaturesWithin')
  // return new Promise((res, rej) => { 
  //   setTimeout(() => {
  //     console.log('inside timeout')
  //     res("timeout done")
  //   }, 2000)
  // })

  return new Promise((res, rej) => { 
    let filtered = pages.filter((page) => {
      let desc = fmUtil.tryParseJSON(page.description)
      // const desc = getAssetsFromContent(pageToDelete.pages.single.content)

      if(!desc) {
        return;
      }

      // Spatial filter
      const point = turf.point([desc.location.longitude, desc.location.latitude])
      const polygon = turf.bboxPolygon(extent)
      // return booleanPointInPolygon(point, polygon)
      const spatiallyWithin = booleanPointInPolygon(point, polygon)

      // Temporal filter
      // check if page's time falls in requested date's month
      // currently returning for entire month
      const temporalWithin = moment(desc.time).isBetween(
        new moment(reqtime).startOf('month').format("YYYY-MM-DD"),
        new moment(reqtime).endOf('month').format("YYYY-MM-DD"),
        null,
        '[]'
      )
      // return temporalWithin

      return spatiallyWithin && temporalWithin
    })
    console.log('# of All pages = ',pages.length)
    console.log('# of Pages after filter (spatial and temporal) = ',filtered.length)
    // console.log('filtered = ', filtered)
    res(filtered)
  })
}



function getPage(req, res) {
  console.log('>>> Floodmemory >>> getPage');
  // console.log('req = ',req.body); // for post request
  // console.log('req = ',req.query); // for get request

  let graph = authenticateRequest(req);
    
  if(! graph) {
    console.error('No Header found')
    // return res.status(500).send('No Header found')
    // throw new Error('No Header found')
    // Resolving #14. User should be able to view FM even without login
    login().then(
      resData => {
        // mimic req
        const tempReq = {
          headers: {
            authorization: 'Bearer ' + resData.authentication.login.jwt
          }
        };

        graph = authenticateRequest(tempReq);
        // const graph = authenticateRequest(req);
        getPageQuery(graph, req.query.id, res)
      },
      err => {
        console.error(err)
        res.status(500).send(err)
      }
    );
  } else {
    getPageQuery(graph, req.query.id, res)
  }

}

function getPageQuery(objGraph, pageId, res) {
  // const pageId = req.query.id;
  console.log('>>> getPageQuery ', pageId)
  if(! pageId) {
    // throw new Error('No page id provided')
    console.log('No page id provided')
    return res.status(500).send('No page id provided')
  }

  const query = objGraph(`{
    pages {
      single(id: ${pageId}) {
        id
        title
        description
        render
        creatorId
        creatorName
      }
    }
  }`);

  query().then(
    resData => {
      // console.log(JSON.stringify(resData, null, 2));
      console.log('response sent');
      res.send(resData);
    },
    err => {
      console.error(err)
      res.status(500).send(err)
    }
  );
}
      

async function createPage(req, res) {
  console.log('>>> Floodmemory >>> createPage');
  const graph = authenticateRequest(req);
    
  if(! graph) {
    console.error('No Header found')
    return res.status(500).send('No Header found')
    // throw new Error('No Header found')
  }

  // get input params
  // console.log(req.body);

  // if address found then get lat/lon location of it
  if(! req.body.address) {
    // throw new Error('No Address or location found')
    return res.status(500).send('No Address or location found')
  }

  if(! req.body.time) {
    // throw new Error('No Time found')
    return res.status(500).send('No Time found')
  }
  // let geocodeData = await getGeocode(req.body.address);

  // dummy data object
  let desc = {"location": {"latitude":19.5345243,"longitude":79.2523452}};
  // if(geocodeData) {
  //   desc.location.latitude = geocodeData[0].latitude;
  //   desc.location.longitude = geocodeData[0].longitude;
  // } else {
  //   desc.location.latitude = -23.5506507;
  //   desc.location.longitude = -46.6333824;
  // }
  desc.location.latitude = req.body.address[1];
  desc.location.longitude = req.body.address[0];

  // TODO: decide whether to accept time as moment object
  desc.time = req.body.time
  // creatorID also a part of description
  desc.creatorId = req.body.creatorId
  // console.log('after await ... desc = ', desc)
  const bodyDescription = Object.assign({}, desc);

  // add assets also 
  let assets = {"location": {"latitude":19.5345243,"longitude":79.2523452}};
  assets.time = req.body.time
  assets.location.latitude = req.body.address[1];
  assets.location.longitude = req.body.address[0];
  assets.videos = req.body.videos ? req.body.videos : []
  assets.images = req.body.images ? req.body.images : []
  assets.audios = req.body.audios ? req.body.audios : []
  assets.isApproxDate = req.body.isApproxDate

  // const locTimInDesc = addExtraBackSlash(JSON.stringify(locationNTime));
  
  // description: "{"location": {"latitude":19.5345243,"longitude":79.2523452},"time":"1995-12-25"}",
  // description: "{\"location\": {\"latitude\":19.5345243,\"longitude\":79.2523452},\"time\":\"1995-12-25\"}",
  // description: "{\\"location\\": {\\"latitude\\":19.5345243,\\"longitude\\":79.2523452},\\"time\\":\\"1995-12-25\\"}",

  const query = graph(`mutation ($content: String!, 
    $title: String!, 
    $description: String!,
    $path: String!) {
    pages {
      create(
        content: $content,
        title: $title,
        description: $description,
        path: $path,
        isPublished: true,
        tags: ["stories"],
        editor: "code",
        isPrivate: false,
        locale: "en"
      ) {
        responseResult {
          succeeded
          errorCode
          message
        }
        page {
          id
          path
        }
      }
    }
  }`);

  let content = `<p>${req.body.content}</p>
    <input type="hidden" id="assets" value=${JSON.stringify(assets)}>
  ` 
  // console.log({content: content,
  //   title: req.body.title,
  //   // description: req.body.description,
  //   description: bodyDescription,
  //   path: `userStory/${shortid.generate()}`})

  query({
    content: content,
    title: req.body.title,
    // description: req.body.description,
    description: JSON.stringify(bodyDescription),
    path: `userStory/${shortid.generate()}`
  }).then(
    resData => {
      // console.log(JSON.stringify(resData, null, 2));
      res.send(resData);
    },
    err => {
      console.error(err)
      res.status(500).send(err)
    }
  );
}

async function editPage(req, res) {
  console.log('>>> Floodmemory >>> editPage');
  const graph = authenticateRequest(req);
    
  if(! graph) {
    console.error('No Header found')
    return res.status(500).send('No Header found')
    // throw new Error('No Header found')
  }

  let desc = {"location": {"latitude":19.5345243,"longitude":79.2523452}};
  desc.location.latitude = req.body.address[1];
  desc.location.longitude = req.body.address[0];

  // TODO: decide whether to accept time as moment object
  desc.time = req.body.time
  // creatorID also a part of description
  desc.creatorId = req.body.creatorId
  const bodyDescription = Object.assign({}, desc);

  // const locTimInDesc = addExtraBackSlash(JSON.stringify(locationNTime));
  // console.log('locTimInDesc = ', locTimInDesc)

  // check whether user is allowed to do this operation
  const reqUserDetails = getReqUserDetails(req);
  // console.log('reqUserDetails = ', reqUserDetails)
  const pageToDelete = await getPageDetails(graph, req.body.id);
  // { pages: { single: { id: 10, creatorId: 3, creatorName: 'Abc' } } }
  // console.log('pageToDelete = ', pageToDelete);

  const allowed = isOperationAllowed(reqUserDetails, EDIT_OPERATION, pageToDelete)
  if(! allowed ) {
    res.status(500).send(`User not allowed to ${EDIT_OPERATION} this page`)
    throw new Error(`User not allowed to ${EDIT_OPERATION} this page`)
  }

  // prepare assest to be part of content in hidden input
  let assets = {"location": {"latitude":19.5345243,"longitude":79.2523452}};
  assets.time = req.body.time
  assets.location.latitude = req.body.address[1];
  assets.location.longitude = req.body.address[0];
  assets.videos = req.body.videos ? req.body.videos : []
  assets.images = req.body.images ? req.body.images : []
  assets.audios = req.body.audios ? req.body.audios : []
  assets.isApproxDate = req.body.isApproxDate

  let content = `<p>${req.body.content}</p>
    <input type="hidden" id="assets" value=${JSON.stringify(assets)}>
  ` 

  const query = graph(`mutation (
    $content: String!, 
    $title: String!, 
    $description: String!) {
    pages {
      update(
        id: ${req.body.id},
        content: $content,
        title: $title,
        description: $description,
        isPublished: true,
        tags: ["stories"]
      ) {
        responseResult {
          succeeded
          errorCode
          message
        }
        page {
          id
          path
        }
      }
    }
  }`);

  query({
    content: content,
    title: req.body.title,
    // description: req.body.description,
    description: JSON.stringify(bodyDescription)
  }).then(
    resData => {
      // console.log(JSON.stringify(resData, null, 2));
      res.send(resData);
    },
    err => {
      console.error(err)
      res.status(500).send(err)
    }
  );

}

async function deletePage(req, res) {
  console.log('>>> Floodmemory >>> deletePage ');
  let graph = null;
  
  try {
    let pageId = null;
    graph = authenticateRequest(req);
    
    if(! graph) {
      console.error('No Header found')
      return res.status(500).send('No Header found')
      // throw new Error('No Header found')
    }

    if(! req.query.id) {
      console.error('No page id provided')
      return res.status(500).send('No page id provided')
      // throw new Error('No page id provided')
    } 
    pageId = parseInt(req.query.id)

    // check whether user is allowed to do this operation
    const reqUserDetails = getReqUserDetails(req);
    // console.log('reqUserDetails = ', reqUserDetails)
    const pageToDelete = await getPageDetails(graph, pageId);
    // { pages: { single: { id: 10, creatorId: 3, creatorName: 'Abc' } } }
    // console.log('pageToDelete = ', pageToDelete);

    const allowed = isOperationAllowed(reqUserDetails, DELETE_OPERATION, pageToDelete)
    if(! allowed ) {
      return res.status(500).send(`User not allowed to ${DELETE_OPERATION} this page`)
      // throw new Error(`User not allowed to ${DELETE_OPERATION} this page`)
    }

    // check for any assets present on the page than delete those assets too
    // assets are written in descrition
    // console.log(pageToDelete.pages.single.content);
    const assetsOnPage = getAssetsFromContent(pageToDelete.pages.single.content)
    const assetsCollection = [...assetsOnPage.images, ...assetsOnPage.audios, ...assetsOnPage.videos]

    if(assetsCollection.length > 0) {
      // delete assets on the page
      await deleteAssets(graph, assetsCollection)
    } else {
      // console.log('No hidden tag found')
      console.log('No Assets on page')
    }

    // fire delete mutation
    console.log('firing delete query', pageId)

    const query = graph.mutate(`{
      pages {
        delete (id: ${pageId}) {
          responseResult {
            succeeded
            errorCode
            message
          }
        }
      }
    }`);

    query().then(
      resData => {
        // console.log(JSON.stringify(resData, null, 2));
        console.log('Flood memory deleted')
        res.send(resData);
      },
      err => {
        console.error(err)
        res.status(500).send(err)
      }
    );
  } catch(e) {
    console.log('Generic error ', e)
    res.status(500).send(`Falied to perform ${DELETE_OPERATION} this page`)
  }
}

/**
 * Gets assets string from pages content's hidden html tag
 * Internal function
 * 
 * @param {*} strContent 
 */
function getAssetsFromContent(strContent) {
  // console.log('>>> getAssetsFromContent ', strContent)
  strContent = strContent.trim()
  const startIndex = strContent.indexOf(ASSET_TAG)
  let assets = JSON.parse(strContent.substring(startIndex + ASSET_TAG.length, strContent.length - 1))
  // console.log("assets  = ",assets)

  return assets;
}

/**
 * Takes array of assets and deletes them individually
 * Internal function
 * 
 * @param {*} graph Graph object to fire query
 * @param {*} assets Array of assets
 */
async function deleteAssets(graph, assets) {
  // console.log('>>> deleteAssets ',assets)
  for(var i = 0; i < assets.length; i++) {
    await deleteAsset(graph, assets[i].id)
  }
  console.log('Assets deleted....')
}

/**
 * Deletes individual assets
 * Internal function
 * 
 * @param {*} graph Graph object to fire query
 * @param {*} assetId Assets's ID to be deleted
 */
function deleteAsset(graph, assetId) {
  console.log('deleteAsset = ', assetId)
  const query = graph.mutate(`{
    assets {
      deleteAsset(id: ${assetId}){
        responseResult {
          succeeded
          errorCode
          message
        }
      }
    }  
  }`)

  return query().then(
    resData => {
      // console.log(JSON.stringify(resData, null, 2));
      // res.send(resData);
      console.log(`Asset ID ${assetId} deleted`);
    },
    err => {
      console.error(err)
      res.status(500).send(err)
    }
  ); 
}

function deleteAssetRequestHandler(req, res) {
  console.log('>>> Floodmemory >>> deleteAssetRequest');
  // const graph = authenticateRequest(req);
  graph = authenticateRequest(req);
    
  if(! graph) {
    console.error('No Header found')
    return res.status(500).send('No Header found')
    // throw new Error('No Header found')
  }

  if(! req.body.assetID) {
    // res.status(500).send('No page id provided')
    throw new Error('No asset id provided')
  } 

  console.log(' Deleting asset ID = ', req.body.assetID)
  const query = graph.mutate(`{
    assets {
      deleteAsset(id: ${req.body.assetID}){
        responseResult {
          succeeded
          errorCode
          message
        }
      }
    }
  }`);

  query().then(
    resData => {
      // console.log(JSON.stringify(resData, null, 2));
      res.send(resData);
    },
    err => {
      console.error(err)
      res.status(500).send(err)
    }
  );
}

/**
 * 
 * @param {*} graph Graph object to fire query
 */
function getAssetList(req, res) {
  console.log('>>> getAssetList ', req.body)
  const graph = graphql(config.wikiApi.url);
  const query = graph(`{
    assets {
      list(
        folderId: ${req.body.folderId},
        kind: ALL
      ) {
        id
        filename
      }
    }
  }`);

  query().then(
    result => {
      console.log(JSON.stringify(result, null, 2));
      res.send(result);
    },
    err => {
      console.error(err)
      res.status(500).send(err)
    }
  );
  //  return await query();
}

/**
 * Set The Storage Engine
 * Internal function
 */
const storage = multer.diskStorage({
  destination: __dirname + '/uploads/images',
  filename: function(req, file, cb){
    cb(null,file.originalname.split('.')[0] + '-' + Date.now() + path.extname(file.originalname));
  }
});

/**
 * Init Upload (multer)
 * Internal function
 * 
 */
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_IMAGE_FILESIZE },
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('mediaUpload');

/**
 * Check for image File Type
 * Internal function
 * 
 * @param {file} file 
 * @param {function} cb 
 */
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

function uploadVideo(req, res) {
  console.log(req.body);
  
}

function uploadImage(req, res) {
  console.log('>>> Floodmemory >>> uploadImage ')
  upload(req, res, (err) => {
    if(err){
      // res.render('index', {
      //   msg: err
      // });
      if (err instanceof multer.MulterError) {
        console.error(err)
        res.status(500).send(err.message)
      } else {
        console.error(err)
        res.status(500).send(err)
      }
    } else {
      if(req.file == undefined){
        // res.render('index', {
        //   msg: 'Error: No File Selected!'
        // });
        console.error('Error: No File Selected!', req)
        res.status(500).send('Error: No File Selected!')
      } else {
        // res.render('index', {
        //   msg: 'File Uploaded!',
        //   file: `uploads/${req.file.filename}`
        // });
        console.log('File Uploaded!')
        res.send({
          msg: 'File Uploaded!',
          file: `images/${req.file.filename}`
        })
      }
    }
  });
}

function getUserCreatedPages(req, res) {
  console.log('>>> Floodmemory >>> getUsersList ');
  let graph = null;
  
  try {
    let userId = null;
    graph = authenticateRequest(req);
    
    if(! graph) {
      console.error('No Header found')
      return res.status(500).send('No Header found')
      // throw new Error('No Header found')
    }

    if(! req.query.userId) {
      console.error('No userId provided')
      return res.status(500).send('No userId provided')
      // throw new Error('No page id provided')
    } 
    userId = parseInt(req.query.userId)

    fmUtil.getStoriesList(req).then(
      result => {
        // console.log(JSON.stringify(result, null, 2));
        // console.log(result.pages.list)
        let filtered = result.pages.list.filter((page) => {
          // read description by converting it from string to Object
          let desc = fmUtil.tryParseJSON(page.description)

          // get creatorid
          if(!desc && desc.creatorId) {
            return;
          }

          // if creatorId and requested userId then add to the list
          if(desc.creatorId === userId)
            return true
          else
            return false
        });

        pagesResponse.pages.list = filtered
        console.log('Response sent with '+ filtered.length +' pages')
        res.send(pagesResponse)
      },
      err => {
        console.error(err)
        res.status(500).send(err)
      }
    );

  } catch(e) {
    console.log('Generic error ', e)
    res.status(500).send(`Failed to get the list of the Flood memories created by User`)
  }
}

/**
 * NOT USING
 * Converts Address to lat/lon location to be stored in db
 * Internal used function
 * 
 * @param {String} address 
 */
function getGeocode(address) {
  const options = {
    provider: 'openstreetmap',
  };
  
  const geoCoder = NodeGeocoder(options); 
  
  return geoCoder.geocode(address);
  // geoCoder.geocode(address)
  //           .then(async (res) => {
  //             // const Latitude = res[0].latitude;
  //             // const Longitude = res[0].longitude;
  //             desc.location.latitude = res[0].latitude;
  //             desc.location.longitude = res[0].longitude;
  //             console.log('desc = ', desc);
  //           })
}

/**
 * Login with user API's credentials
 * Internal used function
 * 
 * @returns promise
 */
function login() {
  const graph = graphql(config.wikiApi.url);

  const query = graph(`mutation(
    $username: String!, 
    $password: String! ) {
      authentication {
      login(
        username: $username,
        password: $password,
        strategy: "local"
      ) {
        jwt
      }
    }
  }`);

  return query({
    username: config.wikiApiUserCredentials.username,
    password: config.wikiApiUserCredentials.password
  })
}

/**
 * NOT USING IT anymore
 * Adds '\\' to the given string since graphql needs it 
 * specially while storing JSON type string
 * Internal used function
 * 
 * @param {String} str 
 */
function addExtraBackSlash(str) {
  // console.log(str);
  return str.replace(/"/g, '\\"')
}

router.use(express.static(path.join(__dirname, '../../wwwroot')))
// router.use(express.static(path.join(__dirname, './uploads')));
router.use(cors())
router.get('/times', getFMTimes)
router.post('/list', getList)
router.post('/all', getAllFMList)
router.get('/view', getPage)
router.post('/create', createPage)
router.post('/edit', editPage)
router.get('/delete', deletePage)
router.post('/u/video', uploadVideo)
router.post('/u/image', uploadImage)
router.post('/asset/list', getAssetList)
router.post('/asset/delete', deleteAssetRequestHandler)
router.get('/user', getUserCreatedPages)

module.exports = router
