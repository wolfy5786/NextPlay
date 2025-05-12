// import needed libraries
import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { getConnection, query } from './config/db';

// get express application
const app = express();

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cors middleware
app.use(cors());

// define app port
const port = process.env.SERVER_PORT || 3000;

// routes
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Hi
app.get("/hello/:name", (req, res) => {
    res.send(`Hello ${req.params.name}`);
});

app.get("/gamescount", async (req, res) => {
    const result = await query("SELECT COUNT(*) AS count FROM games");
    res.json({ "count": result[0]["count"] });
});

// Game Endpoint
// Returns a game based on it's app_id
app.get("/game", async (req, res) => {
    const app_id = req.query.app_id;

    let searchQuery = `
    SELECT *
    FROM games
    WHERE app_id = ${app_id}
    `
    const result = await query(searchQuery);
    res.json(result[0]);
});

// Game Tag Endpoint
// Returns all the tags of a specific game
app.get("/game_tags", async (req, res) => {

    const app_id = req.query.app_id;

    let searchQuery = `
    SELECT T.label, T.tag_id
    FROM game_tags G JOIN tags T ON G.tag_id = T.tag_id
    WHERE G.app_id = ${app_id}
    `
    const result = await query(searchQuery);
    res.json(result);
});


// Tag Endpoint
// Returns all the tags in descending order of occurances
app.get("/tags", async (req, res) => {

    let searchQuery = `
    SELECT T.tag_id, T.label, COUNT(*) AS occurrences
    FROM game_tags G JOIN tags T ON G.tag_id = T.tag_id
    GROUP BY T.tag_id
    ORDER BY COUNT(*) DESC
    `
    const result = await query(searchQuery);
    res.json(result);
});



// Recommendation Endpoint
// Returns all recommendations of a game sorted by reviewer's number of reviews
app.get("/get_recommend", async (req, res) => {

    const app_id = req.query.app_id;
    const limit = req.query.limit ?? 99;

    let searchQuery = `
    SELECT R.review_id, R.user_id, U.reviews,
           R.is_recommended = 1 AS is_recommended, R.hours, R.date_published, U.username
    FROM users U
    JOIN (
        SELECT *
        FROM recommendations
        WHERE app_id = ${app_id}
    ) R ON R.user_id = U.user_id
    ORDER BY U.reviews DESC
    LIMIT ${limit}
    `

    const result = await query(searchQuery);
    res.json(result);
});


// Popular Endpoint
// Finds the top 50 most popular games to display on homepage
app.get("/get_popular", async (req, res) => {

    const limit = req.query.limit ?? 99;

    let searchQuery = `
        SELECT *
        FROM games
        WHERE description != "" AND description IS NOT NULL
        ORDER BY user_reviews DESC
        LIMIT ${limit}
    `

    const result = await query(searchQuery);
    res.json(result);
});

// Popular tags
// Finds the top 12 popular tags to display on homepage
app.get("/popular_tags", async (req, res) => {
    const limit = req.query.limit ?? 10;

    let searchQuery = `
        SELECT t.tag_id, t.label
        FROM game_tags gt JOIN tags t ON gt.tag_id = t.tag_id
        GROUP BY t.tag_id, t.label
        ORDER BY COUNT(*) DESC
        LIMIT ${limit}
    `;

    const result = await query(searchQuery);
    res.json(result);
});

// Top 50 Games Endpoint
// Finds the top 50 most popular games of a specific tag
app.get("/tag_games", async (req, res) => {
    const tagid = req.query.tagid;
    const limit = req.query.limit ?? 99;

    let searchQuery = `
    SELECT *
    FROM game_tags T JOIN games G ON T.app_id = G.app_id
    WHERE T.tag_id = ${tagid}
    ORDER BY G.user_reviews DESC
    LIMIT ${limit}
    `

    const result = await query(searchQuery);
    res.json(result);
})


// Tag Label Endpoint
// Finds the label associated with a tag id
app.get("/tag_label", async (req, res) => {
    const tagid = req.query.tagid;

    let searchQuery = `
    SELECT label
    FROM tags
    WHERE tag_id = ${tagid}
    `

    const result = await query(searchQuery);
    res.json(result[0]["label"]);
})



// Game endpoint
// returns all games that match a given query parameters / tags
// Sorted by popularity
app.get("/search_games", async (req, res) => {

    const title = req.query.title ?? '%%';
    //const dateLow = 
    //const dateHigh = 
    const priceLow = req.query.priceLow ?? 0.0;
    const priceHigh = req.query.priceHigh ?? 300.0;
    const ratioLow = req.query.ratioLow ?? 0;
    const ratioHigh = req.query.ratioHigh ?? 100;

    const limit = req.query.limit ?? 99;

    let searchQuery = `
    SELECT *
    FROM games
    WHERE title LIKE '%${title}%' AND price_original >= ${priceLow}
        AND price_original <= ${priceHigh} AND positive_ratio >= ${ratioLow}
        AND positive_ratio <= ${ratioHigh}
    LIMIT ${limit}
    `

    const result = await query(searchQuery);
    res.json(result);
});


