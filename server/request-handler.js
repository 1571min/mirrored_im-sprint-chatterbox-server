/*************************************************************

request handler 함수를 여기서 작성합니다.

reuqestHandler 함수는 이미 basic-server.js 파일에서 사용 했지만, 아직 작동하지 않습니다.

requestHandler 함수를 export 하여 basic-server.js 에서 사용 할 수 있게 하세요

**************************************************************/
const url = require('url');
const fs = require('fs');
let chats = {
  results: [],
};

let database = {
  writeFile: (chats) => {
    fs.open('./chatdata.json', 'w', (err, fd) => {
      if (err) throw err;
      let chatsBuf = new Buffer(JSON.stringify(chats.results));
      fs.write(
        fd,
        chatsBuf,
        0,
        chatsBuf.length,
        null,
        (err, written, buffer) => {
          if (err) throw err;
          fs.close(fd, () => {
            console.log('파일 열고 읽고 쓰기 완료');
          });
        }
      );
    });
  },
  readFile: (cb) => {
    fs.readFile('./chatdata.json', 'utf-8', (err, data) => {
      cb(data);
    });
  },
};

const requestHandler = function (request, response) {
  // node server 의 requestHandler는 항상 request, response를 인자로 받습니다.

  // 또한 http 요청은 항상 요청과 응답이 동반 되어야 합니다.
  //
  // 이것들은 요청에 대한 정보를 담고 있습니다. 예를들면, 요청 url과 method 등을 담고 있습니다.
  //
  // 기본적인 로그를 작성 하세요
  //
  // 간단한 로그를 작성 하는 것은, 서버를 디버깅 하는데 매우 수월하게 해줍니다.
  // 아래는 모든 리퀘스트의 메소드와 url을 로깅 해줍니다.
  const statusCode = 200;

  console.log(
    'Serving request type ' + request.method + ' for url ' + request.url
  );

  // 응답을 위한 status 코드입니다.

  // 기본 CORS 설정이 되어있는 코드 입니다. 아래에 있습니다.
  // CORS에 대해서는 조금더 알아보세요.
  const headers = defaultCorsHeaders;
  // 응답 헤더에 응답하는 컨텐츠의 자료 타입을 헤더에 기록 합니다.
  headers['Content-Type'] = 'text/plain';

  // .writeHead() 메소드는 응답 헤더에 해당 key, value 를 적어줍니다.
  //response.writeHead(statusCode, headers);

  // 노드 서버에 대한 모든 요청은 응답이 있어야 합니다. response.end 메소드는 요청에 대한 응답을 보내줍니다.
  let queryData = url.parse(request.url, true).query;
  let messageReg = new RegExp('/message?[^s$.?#].[^s]*$');

  if (request.method === 'OPTIONS') {
    response.writeHead(statusCode, headers);
    response.end();
  } else if (request.method === 'GET') {
    database.readFile((fileData) => {
      chats.results = JSON.parse(fileData);
      if (request.url.match(messageReg)) {
        response.writeHead(statusCode, headers);
        if (queryData.id) {
          response.write(JSON.stringify(chats.results[queryData.id]));
        } else {
          response.write(JSON.stringify(chats));
        }
      } else {
        response.writeHead(404, headers);
      }
      response.end();
    });
  } else if (request.method === 'POST') {
    database.readFile((fileData) => {
      let body = [];
      request.on('data', (chunk) => {
        body.push(chunk);
      });
      request.on('end', () => {
        chats.results = JSON.parse(fileData);
        body = Buffer.concat(body).toString();
        let chat = JSON.parse(body);
        chat['id'] = chats.results.length;
        chat['date'] = new Date();
        chats.results.push(JSON.parse(body));
        response.writeHead(201, headers);
        response.end(JSON.stringify(chats));
        database.writeFile(chats);
      });
    });
  }
  // response.end();
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
const defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
};

module.exports = requestHandler;
