const { User } = require("./schema");

const createUser = async (data) => {
    const user = await User.create(data);
    return user;
}

module.exports = {
    createUser
}