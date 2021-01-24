const User = require('./userModel');

exports.get = async (query) => {
    const getResult = {};
    getResult.data = await User.get(query);
    getResult.total = await User.getTotal();
    getResult.filtered = await User.getTotalFiltered(query);
    return getResult;
  };

exports.save = async (context) => {
    const { currentUser } = context;

    // create user in user management
    const user = await User.customStore({ ...context }, currentUser);
  
    return user;
};