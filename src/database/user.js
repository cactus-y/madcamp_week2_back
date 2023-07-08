const { User } = require("./schema");

const createUser = async (data) => {
    const user = await User.create(data);
    return user;
}

const findUserWithEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
}

const findUserWithId = async (id) => {
    const user = await User.findById(id);
    return user;
}

module.exports = {
    createUser,
    findUserWithEmail,
    findUserWithId
}