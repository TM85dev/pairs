# Pairs
## Simple card game

### I. Information about game.
It's simple memory card game where you can choose two cards and compare it. If you find the same two cards you can earn points. If you find more pairs in row, you can get bonus points. More row pairs - more points you can get. In game you have also time. It's counting from first card flipped to last pair you find. Time has impact to your points. Less time - more points.
In game you have table with top 10 players who get more points. When you earn enough points you can save your score on table. After game yous input your name and it will be saved to table score.

### II. Technology used in project.
1. [Bootstrap](https://getbootstrap.com/) - library for building responsive web pages.
2. [jQuery](https://jquery.com/) - a library that makes javascript easier to use.
3. [SASS](https://sass-lang.com/) - stylesheet language that is compiled to CSS.
4. [PHP](https://www.php.net/) - scriptiing language for web development.

### III. Structure files.
1. **index.html** - main file for display game. Include css and JavaScript files.
2. **assets** - catalog with images (*.png / *.jpg files). You can make your own images for cards here.
    - bg.jpg - background for game board.
    - card_0.png - card_5.png - card for games.
    - card_back.png - back for every card.
    - card.png - background for score points info.
3. **css** - catalog with styles.
4. **fonts** - catalog with font. You can upload your font here, and change font face inside css/style.css or css/style.scss.
5. **js** - catalog with JavaScript files.
6. **pairs_score** - catalog contains index.php for back-end. Default route is *http://localhost/pairs_score/*. If you want upload file to other place you can easily change route inside js/script.js file for ajax requests.

### IV. MYSQL structure.
To create top 10 score list you need to create database.
database name : pairs_score
table name: users
structure:
```
CREATE TABLE `users` (
  `id` int(11) NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `points` int(11) NOT NULL,
  `game_time` varchar(255) NOT NULL,
  `time` date DEFAULT current_timestamp()
)
```