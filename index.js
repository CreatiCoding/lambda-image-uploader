const AWS = require("aws-sdk");

const multipart = require("parse-multipart");

const Bucket = "버킷명";
exports.handler = async (event, context, callback) => {
  const s3 = new AWS.S3({ params: { Bucket } });
  try {
    let bodyBuffer = Buffer.from(event.body, "base64");
    let boundary = multipart.getBoundary(event.headers["content-type"]);
    let parts = multipart.Parse(bodyBuffer, boundary);
    let data = {
      Key: `${`${Math.random().toString(36).substring(2)}`
        .split("")
        .join("/")}/${Math.random()
        .toString(36)
        .substring(7)}.${parts[0].filename.split(".").pop()}`,
      Body: parts[0].data,
      ContentEncoding: "base64",
      ContentType: parts[0].type,
    };
    const response = await new Promise((resolve, reject) => {
      s3.putObject(data, function (err, s3Response) {
        if (err) {
          reject(err);
        } else {
          resolve({ url: `https://${Bucket}/${data.Key}` });
        }
      });
    });
    callback(null, response);
  } catch (e) {
    callback(e);
  }
};
