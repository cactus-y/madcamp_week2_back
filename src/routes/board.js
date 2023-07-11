const express = require('express');
const checkAccessToken = require('../middleware/checkAccessToken');
const { findUserWithId } = require('../database/user');
const { Board, Guest } = require('../database/schema');
const router = express.Router();
const dayjs = require('dayjs');

router.get('/list', checkAccessToken(false), async (req, res) => {
    try {
        const boardList = await Board.find({ karaoke_id: req.query.karaokeId });
        const data = [];
        for (let i = 0; i < boardList.length; i++) {
            const item = boardList[i];
            if (new Date(item.deadline).getTime() <= new Date().getTime()) {
                continue;
            }
            const author = await findUserWithId(item.author_id);
            const guestList = await Guest.find({ board_id: item.id, accepted: true });
            const guest = [];
            for (let j = 0; j < guestList.length; i++) {
                const user = await findUserWithId(guestList[i].guest_id);
                guest.push(user);
            }
            data.push({                    
                id: item.id,
                deadline: item.deadline,
                content: item.content || '',
                karaokeId: item.karaoke_id,
                author,
                guest
            })
        }
        return res.status(200).json({
            success: true,
            boardList: data
        })
    }
    catch(error) {
        console.log(error);
        return res.status(400).json({
            success: false
        })
    }
})

router.post('/', checkAccessToken(true), async (req, res) => {
    try {
        const boardList = await Board.find({
            author_id: req.user.id,
            karaoke_id: req.body.karaokeId,
        });
        for (let i = 0; i < boardList.length; i++) {
            if (new Date(boardList[i].deadline).getTime() >= new Date().getTime()) {
                return res.status(400).json({
                    success: false,
                    message: '포스트를 추가할 수 없습니다.'
                })
            }
        }
        const newBoard  = await Board.create({
            author_id: req.user.id,
            karaoke_id: req.body.karaokeId,
            content: req.body.content,
            deadline: dayjs(req.body.deadline).format()
        });
        const author = await findUserWithId(req.user.id)
        return res.status(200).json({
            success: true,
            board: {
                id: newBoard.id,
                content: newBoard.content || '',
                deadline: dayjs(newBoard.deadline).format().split("+")[0],
                author,
            }
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

router.patch('/:id', checkAccessToken(true), async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            return res.status(400).json({
                success: false,
                message: '존재하지 않는 board입니다.'
            });
        }
        if (req.user.id != board.author_id) {
            return res.status(400).json({
                success: false,
                message: '사용자의 board가 아닙니다.'
            })
        }
        const newBoard = await Board.findByIdAndUpdate(req.params.id, {
            author_id: board.author_id,
            karaoke_id: req.body.karaokeId,
            content: req.body.content,
            deadline: dayjs(req.body.deadline).format()
        }, { new: true });
        const author = await findUserWithId(req.user.id)
        return res.status(200).json({
            success: true,
            board: {
                id: newBoard.id,
                content: newBoard.content || '',
                deadline: dayjs(newBoard.deadline).format().split("+")[0],
                author
            }
        })
    }
    catch(error) {
        return res.status(400).json({
            success: false,
            error
        })
    }
})

module.exports = router;