const { User } = require("./schema");
const { getImageUrl } = require('../utils/image')

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
    return {
        id: user.id,
        nickname: user.nickname,
        gender: user.gender,
        profileImage: getImageUrl(user.profile_image),
        musicGenre: JSON.parse(user.music_genre)
    };
}

const findUserWithNickname = async (nickname) => {
    const user = await User.findOne({ nickname });
    return user;
}


const updateUser = async ({ id, data }) => {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    return user;
}

module.exports = {
    createUser,
    findUserWithEmail,
    findUserWithId,
    findUserWithNickname,
    updateUser
}