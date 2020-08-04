var express = require("express");
var router = express.Router();

let MongoUtils = require("../utils/mongoUtils");
const mu = MongoUtils();

/* GET users listing. */
router.get("/", function (req, res) {
  const query = req.query["query"];

  if (query && query.trim() !== "") {
    mu.connect()
      .then((client) => mu.getQueries(client, query))
      .then((resp) => {
        console.log("resp", resp);
        return res.json({ success: true, data: resp });
      });
  } else {
    return res
      .status(400)
      .json({ success: false, msg: "Por favor ingresa una query valida" });
  }
});

router.post("/", function (req, res) {
  const queryName = req.body["query"];
  const taxonomyName = req.body["taxonomy"];
  const lastUpserted = 0;

  const query = {
    queryName: queryName,
    taxonomyName: taxonomyName,
    lastUpserted: lastUpserted,
  };

  if (query && query.trim() !== "") {
    mu.connect()
      .then((client) => mu.createQuery(client, query))
      .then((resp) => {
        console.log("resp", resp);
        return res.json({ success: true, data: resp });
      });
  } else {
    return res
      .status(400)
      .json({ success: false, msg: "Por favor ingresa una query valida" });
  }
});

module.exports = router;
