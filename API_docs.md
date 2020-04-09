# chatterbox-server API docs

## describe your API server

- 클라이언트가 서버의 API를 활용할 수 있게 api server에 대한 문서를 작성 해주세요.
- ex)

| Method | URL               | Body                                            | response                                             |
| ------ | ----------------- | ----------------------------------------------- | ---------------------------------------------------- |
| get    | /classes/messages | null                                            | `{results:[]}`                                       |
| post   | /classes/messages | `{username:'codestates',message:'hello world'}` | `{id:1,username:'codestates',message:'hello world'}` |

- GET
  - Needed auth check
    - /classes/mesages - chatter box의 메세지들을 리턴한다
    - 리턴형식

```javascript
            [
                {
                    "username": "Go",
                    "text": "555",
                    "roomname": "로비",
                },
                {
                    "username": "Go",
                    "text": "reset",
                    "roomname": "코드스테이츠",
                }
                {
                    "username": "LogIn",
                    "text": "잘자라우리아기",
                    "roomname": "...usb",
                }
            ]
```

- POST
  - /classes/mesages - 클라이언트는 아래 요청 형식에 맞춰 요청한다
  - 요청 형식

```javascript
           {
                "username": "Go",
                "text": "555",
                "roomname": "로비",
            }
```
