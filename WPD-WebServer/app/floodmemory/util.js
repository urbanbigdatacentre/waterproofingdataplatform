const moment = require('moment')
const graphql   = require('graphql.js')

const config    = require('../config')

let fmUtil = module.exports

/**
 * Function to check is the string is valid JSON object, 
 * if it is then returns it otherwise returns false
 * Internal used function
 * 
 * @param {*} jsonString 
 * @returns {*} boolean false || object
 */
fmUtil.tryParseJSON = (jsonString) => {
  try {
      let o = JSON.parse(jsonString);
      if (o && typeof o === "object" && o !==undefined) {
          return o;
      }
  }
  catch (e) { }

  return false;
}

/**
 * Sorts array of pages by time in ascending order
 * 
 * @param {*} pages Array of wiki pages
 * @returns {*} pages Array of wiki pages
 */
fmUtil.sortPagesByTime = (pages) => {
  // console.log('>>> FloodMemory >>> sortPagesByTime ', pages)
  return pages.sort((a,b) => {
    const objADesc = this.tryParseJSON(a.description)
    const objBDesc = this.tryParseJSON(b.description)
    return (new moment(objADesc.time).format('YYYYMMDD') - new moment(objBDesc.time).format('YYYYMMDD'))
  })
}

/**
 * Removes pages from array of pages which doesn't have time attribute in its Description
 * 
 * @param {*} pages Array of wiki pages
 * @returns {*} pages Array of wiki pages
 */
fmUtil.removePagesWithTime = (pages) => {
  // console.log('>>> removePagesWithTime ', pages.length)
  return pages.filter( page => {
    const desc = this.tryParseJSON(page.description)
    if(!desc) {
      return;
    }
    // console.log('desc = ', desc)
    return desc.time !== undefined
  })
}

/**
 * Returns array of time from the all pages provided
 * 
 * @param {*} pages Array of wiki pages
 * @returns {*} Array of time
 */
fmUtil.getTimeFromPages = (pages) => {
  // console.log('>>> getTimeFromPages ')
  let allPages = pages.map( page => {
    const desc = this.tryParseJSON(page.description)
    if(!desc) {
      return;
    }
    // return desc.time
    return new moment(desc.time).format('YYYY-MM')
  })

  return allPages.filter( (ele, index, self) => {
    return index === self.indexOf(ele)
  })
}

/**
* Generic sync function to get User stories
* @param {HTTP request} req 
*/
fmUtil.getStoriesList = async (req) => {
 const graph = graphql(config.wikiApi.url);
 const query = graph(`{
   pages {
     list(tags: ["stories"]) { 
       id
       title
       description
       path
     }
   }
 }`);

 // query().then(
 //   result => {
 //     // console.log(JSON.stringify(result, null, 2));
 //     res.send(result);
 //   },
 //   err => {
 //     console.error(err)
 //     res.status(500).send(err)
 //   }
 // );
 return await query();
}