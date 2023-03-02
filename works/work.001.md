### 了解 JSON, 了解 JavaScript 中的 JSON.stringify, JSON.parse

### 了解 html5 的 localStorage sessionStorage

### 使用 localStorage 实现本地的登录注册忘记密码页

1. 登陆时，密码错误则报错，报错信息: Email or Password is wrong, please check
2. 注册时，邮箱已存在则报错，报错信息: Email has Registered
3. 注册时，验证码输入 666666 则算通过，否则报错，报错信息: Wrong verification code
4. 重置密码时，验证码输入 666666 则算通过，否则报错，报错信息: Wrong verification code
5. 重置密码时，邮箱不存在则报错，报错信息: Email has not registered
6. 重置密码时，两次输入的密码不相同则报错，报错信息: Passwords are not same, please check
7. 重置密码时，成功后返回登录页
8. 登录成功时，提示信息(同报错信息，背景颜色改为#F0F9EB): Login succeeded

示例代码:

```ts
type User = { email: string; password: string };
const login = (email: string, password: string): User | undefined => {
  const usersJSON = localStorage.getItem("users");
  const users = JSON.parse(userJSON || "[]");

  // find 是数组自带的方法，详情百度
  const user = users.find((user) => {
    return user.email === email && user.password === password;
  });

  return user;
};

const user = login("email.email@email", "123465");
if (user) {
  // 登录成功
} else {
  // 账号或密码错误
}
```
