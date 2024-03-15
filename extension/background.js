// From https://tech.mybuilder.com/determining-if-an-ipv4-address-is-within-a-cidr-range-in-javascript/

const ip4ToInt = (ip) =>
  ip.split(".").reduce((int, oct) => (int << 8) + parseInt(oct, 10), 0) >>> 0;

const isIp4InCidr = (ip) => (cidr) => {
  const [range, bits = 32] = cidr.split("/");
  const mask = ~(2 ** (32 - bits) - 1);
  return (ip4ToInt(ip) & mask) === (ip4ToInt(range) & mask);
};

const isIp4InCidrs = (ip, cidrs) => cidrs.some(isIp4InCidr(ip));

isIp4InCidrs("192.168.1.5", ["10.10.0.0/16", "192.168.1.1/24"]); // true

// https://gist.github.com/mjamesd/e9fc7359e7c40478f0dffaebe3852401
const ipv4_regex =
  /(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d{1})\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d{1})/g;

const aws_eu_south_2_cidrs = [
  "150.222.50.32/27",
  "52.95.136.0/23",
  "13.34.38.64/27",
  "13.34.38.160/27",
  "150.222.50.64/27",
  "13.34.38.0/27",
  "35.71.120.0/24",
  "13.34.38.128/27",
  "13.34.38.96/27",
  "15.177.97.0/24",
  "52.95.138.0/24",
  "52.94.249.240/28",
  "51.92.0.0/16",
  "13.248.65.0/24",
  "51.94.0.0/15",
  "99.151.64.0/21",
  "99.77.32.0/20",
  "51.93.0.0/16",
  "13.34.38.32/27",
  "3.5.32.0/22",
  "54.239.1.192/28",
  "18.100.0.0/15",
  "150.222.50.96/27",
  "99.77.28.0/22",
  "99.77.48.0/21",
  "52.95.136.0/23",
  "52.95.138.0/24",
  "3.5.32.0/22",
  "35.71.120.0/24",
  "13.248.65.0/24",
  "99.77.55.3/32",
  "99.77.55.24/32",
  "99.77.55.26/32",
  "35.71.120.0/24",
  "99.77.55.254/32",
  "99.77.55.25/32",
  "99.77.55.14/32",
  "99.77.55.0/32",
  "99.77.55.2/32",
  "15.177.97.0/24",
  "99.77.55.253/32",
  "52.94.249.240/28",
  "99.77.55.1/32",
  "51.92.0.0/16",
  "99.151.64.0/21",
  "3.5.32.0/22",
  "99.77.55.15/32",
  "99.77.55.12/32",
  "99.77.55.27/32",
  "18.100.0.0/15",
  "99.77.55.255/32",
  "99.77.55.13/32",
  "15.177.97.0/24",
  "18.100.160.0/24",
  "18.100.184.0/25",
  "18.100.184.128/25",
  "18.100.194.128/25",
  "18.100.196.128/25",
  "18.100.209.192/28",
  "18.100.209.224/28",
  "18.100.209.240/28",
  "18.100.64.128/26",
  "18.100.64.192/26",
  "18.100.65.0/26",
  "18.100.66.0/23",
  "18.100.71.128/25",
  "18.100.74.0/23",
  "18.101.212.0/23",
  "18.101.80.0/22",
  "18.101.84.0/23",
  "18.101.90.48/29",
];

//  Adapted from https://medium.com/geekculture/what-i-built-3-browser-extension-for-intercept-and-detect-requests-country-of-ip-address-5fa843186097

async function logURL(requestDetails) {
  console.log("in logURL - allfields");
  const hostname = new URL(requestDetails.url).hostname;
  const ip = await browser.dns.resolve(hostname);
  console.log("IP", ip.addresses, "-allfields");

  ip4s = ip.addresses.filter((ip) => ipv4_regex.test(ip));

  console.log("ip4s", ip4s, "-allfields");

  if (ip4s.some((ip) => isIp4InCidrs(ip, aws_eu_south_2_cidrs))) {
    console.log("MATCHED! AWS ZARAGOZA - allfields");
    browser.runtime.sendMessage({ message: "aws_zaragoza" });
  }
}
console.log("registering listener - allfields");

browser.webRequest.onBeforeRequest.addListener(
  logURL,
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["blocking"]
);
