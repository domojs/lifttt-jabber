var Client=require('jabber').Client;

var clients=[];


process.on('exit', function(){
    for(var client of clients)
        client.end();
});

function buildClient(port, host, username, password, callback){
    var client=new Client(port, host, username, password);
    callback(client);
    client.on('error', function(error){
        console.log(error);
        client.end();
        clients.removeAt(clients.indexOf(client));
        buildClient(port, host, username, password, callback);
    });
    clients.push(client)
}

module.exports={
    name:"jabber", 
    "triggers":
    [
        {
            name:"motion-detected", 
            fields:
            [
                {name:"port", displayName:"Port"}, 
                {name:"host", displayName:"Hôte"}, 
                {name:"username", displayName:"user name"},
                {name:"password", displayName:"Mot de passe"}
            ],
            when:function(fields,callback){
                
                buildClient(fields.port, fields.host, fields.username, fields.password, function(client){
                    client.on('motionDetected', function(base64Picture){ 
                        console.log(base64Picture);
                        callback({encoding:'base64',date:new Date(), picture:base64Picture, htmlPicture:'data:image/png;base64,'+base64Picture});
                    });
                });
            }
        }
    ],
    "actions":[]
};