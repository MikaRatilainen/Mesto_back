// eslint-disable-next-line no-useless-escape
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

function validateURL(value) {
  return URL_REGEX.test(value);
}

function handleURLError(props) {
  return `${props.value} is not a valid url!`;
}

module.exports = {
  validateURL,
  handleURLError,
};
