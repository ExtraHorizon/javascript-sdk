---
description: Create and manage oAuth1.0 or oAuth2 applications
---

# Applications

Applications represent your mobile, native, web apps or even a script that can communicate with an Extra Horizon environment. Any token used for authenticating with your Extra Horizon cluster will be linked to an application.

Before you can get started with building any frontend app on top of Extra Horizon you will need to create an app.

{% hint style="info" %}
**Default applications**\
When launching a new cluster two default applications are created by us:

1. **ExH Control center:** An oAuth2 app that gives our control center (available on  [app.extrahorizon.com](https://app.extrahorizon.com)) the ability to communicate with your cluster. You as an admin can use this app to explore and manage your cluster.
2. **CLI:** An oAuth1.0 application that you can use when installing our [CLI](https://docs.extrahorizon.com/extrahorizon-cli/) in order to send configurations to your cluster. Credentials are provided to your cluster manager during onboarding.
{% endhint %}

## Create a new application

You can create two types of applications: [oAuth1.0](https://www.rfc-editor.org/rfc/rfc5849) applications or [oAuth2](https://www.rfc-editor.org/rfc/rfc6749) applications.

| Property       | Description                                                                                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`         | The name or your application                                                                                                                                                                                 |
| `description`  | A description of your application                                                                                                                                                                            |
| `type`         | The type of application. Could be set to `oauth1` or `oauth2`                                                                                                                                                |
| `redirectUris` | A list of approved uri's that can be used when authenticating with an [authorization code grant flow](https://www.rfc-editor.org/rfc/rfc6749#section-1.3.1). Can only be used in an oAuth2 application type. |
| `confidential` | Defines wether your application should be considered a confidential app according to the [oAuth2.0 spec](https://www.rfc-editor.org/rfc/rfc6749).                                                            |
| `logo`         | The logo of the application. Can be used in the oAuth2.0 authorization code grant to indicate the user what application he is authorizing. Can only be used in an oAuth2 application type.                   |

{% tabs %}
{% tab title="oAuth1.0" %}
{% code lineNumbers="true" %}
```typescript
await sdk.auth.applications.create({
    name:'myAppName',
    description: 'myAppDescription',
    type:'oauth1'
});
```
{% endcode %}
{% endtab %}

{% tab title="oAuth2" %}
{% code lineNumbers="true" %}
```typescript
await sdk.auth.applications.create({
    name:'myAppName',
    description: 'myAppDescription',
    type:'oauth2',
    redirectUris:[''],
    confidential: false
});
```
{% endcode %}
{% endtab %}
{% endtabs %}
