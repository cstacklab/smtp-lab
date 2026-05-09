import net from "node:net";

const host = process.env.SMTP_HOST || "localhost";
const port = Number(process.env.SMTP_PORT || "1025");
const from = process.env.SMTP_FROM || "dev@example.test";
const to = process.env.SMTP_TO || "user@example.test";
const username = process.env.SMTP_USERNAME || "";
const password = process.env.SMTP_PASSWORD || "";

const message = [
  `From: SMTP Lab <${from}>`,
  `To: Local Developer <${to}>`,
  "Subject: SMTP Lab test email",
  "MIME-Version: 1.0",
  "Content-Type: text/html; charset=UTF-8",
  "",
  "<h1>SMTP Lab is working</h1>",
  "<p>This message was captured locally and was not sent to the internet.</p>",
].join("\r\n");

const commands = ["EHLO smtp-lab.local"];

if (username || password) {
  commands.push(
    "AUTH LOGIN",
    Buffer.from(username).toString("base64"),
    Buffer.from(password).toString("base64"),
  );
}

commands.push(
  `MAIL FROM:<${from}>`,
  `RCPT TO:<${to}>`,
  "DATA",
  `${message}\r\n.`,
  "QUIT",
);

let index = 0;
let buffer = "";

const socket = net.createConnection({ host, port }, () => {
  console.log(`Connected to SMTP server at ${host}:${port}`);
});

socket.setEncoding("utf8");
socket.setTimeout(5000);

socket.on("data", (chunk) => {
  buffer += chunk;

  if (!buffer.endsWith("\r\n")) {
    return;
  }

  const line = buffer.trimEnd();
  buffer = "";

  if (/^[45]\d\d/.test(line)) {
    socket.destroy(new Error(`SMTP server rejected the request: ${line}`));
    return;
  }

  if (index < commands.length) {
    socket.write(`${commands[index]}\r\n`);
    index += 1;
  }
});

socket.on("timeout", () => {
  socket.destroy(new Error("Timed out waiting for the SMTP server."));
});

socket.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});

socket.on("close", () => {
  if (process.exitCode) {
    return;
  }

  console.log("Test email sent. Check the local inbox.");
});
