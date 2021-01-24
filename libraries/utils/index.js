const moment = require('moment');
const mongoose = require('mongoose');

const toObjId = async (string) => mongoose.Types.ObjectId(string);

const getQuery = (query, keyword, type) => { // untuk pencarian di dalam list
  res = {};
  for (const key in query) {
    if (key.includes(keyword)) {
      const newKey = key.replace(keyword, '');
      if (type === 'like') {
        res[newKey] = { $regex: `.*${query[key]}.*`, $options: 'i' };
      } else if (type === 'bool') {
        if (query[key] === 'false' || query[key] === '0') {
          res[newKey] = false;
        } else if (query[key] === 'true' || query[key] === '1') {
          res[newKey] = true;
        } else {
          res[newKey] = false;
        }
      } else if (type === 'number') {
        res[newKey] = Number(query[key]);
      } else if (type === 'in') {
        res[newKey] = { $in: query[key] };
      } else if (type === 'objid') {
        res[newKey] = mongoose.Types.ObjectId(query[key]);
      } else if (type === 'exists') {
        if (query[key] === 'false' || query[key] === '0') {
          res[newKey] = null;
        } else if (query[key] === 'true' || query[key] === '1') {
          res[newKey] = { $ne: null };
        } else {
          res[newKey] = { $ne: null };
        }
      } else {
        res[newKey] = query[key];
      }
    }
  }
  return res;
};

const getQueryOr = (query, keyword, type) => { // untuk pencarian di dalam list
  const res = [];
  for (const key in query) {
    const obj = {};
    if (key.includes(keyword)) {
      const newKey = key.replace(keyword, '');
      if (type === 'like') {
        obj[newKey] = { $regex: `.*${query[key]}.*`, $options: 'i' };
      } else {
        obj[newKey] = query[key];
      }
    }
    if (Object.keys(obj).length > 0) res.push(obj);
  }

  if (res.length > 0) {
    return res;
  }
  return [{}];
};

const betweenDate = (filter) => {
  res = {};

  for (const key in filter) {
    const string = filter[key];
    const dates = string.split('|');
    if (string.indexOf('|') == string.length - 1) { // jika hanya startdate
      dates[1] = '2100-01-01';
    } else if (string.indexOf('|') == 0) { // jika hanya enddate
      dates[0] = '1900-01-01';
    }

    res[key] = {
      $gte: new Date(moment(dates[0]).utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')),
      $lte: new Date(moment(dates[1]).utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')),
    };
  }

  return res;
};


const getFirstDayOfPastMonths = async (months) => {
  const res = await moment().utc().subtract(months, 'months').startOf('month')
    .format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  return res;
};

const getLastDayOfPastMonths = async (months) => {
  const res = await moment().utc().subtract(months, 'months').endOf('month')
    .format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  return res;
};

const pad_with_zeroes = (number, length) => {
  let my_string = `${number}`;
  while (my_string.length < length) {
    my_string = `0${my_string}`;
  }

  return my_string;
};

const getMonthNumber = (monthName) => {
  let months = {};
  if (monthName.length < 4) {
    months = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };
  } else {
    months = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12',
    };
  }

  return months[monthName];
};

const penyebut = (value) => {
  value = Math.floor(Math.abs(Number(value)));

  const words = [
    '', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas',
  ];
  let temp = '';
  if (value < 12) {
    temp = ` ${words[value]}`;
  } else if (value < 20) {
    temp = `${penyebut(value - 10)} belas`;
  } else if (value < 100) {
    temp = `${penyebut(value / 10)} puluh${penyebut(value % 10)}`;
  } else if (value < 200) {
    temp = ` seratus${penyebut(value - 100)}`;
  } else if (value < 1000) {
    temp = `${penyebut(value / 100)} ratus${penyebut(value % 100)}`;
  } else if (value < 2000) {
    temp = ` seribu${penyebut(value - 1000)}`;
  } else if (value < 1000000) {
    temp = `${penyebut(value / 1000)} ribu${penyebut(value % 1000)}`;
  } else if (value < 1000000000) {
    temp = `${penyebut(value / 1000000)} juta${penyebut(value % 1000000)}`;
  } else if (value < 1000000000000) {
    temp = `${penyebut(value / 1000000000)} milyar${penyebut(value % 1000000000)}`;
  } else if (value < 1000000000000000) {
    temp = `${penyebut(value / 1000000000000)} trilyun${penyebut(value % 1000000000000)}`;
  }

  return temp;
};

const terbilang = (value) => {
  let result = '';
  if (value < 0) {
    result = `minus ${penyebut(value).trim()}`;
  } else {
    result = penyebut(value).trim();
  }

  return result;
};
// const currency = new Intl.NumberFormat('id-ID', {
//     style: 'currency',
//     currency: 'IDR',
//     minimumFractionDigits: 2
//   })

const convertToRupiah = (angka) => {
  let rupiah = '';
  const angkarev = angka.toString().split('').reverse().join('');
  for (let i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += `${angkarev.substr(i, 3)}.`;
  return `Rp. ${rupiah.split('', rupiah.length - 1).reverse().join('')}`;
};

const buildQuery = function (data) {
  // If the data is already a string, return it as-is
  if (typeof (data) === 'string') return data;

  // Create a query array to hold the key/value pairs
  const query = [];

  // Loop through the data object
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      // Encode each key and value, concatenate them into a string, and push them to the array
      query.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    }
  }

  // Join each item in the array with a `&` and return the resulting string
  return query.join('&');
};

const makeRandomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


module.exports = {
  getQuery,
  getQueryOr,
  betweenDate,
  getFirstDayOfPastMonths,
  getLastDayOfPastMonths,
  pad_with_zeroes,
  getMonthNumber,
  terbilang,
  convertToRupiah,
  toObjId,
  buildQuery,
  makeRandomString,

};
