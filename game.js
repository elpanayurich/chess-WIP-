let occupied_squares_white = [];
let occupied_squares_black = [];

let eaten_black = [];
let eaten_white = [];

function check_valid_move(type, initial_position, final_position, color, id) {
    let initial_row = Number(initial_position[0]);
    let initial_col = Number(initial_position[2]);
    let final_row = Number(final_position[0]);
    let final_col = Number(final_position[2]);
    
    if (!(check_no_own_collision(final_position, color, type, initial_col, final_col))) {
        return false;
    }

    if (type == "pawn") {
        return check_valid_pawn_move(initial_row, initial_col, final_row, final_col, color, final_position, type, id);
    }
    if (type == "rook") {
        return check_valid_rook_move(initial_row, initial_col, final_row, final_col, color, final_position);
    }
    if (type == "knight") {
        return check_valid_knight_move(initial_row, initial_col, final_row, final_col, color, final_position);
    }
    if (type == "bishop") {
        return check_valid_bishop_move(initial_row, initial_col, final_row, final_col, color, final_position);
    }
    if (type == "king") {
        return check_valid_king_move(initial_row, initial_col, final_row, final_col, color, final_position);
    }
    if (type == "queen") {
        return check_valid_queen_move(initial_row, initial_col, final_row, final_col, color, final_position);
    }
}

function check_no_own_collision(final_position, color, type, initial_col, final_col) {
    occupied_squares_white = [];
    occupied_squares_black = [];
    for (let i = 0; i < white_pieces.length; i++) {
        occupied_squares_white[i] = white_pieces[i].position;
    }
    for (let i = 0; i < black_pieces.length; i++) {
        occupied_squares_black[i] = black_pieces[i].position;
    }

    if((type == "pawn") && ((initial_col - final_col) == 0) && ((occupied_squares_white.includes(final_position)) || occupied_squares_black.includes(final_position))) {
        return false;
    }

    if (color == "white" && occupied_squares_white.includes(final_position)) {
        return false;
    }
    if (color == "black" && occupied_squares_black.includes(final_position)) {
        return false;
    }

    return true;
}

function check_valid_pawn_move(initial_row, initial_col, final_row, final_col, color, final_position, type, id) {
    let row_diff = Math.abs(final_row - initial_row);
    let path_squares = [];
    if (row_diff === 2) {
        let middle_row = Math.min(final_row, initial_row) + 1;
        
        path_squares[0] = middle_row + "," + initial_col;

        if (check_path_collision(path_squares)) {
            return false;
        }
    }

    console.log(empassant_square)

    if (Math.abs(initial_row - final_row) == 2) {
        empassant_square = path_squares[0] + "-" + type + "_" + color + "_" + id;
    }

    if (color == "white" && (final_row - initial_row) >= 1) {

        if (empassant_square.includes(final_position) && empassant_square.includes("black")) {
            final_position = (Number(final_position[0]) - 1) + "," + final_position[2];
            console.log(final_position)
        }

        if (initial_row == 2 && initial_col == final_col && (final_row - initial_row) <= 2 || (initial_col == final_col && (final_row - initial_row) == 1)) {
            return true; // normal straight pawn movement
        }
        if ((initial_col == (final_col + 1) || initial_col == (final_col - 1)) && occupied_squares_black.includes(final_position) && (final_row - initial_row) == 1) {
            check_eat(final_position, color)
            return true; // diagonal pawn movement when eating
        }
    }

    if (color == "black" && (initial_row - final_row) >= 1) {

        if (empassant_square.includes(final_position) && empassant_square.includes("white")) {
            final_position = (Number(final_position[0]) + 1) + "," + final_position[2];
            console.log(final_position)
        }

        if (initial_row == 7 && initial_col == final_col && (initial_row - final_row) <= 2 || (initial_col == final_col && (initial_row - final_row) == 1)) {
            return true;
        }
        if ((initial_col == (final_col + 1) || initial_col == (final_col - 1)) && occupied_squares_white.includes(final_position) && (initial_row - final_row) == 1) {
            check_eat(final_position, color)
            return true;
        }
    }
    // FALTA EM PASSANT
    return false;
}

