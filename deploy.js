const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();
const settings = require("./deploy.conf").getFtpParams();
console.log({ settings });
const config = {
  user: settings.username,
  password: settings.password,
  host: settings.host,
  port: settings.port,
  localRoot: __dirname + "/" + settings.localRoot,
  remoteRoot: settings.remoteRoot,
  include: ["*", "**/*"],
  deleteRemote: true, // !! Be very careful
  forcePasv: true
};

ftpDeploy
  .deploy(config)
  .then(res => console.log("finished:", res))
  .catch(err => console.log(err));
