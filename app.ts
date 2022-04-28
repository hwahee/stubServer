import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs"

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.get("/", (req, res) => {
  res.send("hello");
});

function base64_encode(fp:fs.PathLike) {
  return fs.readFileSync(fp, 'base64');
}

app.get("/stub_wait/:ms", (req, res) => {
  console.log(`request from: ${req.ip}`);
  const ms: number = +req.params.ms;
  if (Number.isNaN(ms)) {
    res
      .status(400)
      .send(`This is stub wait and you gave me invalid parameter.`);
  } else {
    setTimeout(() => {
      console.log("Sending OK");
      res.send(`This is stub wait and you waited more than ${ms}ms.`);
    }, ms);
  }
});

app.post("/stub_send_image", async (req, res) =>{
  console.log(req.body.u_base64.slice(0, 45))
  req.pipe(fs.createWriteStream(path.join(__dirname, 'public', `file.json`)))
  const data=await base64_encode(path.join(__dirname, `public`, `painting.jpg`))
  res.send({image:data})
});

const PORT = 2002;
app.listen(PORT, () => {
  console.log(`http listening on port: ${PORT}`);
});
