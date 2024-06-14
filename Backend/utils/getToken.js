const { LPModel } = require("../Schema/schema");

const getToken = async (tokenId, chainId) => {
  const token0 = await LPModel.findOne({ token0: tokenId });
  const token1 = await LPModel.findOne({ token1: tokenId });
  console.log(await LPModel.find({ token0: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" }), "testing")
  console.log(await LPModel.find({ token1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" }), "still testing")
  const token = token0 || token1;
  return token;
};

module.exports = { getToken };
