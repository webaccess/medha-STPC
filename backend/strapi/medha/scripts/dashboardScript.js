var url = require("url");
var adr = "http://localhost:1338/addDashboardData?fromScript=true";

(async () => {
  await dashboard();
  console.log("\n");
  process.exit(0);
})();

async function dashboard() {
  var q = url.parse(adr, true);
  console.log();
}
