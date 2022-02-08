// Express Webserver ma hast
const express = require("express");
// ijad yek intance az express
const app = express();
const port = process.env.PORT || 3000;
// import package
const { StaticPool } = require("node-worker-threads-pool");

const pool = new StaticPool({
  size: 8,
  task: "./worker.js",
});

app.use("/files", express.static("./files"));
app.use(express.json());

app.get("/", (req, res) => res.send("I'm Alive!"));

app.post("/resize", (req, res) => {
  pool.exec({ imgs: req.body }).then((result) => {
    console.log("sending");
    res.status(200).send(result);
  });
});
app.listen(port, () => console.log(`Resizer is running on ${port}`));
