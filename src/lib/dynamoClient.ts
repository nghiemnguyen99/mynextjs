import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import dynamoDBConfig from './config';

const environment = process.env.NODE_ENV?.toLowerCase() === 'development' ? 'development' : 'production';

const dynamoConfig = dynamoDBConfig[environment];

const client = new DynamoDB(dynamoConfig);

const ddbDocClient = DynamoDBDocumentClient.from(client);

export function getDynamoDocumentClient() {
  return ddbDocClient;
}
