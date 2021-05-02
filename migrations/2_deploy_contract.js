var Petshop = artifacts.require("Petshop");

module.exports = async function (deployer, _network, [owner, ...accounts]) {
  // https://ipfs.io/ipfs/
  await deployer.deploy(Petshop, "Petshop", "PET", "", { from: owner });
};
