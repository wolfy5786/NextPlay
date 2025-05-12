# NextPlay

Description:
Our web-enabled application will use the Game Recommendations on Steam dataset to browse 
through products available on Steam and aggregate the user recommendations for each game. 
Similarly to the home page of Steam, users can browse through a catalog of recommended 
games or search for a game by its titles, ratings, or tags. Once the user chooses a game, 
the metadata and reviews will help them decide whether they would be interested in 
purchasing the game.

## Loader
1. Download the archive.zip from https://www.kaggle.com/datasets/antonkozyriev/game-recommendations-on-steam?resource=download
2. Unzip archive.zip in the loader folder
3. Setup and run mysql server
4. Create all the tables with all the constraints
5. Add indices to speed up query time
6. Update the <rds_host>, <rds_user>, <rds_pass> and <rds_name> with your database credentials in index.ts file
7. Install all the dependencies using `npm install`
8. Run the loader to load all the metadata using `npm start`

## Backend
1. Create .env file similar to .env.sample and fill in your database credentials
2. Install all the dependencies using `npm install`
3. Run the backend using `npm start`

## Frontend
1. Install all the dependencies using `npm install`
2. Make sure the database and backend are up and running
3. Run the frontend using `npm start`
