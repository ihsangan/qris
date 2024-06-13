function getMerchInfo(data) {
  let acquirerNumLen = parseInt(data.slice(18, 20));
  let acquirerName = data.slice(20, 20 + acquirerNumLen).split('.').reverse().join('.').toLowerCase();
  let sliceData = data.slice(22 + acquirerNumLen);
  let mpan = sliceData.slice(2, 2 + 18);
  let nns = sliceData.slice(2, 2 + 8);
  let mid = sliceData.slice(2 + 8, 2 + 18);
  sliceData = sliceData.slice(22);
  let tidNumLen = parseInt(sliceData.slice(0, 2));
  let tid = sliceData.slice(2, 2 + tidNumLen);
  sliceData = sliceData.slice(tidNumLen + 6);
  let category = sliceData.slice(0, 3).toLowerCase();
  sliceData = sliceData.slice(9);
  let switchNumLen = parseInt(sliceData.slice(0, 2));
  let switching = sliceData.slice(2, 2 + switchNumLen).split('.').reverse().join('.').toLowerCase();
  sliceData = sliceData.slice(6 + switchNumLen);
  let nmid = sliceData.slice(0, 15);
  sliceData = sliceData.slice(26);
  let mcc = sliceData.slice(0, 4);
  sliceData = sliceData.slice(11);
  let nameIndex = sliceData.indexOf('D59') + 3;
  let nameLen = parseInt(sliceData.slice(nameIndex, nameIndex + 2));
  let name = sliceData.slice(nameIndex + 2, nameIndex + 2 + nameLen);
  sliceData = sliceData.slice(nameIndex + 4 + nameLen);
  let cityLen = parseInt(sliceData.slice(0, 2));
  let city = sliceData.slice(2, 2 + cityLen);
  sliceData = sliceData.slice(6 + cityLen);
  let post = sliceData.slice(0, 5);
  sliceData = sliceData.slice(5);
  let crcIndex = sliceData.indexOf('6304') + 4;
  let crc = sliceData.slice(crcIndex);
  return {
    acquirer: acquirerName,
    mpan: mpan,
    nns: nns,
    mid: mid,
    tid: tid,
    category: category,
    switching: switching,
    nmid: nmid,
    mcc: mcc,
    name: name,
    city: city,
    post: post,
    crc: crc
  };
};

let crcTable = [0, 4129, 8258, 12387, 16516, 20645, 24774, 28903, 33032, 37161, 41290, 45419, 49548, 53677, 57806, 61935, 4657, 528, 12915, 8786, 21173, 17044, 29431, 25302, 37689, 33560, 45947, 41818, 54205, 50076, 62463, 58334, 9314, 13379, 1056, 5121, 25830, 29895, 17572, 21637, 42346, 46411, 34088, 38153, 58862, 62927, 50604, 54669, 13907, 9842, 5649, 1584, 30423, 26358, 22165, 18100, 46939, 42874, 38681, 34616, 63455, 59390, 55197, 51132, 18628, 22757, 26758, 30887, 2112, 6241, 10242, 14371, 51660, 55789, 59790, 63919, 35144, 39273, 43274, 47403, 23285, 19156, 31415, 27286, 6769, 2640, 14899, 10770, 56317, 52188, 64447, 60318, 39801, 35672, 47931, 43802, 27814, 31879, 19684, 23749, 11298, 15363, 3168, 7233, 60846, 64911, 52716, 56781, 44330, 48395, 36200, 40265, 32407, 28342, 24277, 20212, 15891, 11826, 7761, 3696, 65439, 61374, 57309, 53244, 48923, 44858, 40793, 36728, 37256, 33193, 45514, 41451, 53516, 49453, 61774, 57711, 4224, 161, 12482, 8419, 20484, 16421, 28742, 24679, 33721, 37784, 41979, 46042, 49981, 54044, 58239, 62302, 689, 4752, 8947, 13010, 16949, 21012, 25207, 29270, 46570, 42443, 38312, 34185, 62830, 58703, 54572, 50445, 13538, 9411, 5280, 1153, 29798, 25671, 21540, 17413, 42971, 47098, 34713, 38840, 59231, 63358, 50973, 55100, 9939, 14066, 1681, 5808, 26199, 30326, 17941, 22068, 55628, 51565, 63758, 59695, 39368, 35305, 47498, 43435, 22596, 18533, 30726, 26663, 6336, 2273, 14466, 10403, 52093, 56156, 60223, 64286, 35833, 39896, 43963, 48026, 19061, 23124, 27191, 31254, 2801, 6864, 10931, 14994, 64814, 60687, 56684, 52557, 48554, 44427, 40424, 36297, 31782, 27655, 23652, 19525, 15522, 11395, 7392, 3265, 61215, 65342, 53085, 57212, 44955, 49082, 36825, 40952, 28183, 32310, 20053, 24180, 11923, 16050, 3793, 7920];

function crc16($) {
  var X, F, A = 65535;
  for (F = 0; F < $.length; F++) {
    if ((c = $.charCodeAt(F)) > 255) throw RangeError();
    A = crcTable[X = (c ^ A >> 8) & 255] ^ A << 8
  }
  return (0 ^ A) & 65535
};

function generateQRIS(d, p) {
  let data = d.slice(0, -4).replace('11', '12').replace('3360', `3360540${p.length}${p}`)
  let c = crc16(data).toString(16).toUpperCase()
  if (c.length === 3) {
    c = `0${c}`
  }
  d = `${data}${c}`;
  return d;
};
