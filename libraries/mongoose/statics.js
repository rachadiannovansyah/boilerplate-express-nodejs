const utils = require('../utils/index');

async function getTotal() {
  const result = await this.countDocuments({});
  return result;
}

async function get(q) {
  try {
    const query = q;
    const perpage = (query.perpage) ? parseInt(query.perpage, 10) : 10;
    const currpage = (query.currpage) ? parseInt(query.currpage, 10) : 0;
    query['sort-created.at'] = (query['sort-created.at']) ? query['sort-created.at'] : -1;

    // merge array of object, the result will be merged in array1
    let arrayOr = utils.getQueryOr(query, 'likeor-', 'like');
    const arrayOr2 = utils.getQueryOr(query, 'filteror-');
    Array.prototype.push.apply(arrayOr, arrayOr2);
    // filter empty object
    arrayOr = arrayOr.filter((value) => Object.keys(value).length > 0);
    // if empty, add
    if (arrayOr.length === 0) {
      arrayOr.push({});
    }

    const result = await this.aggregate([
      {
        $match: {
          $or: arrayOr,
          ...utils.getQuery(query, 'filterin-', 'in'),
          ...utils.getQuery(query, 'filter-'),
          ...utils.getQuery(query, 'exists-', 'exists'),
          ...utils.getQuery(query, 'filternum-', 'number'),
          ...utils.getQuery(query, 'filterobjid-', 'objid'),
          ...utils.getQuery(query, 'bool-', 'bool'),
          ...utils.getQuery(query, 'like-', 'like'),
          ...utils.betweenDate(utils.getQuery(query, 'between-')),
        },
      },
    ])
      .collation({ locale: 'en', strength: 2 })
      .sort(utils.getQuery(query, 'sort-'))
      .skip(currpage * perpage)
      .limit(perpage);

    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function getOne(query) {
  const result = await this.findOne({
    ...utils.getQuery(query, 'filterin-', 'in'),
    ...utils.getQuery(query, 'filter-'),
    ...utils.getQuery(query, 'exists-', 'exists'),
    ...utils.getQuery(query, 'filternum-', 'number'),
    ...utils.getQuery(query, 'filterobjid-', 'objid'),
    ...utils.getQuery(query, 'bool-', 'bool'),
    ...utils.getQuery(query, 'like-', 'like'),
    ...utils.betweenDate(utils.getQuery(query, 'between-')),
  })
    .collation({ locale: 'en' })
    .sort(utils.getQuery(query, 'sort-'));
  return result;
}

async function getTotalFiltered(query) {
  // merge array of object, the result will be merged in array1
  let arrayOr = utils.getQueryOr(query, 'likeor-', 'like');
  const arrayOr2 = utils.getQueryOr(query, 'filteror-');
  Array.prototype.push.apply(arrayOr, arrayOr2);
  // filter empty object
  arrayOr = arrayOr.filter((value) => Object.keys(value).length > 0);
  // if empty, add
  if (arrayOr.length === 0) {
    arrayOr.push({});
  }
  const result = await this.aggregate([
    {
      $match: {
        $or: arrayOr,
        ...utils.getQuery(query, 'filterin-', 'in'),
        ...utils.getQuery(query, 'filter-'),
        ...utils.getQuery(query, 'exists-', 'exists'),
        ...utils.getQuery(query, 'filternum-', 'number'),
        ...utils.getQuery(query, 'filterobjid-', 'objid'),
        ...utils.getQuery(query, 'bool-', 'bool'),
        ...utils.getQuery(query, 'like-', 'like'),
        ...utils.betweenDate(utils.getQuery(query, 'between-')),
      },
    },
    {
      $group: { _id: null, count: { $sum: 1 } },
    },
    {
      $project: { _id: 0, count: 1 },
    },
  ]);

  if (result[0]) {
    return result[0].count;
  }
  return 0;
}

async function store(context) {
  let item = new this(context);
  item = await item.save();
  return item;
}

async function findById(id) {
  const item = await this.findOne({ _id: id });
  return item;
}

async function update(id, item) {
  const result = await this.updateOne({ _id: id }, { $set: item });
  return result;
}

async function deleteById(id) {
  const item = await this.findOneAndDelete({ _id: id });
  return item;
}

module.exports = {
  getTotal, get, getTotalFiltered, store, findById, update, deleteById, getOne,
};
