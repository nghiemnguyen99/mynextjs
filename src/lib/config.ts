const dynamoDBConfig = {
    development: {
      region: process.env.DYNAMODB_REGION || 'ap-northeast-1',
      endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:4566',
    },
    production: {
      region: process.env.AWS_REGION,
    },
  };
  
export default dynamoDBConfig;