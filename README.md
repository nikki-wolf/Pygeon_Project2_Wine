Data_Visualization_Project: Pygeon Project2

Output: The wine data is transfered to Heroku as a dashboard delivering a visual story of wine history (production, consumption, export, import in a value, volume, and per capita format between 1865-2016) worldwide (i.e., producing and consuming countries) together with price, rating, variety, and subvariety for 42 producing countries.

Input: Collections in mLab db (connected to Heroku). These data collections are generated, in turn, using two mega Excel workbooks which generated in another project (Pygeon 1).

wine_hist_onedoc : wine history by applying a JSON file including history for all countries and years (collection documents size: 1).
wine_history: wine history by applying features per country per year (collection document size: 53 country * 152 years).
wine_history_list: wine history by applying features per country for all years (collection document size: 53 country).
wine_rating: wine price, rating, and variety features (collection document size: 120915)
wine_rating_World: wine price, rating, and variety features per country for all countries worldwide including The US (collection document size: 42 producing countries)
wine_rating_States: wine price, rating, and variety features per The States for The US (collection document size: 27 producing states).
wine_rating_world_unique: wine price, rating, and variety features selected based on unique subvariety and price and rating mean value per subvariety (downsized the original 120915 documents to 1548 documents)
Based on our performance benchmark, we used wine_history_list and (wine_rating_World + wine_rating_states) for the wine history and list features respectively.

The source file for data cleaning and transferring to the mLab db is wine_db_v2.ipynb.


