// var router = require('express').Router()
var express     = require('express')
var join        = require('path').join
var cors        = require('cors')
const graphql   = require('graphql.js')
const _         = require('lodash')

const config    = require('../config')

var router = new express.Router()


function signIn (req, res) {
  console.log('>>> Users >>> sign-in ')
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
        responseResult {
          succeeded
          errorCode
          message
        }
        jwt
      }
    }
  }`);

  query({
    username: req.body.username,
    password: req.body.password
  }).then(
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

function signUp(req, res) {
  console.log('>>> Users >>> sign-up ')

  // wiki server doesn't allows anonymous login, hence login with api user
  login().then(
    resData => {
      const graph = graphql(config.wikiApi.url, {
        headers: {
          "Authorization": 'Bearer ' + resData.authentication.login.jwt
        }
      });

      // getPageQuery(graph, req.query.id, res)
      const query = graph(`mutation(
        $email: String!,
        $name: String!,
        $password: String!
      ) { 
        users {
          create(
            email: $email,
            name: $name,
            passwordRaw: $password,
            providerKey: "local",
            groups: [${config.wikiApiUserCredentials.groupId}]
          ) {
            responseResult {
              succeeded
              errorCode
              message
            }
          }
        }
      }`);

      query({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      }).then(
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
      
    },
    err => {
      console.error(err)
      res.status(500).send(err)
    }
  );
}

function checkEmail(req, res) {
  console.log('>>> user >>> checkEmail ', req.body)

  try {
    login().then(
      resData => {
        const graph = graphql(config.wikiApi.url, {
          headers: {
            "Authorization": 'Bearer ' + resData.authentication.login.jwt
          }
        });

        // getPageQuery(graph, req.query.id, res)
        const query = graph(`{ 
          users {
            list {
              email
            }
          }
        }`);

        query().then(
          resData => {
            // console.log(JSON.stringify(resData, null, 2));
            console.log('response sent');
            // check for email address exist in the list
            if(_.findIndex(resData.users.list, { 'email': req.body.email }) === -1 ) {
              // phoneAlreadyRegisters = true;
              res.send({ phoneExist: false });
              // return null
            } else {
              // phoneAlreadyRegisters = false;
              res.send({ phoneExist: true });
            }
          },
          err => {
            console.error(err)
            res.status(500).send(err)
          }
        );
        
      },
      err => {
        console.error(err)
        res.status(500).send(err)
      }
    );
  } catch(e) {
    console.log('Generic error ', e)
    res.status(500).send(`Falied to perform Email check`)
  }
  
}

function update(req, res) {
  console.log('>>> Users >>> update ', req.body)
  const graph = graphql(config.wikiApi.url, {
    headers: {
      "Authorization": 'Bearer ' + req.headers.authorization
    }
  });

  const query = graph(`mutation(
    $id: Int!,
    $name: String!,
    $email: String!,
    $newPassword: String!
  ) { 
    users {
      update(
        id: $id,
        name: $name,
        email: $email,
        newPassword: $newPassword
      ) {
        responseResult {
          succeeded
          errorCode
          message
        }
      }
    }
  }`);

  query({
    id: req.body.userId,
    name: req.body.name,
    email: req.body.email,
    newPassword: req.body.password
  }).then(
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

router.use(express.static(join(__dirname, '../../wwwroot')))
router.use(cors())
router.post('/sign-in', signIn)
router.post('/update', update)
router.post('/sign-up', signUp)
router.post('/emails', checkEmail)

module.exports = router
