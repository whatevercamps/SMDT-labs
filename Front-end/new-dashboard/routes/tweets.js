var express = require("express");
var router = express.Router();

let MongoUtils = require("../utils/mongoUtils");
const mu = MongoUtils();

/* GET tweets listing. */
router.get("/", function (req, res) {
  const query = req.query["query"] || "";
  const page = req.query["page"] || 1;
  const accuracy = req.query["accuracy"] || 0;

  mu.connect()
    .then((client) => mu.searchTweets(client, query, accuracy, page))
    .then((resp) => {
      console.log("resp", resp && resp.length);
      return res.json({ success: true, tweets: resp });
    })
    .catch(function (e) {
      console.log("catch in routes", e);
      return res
        .status(500)
        .json({ success: false, msg: "error in server", error: e });
    });
});

module.exports = router;
