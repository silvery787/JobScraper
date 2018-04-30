const axios = require("axios");
const cheerio = require("cheerio");

function ScrapeData() {

  return new Promise((resolve, reject)=>{
    
    axios.get("https://www.monster.com/jobs/search/?q=Javascript-Developer&where=bay-area__2CCalifornia&sort=dt.rv.di")
      .then(function(response) {
        let $ = cheerio.load(response.data);

        let result_arr = [];
        $(".card-content").each(function(i, element) {
          let result = {};
          let id = $(this).attr('data-jobid');

          if( id ){
            result.post_id = id;

            result.title = $(this)
              .children('.flex-row').children('.summary').children('header')
              .children('h2.title').children('a')
              .text();
            result.link = $(this)
              .children('.flex-row').children('.summary').children('header')
              .children('h2.title').children('a')
              .attr("href");
            result.company = $(this)
              .children('.flex-row').children('.summary').children('.company')
              .children('span.name')
              .text();
            result.location = $(this)
              .children('.flex-row').children('.summary').children('.location')
              .children('span.name')
              .text();

            result.posted_date = $(this)
              .children('.flex-row').children('.meta').children('time')
              .attr('datetime');

            console.log(result);
            result_arr.push(result);
          }//if id
        });        
        resolve(result_arr);
      })
      .catch(function(error){
        reject(error);
      });
  });

}

module.exports = ScrapeData;

