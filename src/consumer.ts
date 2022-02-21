process.env["NTBA_FIX_319"] = "1"
import { DynamoDB } from "aws-sdk"

const TelegramBotApi = require("node-telegram-bot-api");
const bot = new TelegramBotApi(process.env.CHAT_TOKEN);

export const consumer = async (event) => {
  console.log(event.Records)

  const DDB = new DynamoDB.DocumentClient({
    region: "ap-northeast-2",
    endpoint:
      process.env.NODE_ENV === "development"
        ? "https://dynamodb.ap-northeast-2.amazonaws.com"
        : null,
    accessKeyId:
      process.env.NODE_ENV === "development"
        ? process.env.AWS_ACCESS_KEY_ID
        : null,
    secretAccessKey:
      process.env.NODE_ENV === "development"
        ? process.env.AWS_SECRET_ACCESS_KEY
        : null,
  })
  const queryParams = {
    TableName: "SCRAPED_POST",
    KeyConditionExpression: "trending_type = :trending_type",
    ExpressionAttributeValues: {
      ":trending_type": "day",
    },
  }
  const res = await DDB.query(queryParams).promise()

  const targetTags = JSON.parse(event.Records[0].body).tags
  console.log(JSON.parse(event.Records[0].body))
  const filteredPost = res.Items[0].posts.trendingPosts.filter((post) => {
    const tempArray = [...post.tags, ...targetTags] 
    return tempArray.length !== (new Set(tempArray)).size
  })

  const postUrlList: string = filteredPost.reduce((pre, cru) => {
    return pre + `- https://velog.io/@${cru.user.username}/${cru.url_slug}\n`
  },"")

  console.log(filteredPost)
  await bot.sendMessage(process.env.CHAT_ID, `
    관심 가질 만한 새로운 글이 작성 되었습니다!\n${postUrlList}
  `);
};