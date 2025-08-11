# Files

The Extra Horizon SDK can be used on different platforms, each handling binary data slightly different. So we've collected a few examples on how to upload/download binary data for each of the supported platforms.

## Web

In browsers the [File ](https://developer.mozilla.org/en-US/docs/Web/API/File)and [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) classes can be used for uploads.

A download results in an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

### File upload example

```javascript
const fileInputElement = document.querySelector('input[type="file"]');
const file = fileInputElement.files[0];

const uploadResult = await exh.files.create(file.name, file);
```

### Blob upload example

```typescript
const content = 'Hello, world!';
const fileName = 'example.txt';
const mimeType = 'text/plain';

const blob = new Blob([content], { type: mimeType });

const uploadResult = await exh.files.create(fileName, blob);
```

### Download example

```typescript
// A file token pointing to a text file containing 'Hello, world!'
const fileToken = '66030067d7342660dbc63303-49e4fa23-2079-4b91-acb1-5221ecee8393';

const arrayBuffer = await exh.files.retrieve(fileToken);
const content = await new Response(arrayBuffer).text();

console.log(content); // Shows 'Hello, world!'
```

## React Native

Currently React Native provides limited support for binary data upload using `FormData`. As this is the basis for our file upload, for now only uploading from the file system is properly supported.

A download results in an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

### Upload example expo-file-system

[https://docs.expo.dev/versions/latest/sdk/filesystem/](https://docs.expo.dev/versions/latest/sdk/filesystem/)

```javascript
import * as FileSystem from 'expo-file-system';

const content = 'Hello, world!';
const fileName = 'example.txt';
const mimeType = 'text/plain';

const uri = FileSystem.cacheDirectory + fileName;

await FileSystem.writeAsStringAsync(uri, content);

const uploadResult = await exh.files.create(fileName, {
  uri,
  name: fileName,
  type: mimeType,
});
```

### Upload example expo-image-picker

[https://docs.expo.dev/versions/latest/sdk/imagepicker/](https://docs.expo.dev/versions/latest/sdk/imagepicker/)

```javascript
import * as ImagePicker from 'expo-image-picker';

const fileName = 'myImage.jpeg'; // File name is not returned by the picker on iOS

const imagePickerResult = await ImagePicker.launchCameraAsync();
const image = imagePickerResult.assets[0];

const uploadResult = await exh.files.create(fileName, {
  uri: image.uri,
  name: fileName,
  type: image.mimeType, // Must be a valid MIME type, so not just `image.type`
});
```

### Download example

```javascript
// A file token pointing to a text file containing 'Hello, world!'
const fileToken = '66030067d7342660dbc63303-49e4fa23-2079-4b91-acb1-5221ecee8393';

const arrayBuffer = await exh.files.retrieve(fileToken);
const content = await new Response(arrayBuffer).text();

console.log(content); // Shows 'Hello, world!'
```

## Node.js

The `form-data` [package](https://www.npmjs.com/package/form-data) is used to allow strings, buffers and streams to be uploaded.

A download results in a [Buffer](https://nodejs.org/api/buffer.html#class-buffer).

### String upload example

```javascript
const content = 'Hello, World!';
const fileName = 'test.txt';

const uploadResult = await exh.files.create(fileName, content);
```

### Buffer upload example

```javascript
import * as fs from 'fs/promises';

const fileName = 'test.txt';
const buffer = await fs.readFile(fileName);

const uploadResult = await exh.files.create(fileName, buffer);
```

### Stream upload example

```javascript
import * as fs from 'fs';

const fileName = 'test.txt';
const stream = fs.createReadStream(fileName);

const uploadResult = await exh.files.create(fileName, stream);
```

### Buffer download example

```javascript
// A file token pointing to a text file containing 'Hello, world!'
const fileToken = '66030067d7342660dbc63303-49e4fa23-2079-4b91-acb1-5221ecee8393';

const buffer = await exh.files.retrieve(fileToken);
const content = buffer.toString();

console.log(content); // Shows 'Hello, world!'
```

### Stream download example

```javascript
// A file token pointing to a text file containing 'Hello, world!'
const fileToken = '66030067d7342660dbc63303-49e4fa23-2079-4b91-acb1-5221ecee8393';

const streamResponse = await exh.files.retrieveStream(fileToken);
const stream = streamResponse.data;

const buffer = await new Promise((resolve, reject) => {
  const chunks = [];
  stream.on('data', chunk => chunks.push(chunk));
  stream.on('error', reject);
  stream.on('end', () => resolve(Buffer.concat(chunks)));
});

const content = buffer.toString();

console.log(content); // Shows 'Hello, world!'
```

### Abort request example

```typescript
const controller = new AbortController();
const signal = controller.signal;
     
try {
  await exh.files.create(file, { signal });
} catch (error) {
  if (error instanceof RequestAbortedError) {
    console.log('File upload was cancelled, ignoring error');
    return;
  }
  throw error; // Handle other errors
}
     
// To cancel the upload, call:
controller.abort();
```
