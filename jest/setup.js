jest.mock('crypto-es/lib/sha1', () => {
  return {
    HmacSHA1: value => value,
  };
});

jest.mock('crypto-es/lib/enc-base64', () => {
  return {
    Base64: value => value,
  };
});
