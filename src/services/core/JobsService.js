const BaseService=require('../BaseService')
const SyncService=require('./SyncService')
const config=require('../../config/config')
class JobsService extends BaseService {
    constructor(){
        super()
        this.job = require('node-cron');

    }
    initialize(){
        this.job.schedule(config.syncDate, async () => {
            console.log('Running the movie sync job at midnight');
            await SyncService.syncMovies();
          });
    }
}
module.exports= new JobsService()