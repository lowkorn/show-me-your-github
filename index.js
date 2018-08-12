const app = require("./lib/app");

app.listen(app.get("port"), () => {
    console.log("show-me-your-github running on port", app.get("port"));
});
