const validator = require('validator');

function validateURL(value) {
  return validator.isURL(value);
}

function validateEmail(value) {
  return validator.isEmail(value);
}

function handleURLError(props) {
  return `${props.value} is not a valid url!`;
}

function handleEmailError(props) {
  return `${props.value} is not a valid email!`;
}

module.exports = {
  validateURL,
  validateEmail,
  handleURLError,
  handleEmailError,
};
