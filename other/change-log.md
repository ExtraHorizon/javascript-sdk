---
description: All notable changes to this project will be documented in this file.
---

# Change Log

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v6.0.x

### v6.0.3

#### Changed

* `Profile` type has been revised

```diff
-fibricheckInfo?: string;
+fibricheckInfo?: {
+  app?: {
+    version?: string;
+    build?: string;
+    branch?: string;
+  };
+  device?: {
+    os?: string;
+    model?: string;
+    type?: 'android' | 'ios';
+    manufacturer?: string;
+  };
+};
```

### v6.0.2

#### Changed

* `ProxyClient` existed double. One of those has been renamed to `ProxyInstance`

```diff
-export interface ProxyClient extends HttpInstance {
+export interface ProxyInstance extends HttpInstance {
```

### v6.0.0

#### Breaking Changes

* `sdk.data.documents.create` now accepts 3 generics.

```diff
-create<CustomData = null, CustomStatus = null>(
- schemaId: ObjectId,
- requestBody: Record<string, any>,
- options?: OptionsWithRql & { gzip?: boolean }
-): Promise<Document<CustomData, CustomStatus>>;

+create<InputData = null, OutputData = null, CustomStatus = null>(
+ schemaId: ObjectId,
+ requestBody: InputData,
+ options?: OptionsWithRql & { gzip?: boolean }
+): Promise<Document<OutputData, CustomStatus>>;
```

#### Added

* `sdk.data.documents.update` now accepts a generic for the update type.
* Exported `findAllGeneric` and `findAllIterator` for usage on raw functions
* Better type for `findAllIterator`
