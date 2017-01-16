console.log("CVM copy Child Name from Parent Name- Data Migration");
console.log();

var constants       		= require('../../scripts/constants');
var util					= require(constants.paths.scripts + "/util");
var secure					= require(constants.paths.scripts + "/secure");
var clientModel 			= require(constants.paths.models + "/client");
var _ 						= require('underscore');

require(constants.paths.scripts + '/database'); // load database management scripts

try {

	clientModel
	.find()
	.exec(function(err, clientList) {
        if(err) {
            console.log(err);
        }
        else{

        	_.each(clientList, function(client) {
        		clientObject = {
        			subName : client.name
        		}
        		// console.log(clientObject);

        		clientModel
        		.findByIdAndUpdate(client._id, clientObject, function(err, doc) {
        			if(err){
						console.log(err);
					}
					else{
						console.log(doc);
					}
        		});
        	})
        }
    })

}
catch (err){
	console.log(err);
}