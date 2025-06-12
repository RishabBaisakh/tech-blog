const sanitizeHtml = require("sanitize-html");

const sanitizeInput = (value) =>
  sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });

module.exports = {
  sanitizeInput,
};
