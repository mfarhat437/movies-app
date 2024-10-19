const BaseService=require('../BaseService')
const {Configuration}=require('../../db/models/index')
class ConfigurationService extends BaseService {

    async initialize(){
        return Configuration.create({})
    }
    async get(){
        return Configuration.getOne({})
    }
    async update(data){
        return Configuration.updateOne({},data)
    }

}
module.exports= new ConfigurationService()