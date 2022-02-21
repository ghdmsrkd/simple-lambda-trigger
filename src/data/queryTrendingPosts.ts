export const queryTrendingPost = () =>{
  return {
    "operationName": "TrendingPosts",
    "variables": {
      "limit": 100,
      "timeframe": "day"
    },
    "query": `
    query TrendingPosts($limit: Int, $offset: Int, $timeframe: String) {
        trendingPosts(limit: $limit, offset: $offset, timeframe: $timeframe) {
            id
            title
            short_description 
            thumbnail
            likes
            user {
                id
              username
              profile {
                  id
                thumbnail
                __typename
              }
              __typename
            }
            url_slug
            released_at
            updated_at
            comments_count
            tags
            is_private
            __typename
          }
        }
        `
  }
}