const express = require('express');
const { Guest, Board, Karaoke } = require('../database/schema');
const checkAccessToken = require('../middleware/checkAccessToken');
const { findUserWithId } = require('../database/user');
const { findBoardById } = require('../database/board');
const router = express.Router();


router.post('/', checkAccessToken(true), async (req, res) => {
    try {
        const board = await findBoardById(req.body.boardId);
        if (!board) {
            return res.status(400).json({
                success: false,
                invalidBoard: true,
                message: '존재하지 않는 board입니다.'
            });
        }
        const guest = await Guest.findOne({
            board_id: req.body.boardId,
            guest_id: req.user.id
        });
        if (guest) {
            return res.status(400).json({
                success: false,
                guestDupliate: true,
                message: '이미 존재하는 guest입니다.'
            });
        }

        await Guest.create({
            board_id: req.body.boardId,
            guest_id: req.user.id,
        })
        return res.status(200).json({
            success: true,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error
        })
    }
})

router.get('/list', async (req, res) => {
    try {
        const list = await Guest.find({
            board_id: req.query.boardId,
            accepted: req.query.accepted
        });
        const data = [];
        for (let i = 0; i < list.length; i++) {
            const user = await findUserWithId(list[i].guest_id);
            data.push(user);
        }
        return res.status(200).json({
            success: true,
            list: data
        })
    }
    catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error
        });
    }
})

router.get('/list/auth', checkAccessToken(true), async (req, res) => {
    try {
        const list = await Guest.find({
            guest_id: req.user.id
        });
        const data = [];
        for (let i = 0; i < list.length; i++) {
            const board = await Board.findById(list[i].board_id);
            const karaoke = await Karaoke.findById(board.karaoke_id)
            const guestList = [];
            const _list = await Guest.find({ board_id: board.id, accepted: true });
            for (let j = 0; j < _list.length; j++) {
                const user = await findUserWithId(_list[j].guest_id);
                guestList.push(user);
            }
            data.push({
                id: board.id,
                deadline: board.deadline,
                content: board.content || '',
                karaoke: {
                  id: karaoke.id,
                  placeId: karaoke.place_id,
                  name: karaoke.name,
                  address: karaoke.address,
                  roadAddress: karaoke.road_address,
                  phone: karaoke.phone,
                },
                guestList
            });
        }
        return res.status(200).json({
            success: true,
            list: data
        })
    }
    catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error
        });
    }
})

router.patch('/accept', checkAccessToken(true), async (req, res) => {
    try {
        const board = await Board.findById(req.body.boardId);
        if (board.author_id != req.user.id) {
            return res.status(400).json({
                success: false,
                message: '권한이 없는 사용자입니다.'
            })
        }
        await Guest.findOneAndUpdate({
            board_id: req.body.boardId,
            guest_id: req.body.guestId
        }, {
            accepted: true
        });
        return res.status(200).json({
            success: true,
        });
    }
    catch(error){
        console.log(error);
        res.status(400).json({
            success: false,
            error
        })
    }
})

module.exports = router;