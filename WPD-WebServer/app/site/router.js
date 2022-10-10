var express     = require('express')
var join        = require('path').join
var cors        = require('cors')
// const WebSocket = require('ws');

const fmUtil    = require('../floodmemory/util')

var router = new express.Router()
// const wss = new WebSocket.Server({ server: express });

function home (req, res) {
  // res.render('site/home')
  res.send('Bismillah')
}

function getMeta(req, res) {
  console.log('>>> site >>> getMeta ');
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

router.use(express.static(join(__dirname, '../../wwwroot')))
router.use(cors())
router.get('/', home)
router.get('/meta', getMeta)

module.exports = router
