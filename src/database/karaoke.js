const { Karaoke } = require("./schema")

const findKaraokeByPlaceId = async (placeId) => {
    const karaoke = await Karaoke.findOne({ place_id: placeId });
    return karaoke;
}

const createKaraoke = async (data) => {
    const karaoke = await Karaoke.create(data);
    return karaoke;
}

const updateKaraoke = async (data) => {
    const karaoke = await Karaoke.findOneAndUpdate({
        place_id: data.place_id,
    }, data);
    return karaoke;
}

module.exports = {
    findKaraokeByPlaceId,
    createKaraoke,
    updateKaraoke
}