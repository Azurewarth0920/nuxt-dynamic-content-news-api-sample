require('dotenv').config()
const axios = require('axios')
const contentBuilder = require('nuxt-dynamic-content').contentBuilder

var url = `http://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}&pageSize=50`

module.exports = async function() {
  const { data } = await axios.get(url)

  const sources = contentBuilder(
    data.articles,
    item => item.source.name.replace(/ /g, '-').toLowerCase(),
    {
      path: item => `/source/${item}`,
      component: '~/templates/source.vue',
    }
  )

  const dates = contentBuilder(
    data.articles,
    [
      item => new Date(item.publishedAt).getMonth() + 1,
      item => new Date(item.publishedAt).getDate(),
    ],
    {
      path: item => `/date/${item[0]}/${item[1]}`,
      component: '~/templates/date.vue',
    }
  )

  // const articles = contentBuilder(data.articles, (item, key) => key + 1, {
  //   path: articleId => `article/${articleId}`,
  //   component: '~/templates/article.vue'
  // })

  const modules = [sources, dates]
  return { modules, globals: { data } }
}