function check_valid_rook_move(initial_row, initial_col, final_row, final_col, color, final_position)  {
    let diff_row = Math.abs(initial_row - final_row);
    let diff_col = Math.abs(initial_col - final_col);
    let path_squares = [];

    if (diff_row > 0) {
        for (let i = 0; i < diff_row - 1; i++) {
            let direction = Math.sign(final_row - initial_row);
            let path_row = initial_row + direction * (i + 1);
            path_squares[i] = path_row + "," + initial_col;
        }
    } else {
        for (let i = 0; i < diff_col - 1; i++) {
            let direction = Math.sign(final_col - initial_col);
            let path_column = initial_col + direction * (i + 1);
            path_squares[i] = initial_row  + "," + path_column;
        }
    }

    if (check_path_collision(path_squares)) {
        return false; 
    }

    if (initial_row == final_row || initial_col == final_col) {
        check_eat(final_position, color)
        return true;
    }

    return false;
}

function check_valid_knight_move(initial_row, initial_col, final_row, final_col, color, final_position) {
    let diff_row = Math.abs(initial_row - final_row);
    let diff_col = Math.abs(initial_col - final_col);
    let total_diff = diff_row + diff_col;

    if (total_diff == 3) {
        check_eat(final_position, color)
        return true;
    }

    return false;
}

function check_valid_bishop_move(initial_row, initial_col, final_row, final_col, color, final_position) {
    let diff_row = Math.abs(initial_row - final_row);
    let diff_col = Math.abs(initial_col - final_col);
    let path_squares = [];
    let direction_row = Math.sign(final_row - initial_row);
    let direction_col = Math.sign(final_col - initial_col);

    for (let i = 0; i < diff_row - 1; i++) {
        let path_row = initial_row + direction_row * (i + 1);
        let path_column = initial_col + direction_col * (i + 1);
        path_squares[i] = path_row + "," + path_column ;
    }

    if (check_path_collision(path_squares)) {
        return false; 
    }
    
    if (diff_row == diff_col) {
        check_eat(final_position, color)
        return true;
    }

    return false;
}

function check_valid_king_move(initial_row, initial_col, final_row, final_col, color, final_position) {
    let diff_row = Math.abs(initial_row - final_row);
    let diff_col = Math.abs(initial_col - final_col);

    if (diff_row <= 1 && diff_col <= 1) {
        check_eat(final_position, color)
        return true;
    }

    return false;
}

function check_valid_queen_move(initial_row, initial_col, final_row, final_col, color, final_position) {
    let diff_row = Math.abs(initial_row - final_row);
    let diff_col = Math.abs(initial_col - final_col);
    let path_squares = [];
    let direction_row = Math.sign(final_row - initial_row);
    let direction_col = Math.sign(final_col - initial_col);

    if (diff_row == diff_col) {
        for (let i = 0; i < diff_row - 1; i++) {
            let path_row = initial_row + direction_row * (i + 1);
            let path_column = initial_col + direction_col * (i + 1);
            path_squares[i] = path_row + "," + path_column ;
        }

        if (check_path_collision(path_squares)) {
            return false; 
        }
        check_eat(final_position, color)
        return true;
    }

    if (initial_row == final_row || initial_col == final_col) {
        if (diff_row > 0) {
            for (let i = 0; i < diff_row - 1; i++) {
                let direction = Math.sign(final_row - initial_row);
                let path_row = initial_row + direction * (i + 1);
                path_squares[i] = path_row + "," + initial_col;
            }
        } else {
            for (let i = 0; i < diff_col - 1; i++) {
                let direction = Math.sign(final_col - initial_col);
                let path_column = initial_col + direction * (i + 1);
                path_squares[i] = initial_row  + "," + path_column;
            }
        }

        if (check_path_collision(path_squares)) {
            return false; 
        }
        check_eat(final_position, color)
        return true;
    }

    return false;
}

function check_path_collision(path_squares) {
    for (let i = 0; i < occupied_squares_white.length; i++) {
        if (occupied_squares_white.includes(path_squares[i])) {
            return true;
        }
    }
    for (let i = 0; i < occupied_squares_black.length; i++) {
        if (occupied_squares_black.includes(path_squares[i])) {
            return true;
        }
    }
}

function check_eat(final_position, color) {
    if (color === "white") {
        let index = black_pieces.findIndex(piece => piece.position === final_position);
        
        if (index !== -1) {
            let capturedPiece = black_pieces.splice(index, 1)[0];
            eaten_black.push(`${capturedPiece.type}_${capturedPiece.id}`);
            console.log(eaten_black)
        }
    }

    if (color === "black") {
        let index = white_pieces.findIndex(piece => piece.position === final_position);
        
        if (index !== -1) {
            let capturedPiece = white_pieces.splice(index, 1)[0];
            eaten_white.push(`${capturedPiece.type}_${capturedPiece.id}`);
            console.log(eaten_white)
        }
    }
}


function play_move_sound() {
    if (move_sound) {
        move_sound.currentTime = 0; // restart sound if already playing
        move_sound.play();
    }
}