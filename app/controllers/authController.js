
module.exports = {
  list: function (req, res, next) {
    
      res.send({ items: items });

  },
  create: function (req, res, next) {
  
      res.send(200, message.serialize());
  }
};
