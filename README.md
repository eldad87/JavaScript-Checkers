# JavaScript-Checkers
A Checkers game implemented in JavaScript

## Example
### Init the game
```
var playerOne = new Player('first');
var playerTwo = new Player('second');
var checkers = new Checkers(playerOne, playerTwo);
checkers.init(playerOne);
```

### Move a Pawn
```
moveRes = checkers.move(new Coordinate(2, 2), new Coordinate(3, 3));
console.log('Move first\'s player Pawn diagonal 2,2 -> 3,3: ' + moveRes); // true
```

### Check out the example in index.js
```
# nodejs index.js
```

## TODO:
- UnitTest