const { Board } = require("./schema")

const findBoardById = async (id) => {
    const board = await Board.findById(id);
    if (new Date(board.deadline).getTime() <= new Date().getTime()) return null;
    else return board;
}

module.exports = {
    findBoardById
}