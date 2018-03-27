var _ = require('lodash');
var WebSocket = require('ws');
var wss = new WebSocket.Server({
  port:443
});

wss.on('connection', function(ws){
  console.log("-------------------------------------------------")
  console.log("Connection - New Client Connected")
  //Store IP
  ws.ip = ws.upgradeReq.connection.remoteAddress
  ws.ip = ws.ip.substring(ws.ip.lastIndexOf(":")+1);
  ws.on('message', function(msg, flags){
    var isbinary = flags.binary || false;
    if(isbinary){
	     if(ws.pairedClient) ws.pairedClient.send(msg);
	     return false;
    }
    var data = JSON.parse(msg);
    if(!data.hasOwnProperty("status")){
      console.log("No status found in websocket message")
      return false;
    }
    switch(data.status){
      //Any status with wss is a specific server command, everything else is a passthrough to the connected client

      //Activate client to the server with their remote code
      case "wss-activate":
        if(data.remoteCode){
          console.log("Activate - Client Connection Stored with remote code:", data.remoteCode)
          ws.remoteCode = data.remoteCode;
          ws.type = data.type;
          return;
        }
        console.log("Activate - Remote Code Missing")
      break;

      //Search for a pair between a presentation client and a remote client, requires a remoteCode property to pair
      case "wss-pairing":
        console.log("Pairing - Started");
        //If client is already paired, unpair
        if(ws.pairedClient) removePairing(ws);
        if(data.remoteCode){
          var foundClient = findClientPair(ws, data.remoteCode);
          if(foundClient){
            ws.pairedClient = foundClient;
            foundClient.pairedClient = ws;
            sendSuccess(ws, foundClient.ip);
            sendSuccess(foundClient, ws.ip);
            console.log("Pairing Successful:",data.remoteCode);
            return;
          }
          console.log("Pairing - No Matching Client Found with remote code:",data.remoteCode);
          return;
        }
        console.log("Pairing - No Remote Code Sent");
      break;

      //Disconnect paired clients
      case "wss-unpairing":
        getClients().forEach(function(client){
          if(client.hasOwnProperty("type") && client.hasOwnProperty("pairedClient")){
            if(client.type === "remote") client.terminate();
          }
        })
        //removePairing(ws);
      break;

      //Catch anything without wss- as a status command to the paired client
      default:
        if(ws.pairedClient){
          ws.pairedClient.send(JSON.stringify({
           status: data.status,
           data: data.hasOwnProperty("data") ? data.data : undefined
         }));
        }else{
          sendError(ws, "No Paired Client found")
        }
      break;

    }
  })

  ws.on('close', function (ws) {
    console.log('Client Disconnected');
    removePairing(this);
  })

})

//Used to search from one client to all other clients, returns the matching client
function findClientPair(searchingClient, remoteCode){
  console.log("Searching",getClients().length,"client(s) for a matching pair...");
  return _.find(getClients(), function(client) {
    return (client !== wss && client.readyState === WebSocket.OPEN && searchingClient != client && client.remoteCode === remoteCode)
  });
}
function sendSuccess(client, ip){
  if(client.readyState === WebSocket.OPEN){
    console.log("success sent")
    client.send(JSON.stringify({ status:"wss-success", ip:ip }));
  }
}
function sendDisconnect(client){
  if(client.readyState === WebSocket.OPEN){
    client.send(JSON.stringify({ status:"wss-disconnect" }));
  }
}
function sendError(client, msg){
  client.send(JSON.stringify({
   status:"wss-error",
   msg: msg
 }));
}
function removePairing(client){
  //Removes remote code pairing association between two clients, and sends a disconnect to both
  if(client.pairedClient){
    client.pairedClient.pairedClient = null;
    sendDisconnect(client.pairedClient);
    client.pairedClient = null;
    sendDisconnect(client);
    console.log("Unpairing Successful");
  }
}
function getClients(){
  //Converts the clients Set object to an array
  return Array.from(wss.clients);
}
