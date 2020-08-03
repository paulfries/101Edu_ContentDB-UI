export default {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
      REGION: "us-east-2",
      BUCKET: "contentdb-app-api-dev-attachmentsbucket-1deu71zec6r0u"
    },
    apiGateway: {
      REGION: "us-east-2",
      URL: "https://mg15degaqh.execute-api.us-east-2.amazonaws.com/dev"
    },
    cognito: {
      REGION: "us-east-2",
      USER_POOL_ID: "us-east-2_nXBMklFzq",
      APP_CLIENT_ID: "42fnpdbo2nksvkf2io50pubm6d",
      IDENTITY_POOL_ID: "us-east-2:5c901dc2-08ec-4bfc-89a9-33cd45da6102"
    }
  };