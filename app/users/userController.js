const payload = require('../../libraries/utils/payload');
const service = require('../users/userService');

exports.index = async (req, res) => {
    const getResult = await service.get(req.query);
    const meta = {};
    meta.total = getResult.total;
    meta.filtered = getResult.filtered;
    meta.currpage = (req.query.currpage) ? parseInt(req.query.currpage) : 0;
    meta.perpage = (req.query.perpage) ? parseInt(req.query.perpage) : 10;
    meta.totalpage = Math.ceil(meta.filtered / meta.perpage);
    return payload.resSuccessData(res, undefined, getResult.data, meta);
}

exports.store = async (req, res) => {
    const body = { ...req.body, ...res.locals, emailVerStatus: true };
    const item = await service.save(body);
    return payload.resCreated(res, undefined, item);
  };