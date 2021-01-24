const User = require('./userModel');

exports.get = async (query) => {
    const getResult = {};
    getResult.data = await User.get(query);
    getResult.total = await User.getTotal();
    getResult.filtered = await User.getTotalFiltered(query);

    console.log(getResult);
    return getResult;
  };

exports.save = async (context) => {
    // create user in user management
    const user = await User.customStore({ ...context });
  
    return user;
};

exports.destroy = async (context) => {
  const { userId } = context;

  const result = await User.deleteById(userId);

  return result;
}