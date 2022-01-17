import { AWSHandlerAdapter } from "src/adapter/aws";
import * as path from "path";
import { importAsController, printMeta, scanFiles } from "src/scan";


it("test", async () => {
  for await (const { path: p } of scanFiles(path.join(__dirname, "test-service"))) {
    const Controller = await importAsController(p);
    const c = new Controller();

    const event = {
      "resource": "/my/path",
      "path": "/my/path",
      "httpMethod": "GET",
      "headers": {
        "header1": "value1",
        "header2": "value2"
      },
      "multiValueHeaders": {
        "header1": [
          "value1"
        ],
        "header2": [
          "value1",
          "value2"
        ]
      },
      "queryStringParameters": {
        "parameter1": "value1",
        "parameter2": "value"
      },
      "multiValueQueryStringParameters": {
        "parameter1": [
          "value1",
          "value2"
        ],
        "parameter2": [
          "value"
        ],
      },
      "requestContext": {
        "accountId": "123456789012",
        "apiId": "id",
        "authorizer": {
          "claims": null,
          "scopes": null
        },
        "domainName": "id.execute-api.us-east-1.amazonaws.com",
        "domainPrefix": "id",
        "extendedRequestId": "request-id",
        "httpMethod": "GET",
        "identity": {
          "accessKey": null,
          "accountId": null,
          "caller": null,
          "cognitoAuthenticationProvider": null,
          "cognitoAuthenticationType": null,
          "cognitoIdentityId": null,
          "cognitoIdentityPoolId": null,
          "principalOrgId": null,
          "sourceIp": "IP",
          "user": null,
          "userAgent": "user-agent",
          "userArn": null,
          "clientCert": {
            "clientCertPem": "CERT_CONTENT",
            "subjectDN": "www.example.com",
            "issuerDN": "Example issuer",
            "serialNumber": "a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1:a1",
            "validity": {
              "notBefore": "May 28 12:30:02 2019 GMT",
              "notAfter": "Aug  5 09:36:04 2021 GMT"
            }
          }
        },
        "path": "/my/path",
        "protocol": "HTTP/1.1",
        "requestId": "id=",
        "requestTime": "04/Mar/2020:19:15:17 +0000",
        "requestTimeEpoch": 1583349317135,
        "resourceId": null,
        "resourcePath": "/my/path",
        "stage": "$default"
      },
      "pathParameters": {
        "id": "8",
      },
      "stageVariables": null,
      "body": "{'a': 'Hello from Lambda!'}",
      "isBase64Encoded": false
    }

    const adapter = new AWSHandlerAdapter();
    const handler = adapter.adapt("get", c);
    
    console.log(await handler(event as any));
  }
});