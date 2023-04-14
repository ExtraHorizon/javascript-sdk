const { createHmac } = require('crypto');

// The current Jest configuration doesn't like crypto-es as it is implemented as an ES module 

jest.mock('crypto-es/lib/sha1', () => {
  return {
    HmacSHA1: (value, secret) => createHmac('sha1', secret).update(value).digest(),
  };
});

jest.mock('crypto-es/lib/enc-base64', () => {
  return {
    Base64: 'base64',
  };
});
