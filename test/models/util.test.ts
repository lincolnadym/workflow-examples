/* eslint-disable no-console */
/* eslint-disable unicorn/numeric-separators-style */
import { cloneDeep } from 'lodash';
beforeAll(() => {
  process.env.ENVIRONMENT = 'development';
  process.env.LOG_LEVEL = 'debug';
});

const axiosEvent = {
  resource: '/v1/billing-payments',
  path: '/v1/billing-payments',
  httpMethod: 'POST',
  headers: {
    Accept: 'application/json, text/plain, */*',
    Authorization: 'Bearer eyJhbGciOi1LiBVTnxvkaZ24eLHigWbqJWEIjetGzTTAq4fUgQ',
    'Content-Type': 'application/json',
    ContentType: 'application/json',
  },
  multiValueHeaders: {
    Accept: ['application/json, text/plain, */*'],
    Authorization: ['Bearer eyJhbGciOi1LiBVTnxvkaZ24eLHigWbqJWEIjetGzTTAq4fUgQ'],
    'Content-Type': ['application/json'],
    ContentType: ['application/json'],
  },
  queryStringParameters: undefined,
  multiValueQueryStringParameters: undefined,
  pathParameters: undefined,
  requestContext: {
    resourceId: 'qvy98c',
    authorizer: {
      principalId: 'cVXL3gCsBpTvasP7vNBrFkw30bZAiEMG@clients',
      integrationLatency: 988,
      source: 'UNDEFINED',
    },
    resourcePath: '/v1/billing-payments',
    httpMethod: 'POST',
    extendedRequestId: 'ZGxYvFioIAMFQBA=',
    requestTime: '27/Sep/2022:06:18:57 +0000',
    path: '/domain/v1/billing-payments',
    accountId: 'some-aws-account',
    protocol: 'HTTP/1.1',
    stage: 'test',
    domainPrefix: 'some-domain-vpce-someid',
    requestTimeEpoch: 1664259537376,
    requestId: 'dbb2d758-4e7a-4b41-8913-8c0463ba41f4',
  },
  myArray: [
    {
      item: 'TBD',
      value: 'TBD',
    },
    {
      item: 'TBD',
      value: 'TBD',
    },
  ],
  body: '{"bankCode":"XXXX","currencyCode":"XXX","paymentChannelCode":"PAYCODE"}',
  isBase64Encoded: false,
};

/**
 * Utility function that can redact elements from a JSON object.  Originally
 * developed to cleanse objects during logging using pino.Logger and aws-powertools
 * logger.  Also, it does NOT alter/modify the original object, but instead builds
 * an identical object with redacted elements as undefined.
 *
 * Known Issues :
 * - It will not traverse an Array of objects.  You can redact the entire Array, but
 * not individual Array elements.
 * - It uses recursion, so if your JSON is deep and large, it may stackoverflow.
 *
 * @param jsonObject A freeform JSON object
 * @param omitThese A string[] of dot notation elements to redact...1st level, elementName,
 * 2nd level parentName.elementName, etc...
 * @param objLevel Typically only used by recursion
 * @returns A new JSON object with redacted fields set to undefined.
 */
function redaction(jsonObject: any, omitThese: string[], objLevel?: string): any {
  const newObject = {
    ...jsonObject,
  };
  const objectKeysArray = Object.keys(newObject);
  // eslint-disable-next-line unicorn/no-array-for-each
  objectKeysArray.forEach(function (objKey) {
    const objValue = newObject[objKey];
    if (omitThese.includes(objLevel === undefined ? objKey : `${objLevel}.${objKey}`, 0)) {
      // console.log(`  item - [${objKey}] OMIT!`);
      newObject[objKey] = undefined;
    } else if (Array.isArray(objValue)) {
      newObject[objKey] = objValue;
    } else if (typeof objValue === 'object') {
      const nextLevel = objLevel === undefined ? objKey : `${objLevel}.${objKey}`;
      // console.log(`  ${objKey} - object - objLevel ${objLevel} -`);
      newObject[objKey] = redaction(objValue, omitThese, nextLevel);
    } else {
      newObject[objKey] = objValue;
    }
  });

  return newObject;
}

describe('Utility functions', () => {
  describe('redaction', () => {
    test('redaction should remove/omit inner elements from json using dot notation', () => {
      const omitThese: string[] = [
        'headers.Authorization',
        'multiValueHeaders.Authorization',
        'requestContext.resourcePath',
      ];

      const expectedJSON = {
        ...axiosEvent,
        headers: {
          Accept: 'application/json, text/plain, */*',
          Authorization: undefined,
          'Content-Type': 'application/json',
          ContentType: 'application/json',
        },
        multiValueHeaders: {
          Accept: ['application/json, text/plain, */*'],
          Authorization: undefined,
          'Content-Type': ['application/json'],
          ContentType: ['application/json'],
        },
        requestContext: {
          ...axiosEvent.requestContext,
          resourcePath: undefined,
        },
      };

      console.log(`- axiosEvent -`);
      console.log(axiosEvent);
      const mockRedaction = redaction(axiosEvent, omitThese);
      console.log(`- mockRedaction -`);
      console.log(mockRedaction);
      expect(mockRedaction).toMatchObject(expectedJSON as any);
    });

    test('redaction should remove/omit mixed 1st and inner elements using dot notation', () => {
      const omitThese: string[] = [
        'headers.Authorization',
        'multiValueHeaders',
        'requestContext.resourcePath',
      ];

      const expectedJSON = {
        ...axiosEvent,
        headers: {
          Accept: 'application/json, text/plain, */*',
          Authorization: undefined,
          'Content-Type': 'application/json',
          ContentType: 'application/json',
        },
        multiValueHeaders: undefined,
        requestContext: {
          ...axiosEvent.requestContext,
          resourcePath: undefined,
        },
      };

      console.log(`- axiosEvent -`);
      console.log(axiosEvent);
      const mockRedaction = redaction(axiosEvent, omitThese);
      console.log(`- mockRedaction -`);
      console.log(mockRedaction);
      expect(mockRedaction).toMatchObject(expectedJSON as any);
    });

    test('redaction should remove/omit 1st level objects from json', () => {
      const omitThese: string[] = ['headers', 'multiValueHeaders'];

      const expectedJSON = {
        ...axiosEvent,
        headers: undefined,
        multiValueHeaders: undefined,
      };

      const mockRedaction: unknown = redaction(axiosEvent, omitThese);
      expect(mockRedaction).toMatchObject(expectedJSON);
    });

    test('redaction should remove/omit objects from json', () => {
      const omitThese: string[] = ['resourcePath', 'accountId'];

      const expectedJSON = {
        ...axiosEvent.requestContext,
        accountId: undefined,
        resourcePath: undefined,
      };
      const mockRedaction: unknown = redaction(axiosEvent.requestContext, omitThese);
      expect(mockRedaction).toMatchObject(expectedJSON);
    });
  });
});
