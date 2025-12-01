require("dotenv").config();

const express = require("express");

const path = require("path");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const prisma = require("./config/prismaClient");

const userRoutes = require("./routes/userRoutes");
const sitesRoutes = require("./routes/sitesRoutes");
const typeparcsRoutes = require("./routes/typeparcsRoutes");
const parcsRoutes = require("./routes/parcsRoutes");
const enginsRoutes = require("./routes/enginsRoutes");
const typepannesRoutes = require("./routes/typepannesRoutes");
const typelubrifiantsRoutes = require("./routes/typelubrifiantsRoutes");
const typeconsommationlubsRoutes = require("./routes/typeconsommationlubRoutes");
const pannesRoutes = require("./routes/pannesRoutes");
const saisiehrmRoutes = require("./routes/saisiehrmRoutes");
const rapportsRoutes = require("./routes/rapportsRoutes");
const lubrifiantsRoutes = require("./routes/lubrifiantsRoutes");
const saisielubrifiantRoutes = require("./routes/saisielubrifiantRoutes");
const objectifsRoutes = require("./routes/objectifsRoutes");
const rolesRoutes = require("./routes/RoleRoutes");
const resourcesRoutes = require("./routes/resourceRoutes");
const permissionsRoutes = require("./routes/permissionRoutes");
const assignRoutes = require("./routes/assignRoutes");
const importRoutes = require("./routes/importRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const anomalieRoutes = require("./routes/anomalieRoutes");

// express app
const app = express();

const PORT = process.env.PORT || 4000;

// Enable CORS
app.use(cors(corsOptions));
app.use(cookieParser());

// allow json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import static files
app.use("/", express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// routes
app.use("/", require("./routes/rootRoutes"));
// app.use('/auth', require('./routes/authRoutes'))

app.use("/user", userRoutes);
app.use("/sites", sitesRoutes);
app.use("/typeparcs", typeparcsRoutes);
app.use("/parcs", parcsRoutes);
app.use("/engins", enginsRoutes);
app.use("/typepannes", typepannesRoutes);
app.use("/typelubrifiants", typelubrifiantsRoutes);
app.use("/typeconsommationlubs", typeconsommationlubsRoutes);
app.use("/pannes", pannesRoutes);
app.use("/saisiehrm", saisiehrmRoutes);
app.use("/rapports", rapportsRoutes);
app.use("/lubrifiants", lubrifiantsRoutes);
app.use("/saisielubrifiant", saisielubrifiantRoutes);
app.use("/objectifs", objectifsRoutes);
app.use("/roles", rolesRoutes);
app.use("/permissions", permissionsRoutes);
app.use("/assign", assignRoutes);
app.use("/resources", resourcesRoutes);
app.use("/import", importRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/anomalies", anomalieRoutes);

// 404 route
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "./views/404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// PRISMA & RUN SERVER
prisma
  .$connect()
  .then(() => {
    // listen for requests
    app.listen(PORT, () => {
      console.log(
        `Server Connected to DB & running on port http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
