package utils

import (
	"fmt"
)

func GetBucketPolicy(bucketName string) string {
	Policy := fmt.Sprintf(`{
  "Statement": [
    {
      "Action": ["s3:ListBucket"],
      "Effect": "Deny",
      "Principal": "*",
      "Resource": ["arn:aws:s3:::%s"]
    },
    {
      "Action": ["s3:GetObject"],
      "Effect": "Deny",
      "Principal": "*",
      "Resource": ["arn:aws:s3:::%s/*"]
    }
  ],
  "Version": "2012-10-17"
}`, bucketName, bucketName)

	return Policy
}
