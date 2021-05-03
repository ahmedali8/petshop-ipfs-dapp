const metadataTemple = {
  name: "",
  image: "",
  attributes: [
    {
      trait_type: "Breed",
      value: "",
    },
    {
      trait_type: "Location",
      value: "",
      label: "",
    },
    {
      trait_type: "Age",
      value: 0,
    },
  ],
};

const createMetaData = async (name, imgHash, breed, location, age) => {
  let petMetadata = metadataTemple;

  console.log(petMetadata["name"]);
  petMetadata["name"] = name;
  petMetadata["image"] = imgHash;

  petMetadata["attributes"][0]["value"] = breed;
  petMetadata["attributes"][1]["value"] = location.value;
  petMetadata["attributes"][1]["label"] = location.label;
  petMetadata["attributes"][2]["value"] = age;

  // let filename =
  //   "metadata/" + petMetadata["name"].toLowerCase().replace(/\s/g, "-");
  // console.log("filename ", filename);
  let data = JSON.stringify(petMetadata);
  console.log("data ", data);
  return data;
};

export default createMetaData;

// https://ipfs.infura.io/ipfs/QmW41jh6XTXpJMbVvKvJX1ApLdxbGdVqLr1AeBpvnALBvg
// https://ipfs.infura.io/ipfs/QmSqjar2PnCQcNxvbLbdMXyg2nPBnmzbnqYmqs6BQHPEwT
