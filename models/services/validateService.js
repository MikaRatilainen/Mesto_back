const validator = require('validator');

const VALIDATION_ERROR = 'ValidationError';

function validateURL(value) {
  return validator.isURL(value);
}

function validateEmail(value) {
  return validator.isEmail(value);
}

function handleURLError(props) {
  return `${VALIDATION_ERROR} ${props.value} is not a valid url!`;
}

function handleEmailError(props) {
  return `${VALIDATION_ERROR} ${props.value} is not a valid email!`;
}

module.exports = {
  validateURL,
  validateEmail,
  handleURLError,
  handleEmailError,
  VALIDATION_ERROR,
};
