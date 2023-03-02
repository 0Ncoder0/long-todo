### 了解浏览器的 Fetch API

### 使用 Fetch API 完成与服务端交互的登录注册忘记密码页

使用 Fetch API 代替 localStorage 实现登陆注册忘记密码页，保持交互不变， 并将服务端返回的 id 和 token 保存到 sessionStorage 中

接口定义:

```md
# 登录

post:
`http://server.capital-lb.top:3000/login`
data:
`{ email:string, password:string }`
result:
`{ code:string, data?:{ id:string, token:string } }`
code:
`Success:成功`
`WrongPassword:账号或密码错误`

# 注册

post:
`http://server.capital-lb.top:3000/register`
data:
`{ email:string, password:string, verificationCode:string, invitationCode:string }`
result:
`{ code:string, data?:{ id:string, token:string } }`
code:
`Success:成功`
`EmailExist:邮箱已存在`
`WrongVerificationCode:验证码错误`

# 重置密码

post:
`http://server.capital-lb.top:3000/reset-password`
data:
`{ email:string, password:string, verificationCode:string }`
result:
`{ code:string, data:null }`
code:
`Success:成功`
`EmailNotExist:邮箱不存在`
`WrongVerificationCode:验证码错误`

# 发送验证码 (验证码固定为: 666666)

post:
`http://server.capital-lb.top:3000/send-verification-code`
data:
`{ email:string, codeType:"Register"|"RestPassword" }`
result:
`{ code:string, data:null }`
code:
`Success:成功`
```
