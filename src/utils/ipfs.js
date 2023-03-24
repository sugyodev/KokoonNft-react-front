export const getIpfsHash = async (data) => {
  // const result = await pinata.pinJSONToIPFS(data);
  // const hash = result.IpfsHash;
  // return hash;
  return new Promise((resolve, reject) => {
    var headers = new Headers();
    headers.append("pinata_api_key", process.env.REACT_APP_PINATA_API_KEY);
    headers.append("pinata_secret_api_key", process.env.REACT_APP_PINATA_API_SECRET);
    headers.append("Content-Type", "application/json");
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    };
    fetch(`https://api.pinata.cloud/pinning/pinJSONToIPFS`, requestOptions)
      .then((r) => r.json())
      .then((r) => {
        resolve(r.IpfsHash);
      })
      .catch((error) => reject(error));
  });
};

export const getIpfsHashFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    var headers = new Headers();
    headers.append("pinata_api_key", process.env.REACT_APP_PINATA_API_KEY);
    headers.append("pinata_secret_api_key", process.env.REACT_APP_PINATA_API_SECRET);
    var formdata = new FormData();
    formdata.append("file", file);
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: formdata,
    };
    fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, requestOptions)
      .then((r) => r.json())
      .then((r) => {
        resolve(r.IpfsHash);
      })
      .catch((error) => reject(error));
  });
};
