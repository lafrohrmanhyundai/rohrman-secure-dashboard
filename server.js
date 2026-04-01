const express = require("express");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 3000;
const APP_USERNAME = process.env.APP_USERNAME || "rhs";
const APP_PASSWORD = process.env.APP_PASSWORD || "rhs2026";
const SESSION_SECRET = process.env.SESSION_SECRET || "change-this-in-production";

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  name: "rohrman.sid",
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 1000 * 60 * 60 * 12
  }
}));

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect("/login");
}

app.get("/", (req, res) => {
  if (req.session && req.session.user) return res.redirect("/dashboard");
  return res.redirect("/login");
});

app.get("/login", (req, res) => {
  if (req.session && req.session.user) return res.redirect("/dashboard");
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.post("/login", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  if (username === APP_USERNAME && password === APP_PASSWORD) {
    req.session.user = username;
    return res.redirect("/dashboard");
  }
  return res.status(401).sendFile(path.join(__dirname, "views", "login-failed.html"));
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("rohrman.sid");
    res.json({ ok: true });
  });
});

app.get("/dashboard", requireAuth, (req, res) => {
  const raw = fs.readFileSync(path.join(__dirname, "public", "dashboard.html"), "utf8");
  const withUser = raw.replace(/__SESSION_USER__/g, String(req.session.user || ""));
  res.type("html").send(withUser);
});

app.use("/assets", express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Rohrman secure dashboard running on http://localhost:${PORT}`);
});