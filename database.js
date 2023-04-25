import {world} from '@minecraft/server'

/**
 * @param table
 */
class Database{
  constructor(){
    try {
      if(!world.scoreboard.getObjective('database')){
        world.scoreboard.addObjective('database', 'database')
        world.getDimension('overworld').runCommandAsync('scoreboard players set global database 1')
      }
    } catch (e) {
    }
  }
  table(table){
    return new Table(table)
  }
}

/**
 * @param table
 */
class Table{
  constructor(table){
    try {
      this.table = table
      this.data = []
      this.insert = {
        key: this.table,
        data: this.data
      }
      this.createTable()
    } catch (e) {
      world.sendMessage(`Constructor error: ${e}`)
    }
  }
  createTable(){
    try {
      if(this.hasTable(this.table)) return
      let table = JSON.stringify(this.insert).replace(/\"/g, "\\\"")
      world.getDimension('overworld').runCommandAsync(`scoreboard players set "${table}" database 1`)
    } catch (e) {
      world.sendMessage(`createTable Error: ${e}`)
    }
  }

  hasTable(value){
    try {
      const table = this.getTable(value)
      if(!table) return false
      return true
    } catch (e) {
      world.sendMessage(`hasTable Error: ${e}`)
    }
  }

  getTable(value){
    try {
      let data = this.getData()
      if(!data) throw new Error('No data found')
      let result = data.find(id => {
        id = JSON.parse(id.replace(/\\/g, ""))
        if(Object.values(id)[0] == value) return id
      })
      return JSON.parse(result.replace(/\\/g, ""))
    } catch (e) {
      world.sendMessage(`getTable Error: ${e}`)
    }
  }

  getData(){
    try {
      return world.scoreboard.getObjective('database').getParticipants()?.map(id => id.displayName)
    } catch (e) {
      world.sendMessage(`getData Error: ${e}`)
    }
  }

  get(key){
    try {
      return this.values()[this.values().findIndex(id => Object.keys(id) == key)][key] ?? undefined 
    } catch (e) {
      world.sendMessage(`get Error: ${e}`)
    }
  }
  
  set(key, value){
    try {
      if(this.has(key))return this.updateKey(key, value)
      let newTable = this.values()
      newTable.push({ [key]: value });
      this.update(this.getTable(this.table), { key: this.table, data: newTable });
    }catch(e){
      world.sendMessage(`set Error: ${e}`)
    }
  }

  has(key){
    try {
      let data = this.values()
      data = data.map(id => Object.keys(id)).flat()
      return data.some(e => e == key)
    } catch (e) {
      world.sendMessage(`has Error: ${e}`)
    }
  }

  remove(key){
    try {
      if(!this.has(key)) return
      let newTable = this.values();
      let index = newTable.findIndex(id => Object.keys(id) == key)
      newTable.splice(index, 1)
      this.update(this.getTable(this.table), { key: this.table, data: newTable });
    } catch (e) {
      world.sendMessage(`remove Error: ${e}`)
    }
  }

  values(){
    return Object.values(this.getTable(this.table))[1]
  }

  updateKey(key, value){
    try {
      let newTable = this.values()
      let index = newTable.findIndex(id => Object.keys(id) == key)
      newTable[index][key] = value
      this.update(this.getTable(this.table), { key: this.table, data: newTable });
    } catch (e) {
      world.sendMessage(`updateKey Error: ${e}`)  
    }
  }

  update(old, newTable){
    try {
      old = JSON.stringify(old).replace(/\"/g, "\\\"");
      newTable = JSON.stringify(newTable).replace(/\"/g, "\\\"");
      world.getDimension('overworld').runCommandAsync(`scoreboard players reset "${old}" database`)
      world.getDimension('overworld').runCommandAsync(`scoreboard players set "${newTable}" database 1`);
    } catch (e) {
      world.sendMessage(`update Error: ${e}`)
    }
  }
}

const database = new Database()
export default database
