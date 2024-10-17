const { Migration } = require('../db/models/index')
class migrationStore {
    async load(fn) {
        const migrations = await Migration.getOne({})
        return migrations ? fn(null, migrations) : fn(null, {})
    }
    async save(set, fn) {
        const migration= await Migration.update({}, {
            $set: {
                lastRun: set.lastRun,
                migrations: set.migrations
            }
        }, { upsert: true })
        return fn(null, migration)
    }
}
module.exports = migrationStore