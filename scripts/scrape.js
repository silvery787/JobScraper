var axios = require("axios");
var cheerio = require("cheerio");

function ScrapeData() {

  return new Promise((resolve, reject)=>{
    
    axios.get("https://www.monster.com/jobs/search/?q=Javascript-Developer&where=bay-area__2CCalifornia&sort=dt.rv.di")
      .then(function(response) {
        var $ = cheerio.load(response.data);

        var result_arr = [];
        $(".js_result_details").each(function(i, element) {
          var result = {};
          result.post_id = $(this)
            .children('.js_result_details-left')
            .children(".jobTitle").children("h2").children("a")
            .attr('data-m_impr_j_postingid');
          result.title = $(this)
            .children('.js_result_details-left')
            .children(".jobTitle").children("h2").children("a")
            .text();
          result.link = $(this)
            .children('.js_result_details-left')
            .children(".jobTitle").children("h2").children("a")
            .attr("href");
          result.company = $(this)
            .children('.js_result_details-left')
            .children(".company").children("a")
            .text();
          result.location = $(this)
            .children('.js_result_details-left')
            .children(".job-specs-location").children("p").children("a")
            .text();

          result.posted_date = $(this)
            .children('.job-specs-date').children("p").children("time")
            .attr("datetime");

          // console.log(result);
          result_arr.push(result);
        });        
        resolve(result_arr);
      })
      .catch(function(error){
        reject(error);
      });

  });

}

module.exports = ScrapeData;