// Reviewed Games Endpoint
// Returns the title of every game that a user has reviewed.
app.get("/user_reviewed", async (req, res) => {

    const user_id = req.query.user_id;

    let searchQuery = `
    WITH reviewedGames AS (
        SELECT DISTINCT R.app_id
        FROM users U JOIN recommendations R ON U.user_id = R.user_id
        WHERE U.user_id = ${user_id}
    )
    SELECT G.title
    FROM reviewedGames R JOIN games G ON R.app_id = G.app_id
    `
    const result = await query(searchQuery);
    res.json(result);
});

// Common Games Endpoint
// Returns the games that two users share in common
app.get("/common_games", async (req, res) => {

    const user1 = req.query.user1;
    const user2 = req.query.user2;

    let searchQuery = `
    WITH user1Games AS (
        SELECT DISTINCT R.app_id
        FROM users U JOIN recommendations R ON U.user_id = R.user_id
        WHERE U.user_id = ${user1}
    ),
    user2Games AS (
        SELECT DISTINCT R.app_id
        FROM users U JOIN recommendations R ON U.user_id = R.user_id
        WHERE U.user_id = ${user2}
    ), 
    total AS (
        SELECT COUNT(*) AS count
        FROM (SELECT app_id FROM user1Games
                UNION
             SELECT app_id FROM user2Games) AS inter
    ),
    intersection AS (
        SELECT COUNT(*) AS count
        FROM user1Games
        WHERE app_id IN (SELECT app_id FROM user2Games)
    )
    SELECT app_id, (intersection.count / total.count) AS similarityScore
    FROM user1Games, total, intersection
    WHERE app_id IN (SELECT app_id FROM user2Games)
    `
    const result = await query(searchQuery);
    res.json(result);
});


// Tag Rank Endpoint
// Returns the tags of a game if game is top 50 of the category
app.get("/top_tags", async (req, res) => {

    const app_id = req.query.app_id;

    let searchQuery = `
    WITH userTags AS (
        SELECT DISTINCT tag_id
        FROM game_tags
        WHERE app_id = ${app_id}
    ),
    taggedGames AS (
        SELECT U.tag_id, T.app_id,
               ROW_NUMBER() OVER (PARTITION BY U.tag_id ORDER BY G.user_reviews DESC) AS row_num
        FROM game_tags T JOIN userTags U ON T.tag_id = U.tag_id
                         JOIN games G ON G.app_id = T.app_id
    )
    SELECT tag_id
    FROM taggedGames
    WHERE row_num <= 50 AND app_id = ${app_id};
    `
    const result = await query(searchQuery);
    res.json(result);
});

// Recommended Games Endpoint
// Returns the games that a user might like based on their liked games
app.get("/recommended_games", async (req, res) => {

    const user = req.query.user;

    let searchQuery = `
    WITH userGames AS (
        SELECT DISTINCT app_id
        FROM recommendations
        WHERE user_id = ${user}
    ),
    userTags AS (
        SELECT T.tag_id
        FROM userGames U JOIN game_tags T ON U.app_id = T.app_id
        GROUP BY tag_id
        ORDER BY COUNT(*) DESC
        LIMIT 3
    )
    SELECT *
    FROM userTags T
     JOIN game_tags GT ON T.tag_id = GT.tag_id
     JOIN games G ON GT.app_id = G.app_id
    WHERE GT.app_id NOT IN (SELECT app_id FROM userGames)
    LIMIT 50;
    `
    const result = await query(searchQuery);
    res.json(result);
});


// Average Tag Score Endpoint
// Returns the average score of each tag based on games with the tag
app.get("/average_tag_score", async (req, res) => {

    const user = req.query.user;

    let searchQuery = `
    SELECT t.label, t.tag_id, AVG(CASE
        WHEN g.rating = 'Overwhelmingly Positive' THEN 1
        WHEN g.rating = 'Very Positive' THEN 0.75
        WHEN g.rating = 'Positive' THEN 0.5
        WHEN g.rating = 'Mostly Positive' THEN 0.25
        WHEN g.rating = 'Mixed' THEN 0
        WHEN g.rating = 'Mostly Negative' THEN -0.25
        WHEN g.rating = 'Negative' THEN -0.5
        WHEN g.rating = 'Very Negative' THEN -0.75
        WHEN g.rating = 'Overwhelmingly Negative' THEN -1
    END) AS average_review_score
    FROM games g
    JOIN game_tags gt ON g.app_id = gt.app_id
    JOIN tags t ON gt.tag_id = t.tag_id
    GROUP BY t.label
    ORDER BY average_review_score DESC;
    `
    const result = await query(searchQuery);
    res.json(result);
});



app.get("/games_reviewed", async (req, res) => {
    const user = req.query.user;

    const limit = req.query.limit ?? 99;

    let searchQuery = `
    WITH userGames AS (
        SELECT DISTINCT app_id
        FROM recommendations
        WHERE user_id = ${user}
    )
    SELECT *
    FROM userGames U JOIN games G ON U.app_id = G.app_id
    LIMIT ${limit};
    `
    const result = await query(searchQuery);
    res.json(result);

});

// starts the server
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
});