var jwt = require('jwt-simple'),
    moment = require('moment'); //display dates in js

module.exports = {
  /*
  * Login Required Middleware
  */
  ensureAuthenticated: function (req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).send({ message: 'Please make sure your request has an Authorization header.' });
    }

    var token = req.headers.authorization.split(' ')[1];
    var payload = null;

    try {
      payload = jwt.decode(token, process.env.TOKEN_SECRET);
    }
    catch (err) {
      return res.status(401).send({ message: err.message });
    }
    // if the payload expiration date is less than or equal to unix time converted into js real time
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: 'Token has expired.' });
    }
    req.user = payload.sub; //WHAT IS THIS?!?!?!
    console.log('LOOK HERE!!!!!!!!! the payload is: ' payload, 'the subject is: ' payload.sub);
    next();
  },

  /*
  * Generate JSON Web Token
  */
  createJWT: function (user) {
    var payload = {
      sub: user._id,
      iat: moment().unix(), //issued at
      exp: moment().add(14, 'days').unix() //creates later expiration date
    };
    return jwt.encode(payload, process.env.TOKEN_SECRET);
  }
};
