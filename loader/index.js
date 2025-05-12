const eachLine = (filename, iteratee) =>
  new Promise((resolve, reject) => {
    require("line-reader").eachLine(filename, iteratee, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

const db = require("mysql2").createConnection({
  host: "<rds_host>",
  user: "<rds_user>",
  password: "<rds_pass>",
  database: "<rds_name>",
  rowsAsArray: true,
});

// ---

// Test database connectivity
db.query("SELECT COUNT(*) FROM games", function (error, results, fields) {
  if (error) throw error;
  console.log(results[0]);
});

// Load all the tags
const tags = [];
eachLine("archive/games_metadata.json", function (line) {
  var entry = JSON.parse(line);
  entry.tags.forEach((tag) => tags.push(tag));
}).then(function (err) {
  if (err) throw err;
  console.log("I'm done!!");

  const values = [...new Set(tags)].map((tag) => [tag]);
  console.log(values);
  values.forEach((value) =>
    db.query(
      "INSERT INTO tags(label) VALUES(?)",
      value,
      function (error, results, fields) {
        if (error) throw error;
        console.log(results);
      }
    )
  );
});

// Map tags to games
db.query("SELECT * FROM tags", function (error, results, fields) {
  const tag_ids = {};
  results.forEach((result) => (tag_ids[result[1]] = result[0]));
  console.log(tag_ids);

  const games = [];
  eachLine("archive/games_metadata.json", function (line) {
    var entry = JSON.parse(line);
    games.push({ game: entry["app_id"], tags: entry["tags"] });
  }).then(function (err) {
    if (err) throw err;
    console.log("I'm done!!");

    games.forEach((game) => {
      const app_id = game.game;
      game.tags.forEach((tag) =>
        db.query(
          "INSERT INTO game_tags(app_id, tag_id) VALUES(?, ?)",
          [app_id, tag_ids[tag]],
          function (error, results, fields) {
            if (error) throw error;
            console.log(results);
          }
        )
      );
    });
  });
});

// Count total entries of game_tags
var count = 0;
const games = [];
eachLine("archive/games_metadata.json", function (line) {
  var entry = JSON.parse(line);
  games.push({ game: entry["app_id"], tags: entry["tags"] });
}).then(function (err) {
  if (err) throw err;
  console.log("I'm done!!");

  games.forEach((game) => {
    game.tags.forEach((tag) => count++);
  });
  console.log(count);
});

// Insert game descriptions
eachLine("archive/games_metadata.json", function (line) {
  var entry = JSON.parse(line);
  db.query(
    "UPDATE games SET description = ? WHERE app_id = ?",
    [entry["description"], entry["app_id"]],
    function (error, results, fields) {
      if (error) throw error;
      console.log(results);
    }
  );
}).then(function (err) {
  if (err) throw err;
  console.log("I'm done!!");
});
