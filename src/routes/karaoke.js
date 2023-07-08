const express = require('express');
const axios = require('axios');
const checkAccessToken = require('../middleware/checkAccessToken');
const { findKaraokeByPlaceId, createKaraoke, updateKaraoke } = require('../database/karaoke');
const router = express.Router();
require('dotenv').config();

router.get('/list', checkAccessToken(false), async (req, res) => {
    const data = {
        total_cnt: 0,
        list: [],
    };
    try {
        let end = false;
        let page = 1;
        const size = 15;
        while (!end) {
            const response = await axios.get(
                'https://dapi.kakao.com/v2/local/search/keyword.json',
                {
                    params: {
                        query: req.query.query || "코인노래방",
                        x: req.query.x,
                        y: req.query.y,
                        radius: req.query.radius || 1000,
                        sort: req.query.sort || "accuracy",
                        page,
                        size,
                    },
                    headers: {
                        Authorization: 'KakaoAK ' + process.env.KAKAO_REST_API_KEY,
                    },
                }
            );
            for (let i = 0; i < response.data.documents.length; i++) {
                const element = response.data.documents[i];
                const karaoke = await findKaraokeByPlaceId(element.id);
                const payload = {
                    place_id: element.id,
                    name: element.place_name,
                    address: element.address_name,
                    road_address: element.road_address_name,
                    phone: element.phone,
                    longitude: element.x,
                    latitude: element.y,
                    url: element.place_url ,
                    distance: Number(element.distance)
                }
                if (karaoke) {
                    await updateKaraoke(payload);
                    data.list.push(payload);
                }
                else {
                    const newKaraoke = await createKaraoke(payload);
                    data.list.push({
                        ...payload,
                        id: newKaraoke.id
                    })
                }
                data.total_cnt++;
            }
            end = response.data.meta.is_end;
            if (!end) page++;
        }
        return res
            .status(200)
            .json({ success: true, message: 'KAKAO API 조회 성공', data });
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: 'KAKAO API 조회 실패', error });
    }
})


module.exports = router;