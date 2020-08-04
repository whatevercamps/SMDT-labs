"use strict";

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const MongoUtils = () => {
  const mu = {};

  const dbURL = process.env.DB_URL || "I didn't read the deploy instructions";
  const dbName = process.env.DB_NAME || "I didn't read the deploy instructions";

  const collection = "users";

  const handler = (client, pColl) =>
    client.db(dbName).collection(pColl || collection);

  mu.connect = () => {
    const client = new MongoClient(dbURL, { useNewUrlParser: true });
    return client.connect().catch(function (e) {
      console.log("current dburl", dbURL);
      console.log("catch in connect", e);
      throw e;
    });
  };

  //
  // USER FUNCTIONS
  //
  mu.getUsersByEmail = (client, email) => {
    let query = { email: email };
    console.log("query", query);

    return handler(client)
      .find(query)
      .toArray()
      .catch(function (e) {
        console.log("catch in model", e);
        throw e; //
      })
      .finally(() => {
        console.log("finalizing get user by email");
        client.close();
      });
  };

  mu.getUsers = (client, userid) => {
    let query = { _id: new ObjectID(userid) };

    return handler(client)
      .find(query)
      .toArray()
      .catch(function (e) {
        console.log("catch in model", e);
        throw e; //
      })
      .finally(() => {
        client.close();
      });
  };

  mu.findOrCreateUser = (client, query, doc) => {
    return handler(client)
      .findOneAndUpdate(
        query,
        {
          $setOnInsert: doc || query,
        },
        {
          returnOriginal: false,
          upsert: true, // insert the document if it does not exist
          new: true, // return new doc if one is upserted
        }
      )
      .catch(function (e) {
        console.log("catch in model", e);
        throw e; //
      })
      .finally(() => {
        client.close();
      });
  };

  mu.createUser = (client, user) => {
    return handler(client)
      .updateOne(user, { $setOnInsert: user }, { upsert: true })
      .catch(function (e) {
        throw e; //
      })
      .finally(() => {
        client.close();
      });
  };

  mu.updateUser = (client, userId, user) => {
    console.log("user update in mongo utils", userId, user);
    return handler(client)
      .findOneAndUpdate(
        { _id: ObjectID(userId) },
        { $set: user },
        { returnOriginal: false }
      )
      .catch(function (e) {
        console.log("catch in model", e);
        throw e; //
      })
      .finally(() => {
        client.close();
      });
  };

  mu.addTastes = (client, userId, tastes) => {
    return handler(client)
      .findOneAndUpdate(
        { _id: new ObjectID(userId) },
        { $push: { tastes: { $each: tastes } } }
      )
      .catch(function (e) {
        console.log("catch in model", e);
        throw e; //
      })
      .finally(() => {
        client.close();
      });
  };

  mu.addComments = (client, userId, comments) => {
    return handler(client)
      .findOneAndUpdate(
        { _id: new ObjectID(userId) },
        { $push: { comments: { $each: comments } } }
      )
      .catch(function (e) {
        console.log("catch in model", e);
        throw e; //
      })
      .finally(() => {
        client.close();
      });
  };

  //
  // Queries functions
  //

  mu.getQueries = (client, name) => {
    let query = {};
    query["Name"] = new RegExp(`.*${name.split("-").join(".*")}.*`, "i");
    console.log("query", query);

    return handler(client, "queries")
      .find(query)
      .toArray()
      .catch(function (e) {
        console.log("catch in model", e);
        throw e; //
      })
      .finally(() => {
        console.log("finalizing get user by email");
        client.close();
      });
  };

  mu.createQuery = (client, query) => {
    console.log("creating query");

    return handler(client, "queries")
      .insert(query)
      .catch(function (e) {
        throw e; //
      })
      .finally(() => {
        console.log("query saved");

        client.close();
      });
  };

  //
  // POSTS Functions
  //

  mu.listenForUserUpdates = (client, callback) => {
    console.log("listening for changes in posts collections");

    const cursorTW = handler(client, "tweets").watch({
      fullDocument: "updateLookup",
    });
    const cursorIG = handler(client, "igPosts").watch({
      fullDocument: "updateLookup",
    });

    cursorTW.on("change", (user) => {
      console.log("change tweets", user);

      callback(user);
    });

    cursorIG.on("change", (user) => {
      console.log("change igPosts", user);

      callback(user);
    });
  };

  mu.getTweets = (client, keywords, page) => {
    let query = {};

    // query = {
    //   query: keywords,
    // };
    query["queryName"] = new RegExp(
      `.*${keywords.split("-").join(".*")}.*`,
      "i"
    );
    console.log("query", query);

    return handler(client, "tweets")
      .find(query)
      .skip(50 * (Math.max(1, page) - 1))
      .limit(50)
      .toArray()
      .catch(function (e) {
        console.log("catch in model", e);
        throw e; //
      })
      .finally(() => {
        console.log("finalizing get tweets by keywords");
        client.close();
      });
  };

  mu.getTweetsByText = (client, keywords, page) => {
    let query = {
      text: new RegExp(`.*${keywords.split("-").join(".*")}.*`, "i"),
    };
    console.log("query", query);

    return handler(client, "tweets")
      .find(query)
      .sort({ similarity: -1 })
      .skip(50 * (Math.max(1, page) - 1))
      .limit(50)
      .toArray()
      .catch(function (e) {
        console.log("catch in model", e);
        throw e; //
      })
      .finally(() => {
        console.log("finalizing get tweets by keywords");
        client.close();
      });
  };
  //.find( { $text: { $search: "estupida" }, similarity: {$gte : 0.0025 }}, { score: { $meta: "textScore" } } ).sort({similarity: -1, score: {$meta: "textScore"}})
  mu.searchTweets = (client, q, ac, page) => {
    const query = q && q.trim() !== "" ? { $text: { $search: q } } : {};
    console.log("query", query);

    return handler(client, "tweets")
      .find(
        query,
        q && q.trim() !== ""
          ? {
              projection: { score: { $meta: "textScore" } },
            }
          : {}
      )
      .sort(
        q && q.trim() !== ""
          ? { similarity: -1, score: { $meta: "textScore" } }
          : { similarity: -1 }
      )
      .skip(50 * (Math.max(1, page) - 1))
      .limit(50)
      .toArray()
      .catch(function (e) {
        console.log("catch in model", e);
        throw e; //
      })
      .finally(() => {
        console.log("finalizing get tweets by keywords");
        client.close();
      });
  };

  return mu;
};

module.exports = MongoUtils;
