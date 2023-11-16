exports.sendMessage = (options) => {
  const {
    res,
    status = 500,
    success = false,
    message = "No message",
    data = "No data",
  } = options;

  return res.status(status).send({
    success,
    message,
    data,
  });
};
