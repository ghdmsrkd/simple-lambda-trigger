import axios from "axios"
import { DynamoDB } from "aws-sdk"
import {queryTrendingPost} from "./data/queryTrendingPosts"

export const scheduler = async (event) => {
  const posts = await axios({
    url: "https://v2.velog.io/graphql",
    method: "post",
    data: queryTrendingPost()
  })
  const DDB = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
    // endpoint:
    //   process.env.NODE_ENV === "development"
    //     ? "https://dynamodb.ap-northeast-2.amazonaws.com"
    //     : null,
    // accessKeyId:
    //   process.env.NODE_ENV === "development"
    //     ? process.env.AWS_ACCESS_KEY_ID
    //     : null,
    // secretAccessKey:
    //   process.env.NODE_ENV === "development"
    //     ? process.env.AWS_SECRET_ACCESS_KEY
    //     : null,
  })
  const params = {
    TableName: "SCRAPED_POST",
    Item: {
      trending_type: "day",
      scraped_at: +(new Date()),
      posts: posts.data.data
    },
  }
  DDB.put(params, (err, _) => {
    if (err) {
      console.error(err)
    }
  })
  console.log(posts.data.data)
}
