module.exports = {
  queryBag(req) {
    return (key) => {
      const params = { ...req.params, ...req.body, ...req.query };
      return params[key];
    };
  },
};
