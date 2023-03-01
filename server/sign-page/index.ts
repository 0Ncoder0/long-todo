import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

interface User {
  id: string;
  token: string;
  email: string;
  password: string;
  invitationCode: string;
}

interface VerificationCode {
  code: string;
  email: string;
  codeType: "Register" | "RestPassword";
}

const app = express();
const PORT = 3000;
const usersFile = path.resolve(__dirname, "./users.json");

// Mock database
let users: User[] = JSON.parse(fs.readFileSync(usersFile).toString() || "[]");
let verificationCodes: VerificationCode[] = [];

// Middleware
app.use(bodyParser.json());

// Routes
app.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    res.status(200).json({
      code: "Success",
      data: { id: user.id, token: user.token },
    });
  } else {
    res.status(400).json({ code: "WrongPassword" });
  }
});

app.post("/register", (req: Request, res: Response) => {
  const { email, password, verificationCode, invitationCode } = req.body;

  // Check if email already exists
  if (users.some((u) => u.email === email)) {
    res.status(400).json({ code: "EmailExist" });
    return;
  }

  // Check if verification code is correct
  const verificationCodeIndex = verificationCodes.findIndex((v) => {
    return (
      v.code === verificationCode &&
      v.email === email &&
      v.codeType === "Register"
    );
  });
  if (verificationCodeIndex === -1) {
    res.status(400).json({ code: "WrongVerificationCode" });
    return;
  }

  // Remove verification code
  verificationCodes.splice(verificationCodeIndex, 1);

  // Create new user
  const id = uuidv4();
  const token = uuidv4();
  const newUser: User = { email, password, id, token, invitationCode };
  users.push(newUser);
  fs.writeFileSync(usersFile, JSON.stringify(users));

  res.status(200).json({ code: "Success", data: { id, token } });
});

app.post("/reset-password", (req: Request, res: Response) => {
  const { email, password, verificationCode } = req.body;

  // Check if email exists
  const userIndex = users.findIndex((u) => u.email === email);
  if (userIndex === -1) {
    res.status(400).json({ code: "EmailNotExist" });
    return;
  }

  // Check if verification code is correct
  const verificationCodeIndex = verificationCodes.findIndex((v) => {
    return (
      v.code === verificationCode &&
      v.email === email &&
      v.codeType === "RestPassword"
    );
  });
  if (verificationCodeIndex === -1) {
    res.status(400).json({ code: "WrongVerificationCode" });
    return;
  }
  // Remove verification code
  verificationCodes.splice(verificationCodeIndex, 1);

  // Update user password
  users[userIndex].password = password;
  fs.writeFileSync(usersFile, JSON.stringify(users));

  res.status(200).json({ code: "Success", data: null });
});

app.post("/send-verification-code", (req: Request, res: Response) => {
  const { email, codeType } = req.body;

  while (true) {
    const index = verificationCodes.findIndex((vc) => {
      return vc.email === email && vc.codeType === codeType;
    });

    if (index === -1) break;
    else verificationCodes.splice(index, 1);
  }

  // Generate new verification code
  const code = "666666";

  // Add verification code to database
  verificationCodes.push({ email, codeType, code });

  res.status(200).json({ code: "Success", data: null });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
