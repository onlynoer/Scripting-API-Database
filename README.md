# Scripting-API-Database
A simple Minecraft Bedrock Database for the Minecraft Beta-API's, has your basic set(key,value), get(key), and has(key)
<hr>
<h3>Requires a scoreboard objective named 'database'</h3>
<hr>
Usage examples:
<br>

```js
import database from './database';

const db = database.table('bannedPlayers')
//db.get(keyHere)
//db.set(key, value)
//db.has(key)
```
