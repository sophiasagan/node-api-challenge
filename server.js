// const express = require("express");
// const cors = require("cors");

// const projectRoutes = require("./routes/projectRouter");
// const actionRoutes = require("./routes/actionRouter");

// const server = express();

// server.use(express.json(), logger);
// server.use(cors());

// server.get("/", (req, res) => {
//   res.send(`<h2>Welcome to API Challenge</h2>`);
// });

// server.use("/api/projects", projectRoutes);
// server.use("/api/actions", actionRoutes);

// function logger(req, res, next) {
//     console.log(`${req.method} Request to ${req.originalUrl} ${Date(Date.now).toString()}`);
//     next();
// }

// module.exports = server;

const express = require("express");

// const helmet = require("helmet");
// const morgan = require("morgan");
// const logger = require('logger')
const actionRoutes = require("./routes/actionRouter");
const projectRoutes = require("./routes/projectRouter");
const server = express();
// const port = process.env.PORT || 4001;
server.use(express.json(), logger);
// server.use(helmet());
// server.use(morgan("combined"));

server.use("/actions", actionRoutes);
server.use("/projects", projectRoutes);

server.use("/", (req, res) => {
    res.status(200).send("API is working");
});

server.use((err, req, res, next) => {
    console.error(err);

    if (err) {
        res
            .status(500)
            .json({
                message: "There was an error performing the required operation",
            });
    }
});

function logger(req, res, next) {
    console.log(`${req.method} Request to ${req.originalUrl} ${Date(Date.now).toString()}`);
    next();
}
// server.listen(port, () => {
//   console.log(`server is listening on port ${port}`);
// });

module.exports = server;