const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];
let squares = Array.from({ length: 8 }, () => Array(8).fill(null));
let empassant_square;

let turn = 1;
let selected_piece;
let move_sound;

let white_pieces = [];
let black_pieces = [];
let white_pieces_links = [
    "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg", // pawn
    "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg", // rook
    "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg", // knight
    "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg", // bishop
    "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg", // king
    "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg"  // queen
];
let black_pieces_links = [
    "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg", // pawn
    "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg", // rook
    "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg", // knight
    "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg", // bishop
    "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg", // king
    "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg"  // queen
];

function load_board() {
    for (let i = 1; i <= 8; i++) {
        
        var row = document.createElement("div");
        row.setAttribute('class', 'row');
        document.body.appendChild(row);
        for (let j = 1; j <= 8; j++) {
            var square = document.createElement("div");
            if ((j + (i % 2)) % 2 == 0) {
                square.classList.add('square', 'square_white');
                square.textContent = columns[j-1] + " " + (9 - i);
                square.id = (9 - i) + "," + j;
            } else {
                square.classList.add('square', 'square_blue');
                square.textContent = columns[j-1] + " " + (9 - i);
                square.id = (9 - i) + "," + j;
            }
            squares[8-i][j-1] = square;
            row.appendChild(square);
        }
    }
    move_sound = new Audio("move_sound.mp3");
    move_sound.preload = "auto";
    move_sound.volume = 1.0;
}

function load_pieces() {
    for (let i = 1; i <= 8; i++) {
        white_pieces.push({ type: "pawn", id: i, color: "white", position: `2,${i}`, url: white_pieces_links[0] });
        black_pieces.push({ type: "pawn", id: i, color: "white", position: `7,${i}`, url: black_pieces_links[0] });
    }

    white_pieces.push(
        { type: "rook", id: 1, color: "white", position: "1,1", url: white_pieces_links[1] },
        { type: "rook", id: 2, color: "white", position: "1,8", url: white_pieces_links[1] }
    );
    black_pieces.push(
        { type: "rook", id: 1, color: "white", position: "8,1", url: black_pieces_links[1] },
        { type: "rook", id: 2, color: "white", position: "8,8", url: black_pieces_links[1] }
    );

    white_pieces.push(
        { type: "knight", id: 1, color: "white", position: "1,2", url: white_pieces_links[2] },
        { type: "knight", id: 2, color: "white", position: "1,7", url: white_pieces_links[2] }
    );
    black_pieces.push(
        { type: "knight", id: 1, color: "white", position: "8,2", url: black_pieces_links[2] },
        { type: "knight", id: 2, color: "white", position: "8,7", url: black_pieces_links[2] }
    );

    white_pieces.push(
        { type: "bishop", id: 1, color: "white", position: "1,3", url: white_pieces_links[3] },
        { type: "bishop", id: 2, color: "white", position: "1,6", url: white_pieces_links[3] }
    );
    black_pieces.push(
        { type: "bishop", id: 1, color: "white", position: "8,3", url: black_pieces_links[3] },
        { type: "bishop", id: 2, color: "white", position: "8,6", url: black_pieces_links[3] }
    );

    white_pieces.push({ type: "king", id: 1, color: "white", position: "1,5", url: white_pieces_links[4] });
    white_pieces.push({ type: "queen", id: 1, color: "white", position: "1,4", url: white_pieces_links[5] });
    black_pieces.push({ type: "king", id: 1, color: "white", position: "8,5", url: black_pieces_links[4] });
    black_pieces.push({ type: "queen", id: 1, color: "white", position: "8,4", url: black_pieces_links[5] });
    reload_pieces();
}

function reload_pieces() {
    document.querySelectorAll('.square').forEach(square => {
        square.innerHTML = "";
    });
    for (let i = 0; i < white_pieces.length; i++) {
        let row = white_pieces[i].position[0];
        let column = white_pieces[i].position[2];
        let url = white_pieces[i].url;
        let square = squares[row - 1][column - 1];
        let piece;

        piece = document.createElement("img");
        piece.setAttribute("class", "piece");
        piece.setAttribute("src", url);
        piece.id = white_pieces[i].type + "_white_"+ white_pieces[i].id;
        square.appendChild(piece);
    }
    for (let i = 0; i < black_pieces.length; i++) {
        let row = black_pieces[i].position[0];
        let column = black_pieces[i].position[2];
        let url = black_pieces[i].url;
        let square = squares[row - 1][column - 1];
        let piece;

        piece = document.createElement("img");
        piece.setAttribute("class", "piece");
        piece.setAttribute("src", url);
        piece.id = black_pieces[i].type + "_black_"+ black_pieces[i].id;
        square.appendChild(piece);
    }

    add_listeners();

}

function add_listeners(){
    let pieces = document.getElementsByClassName('piece');

    for (let i = 0; i < pieces.length; i++) {
        let piece = pieces[i];

        let offsetX, offsetY;

        piece.addEventListener('mousedown', (e) => {
            offsetX = e.clientX - piece.offsetLeft;
            offsetY = e.clientY - piece.offsetTop;
            selected_piece = e.target;

            function mouseMoveHandler(e) {
                piece.style.left = (e.clientX - offsetX) + 'px';
                piece.style.top = (e.clientY - offsetY) + 'px';
            }

            function mouseUpHandler() {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
                let identifier_type = selected_piece.id.split('_')[0];
                let identifier_id = selected_piece.id.split('_')[2];
                let squares = document.getElementsByClassName("square");
                let square;

                for (let i = 0; i < squares.length; i++) {
                    collision = check_collision(squares[i], selected_piece);
                    if (collision) {
                        square = squares[i];
                        i = squares.length;
                    }
                }

                if (collision && piece.id.includes("white") && turn == 1) {
                    let piece = white_pieces.find(p =>  p.type === identifier_type && p.id === Number(identifier_id));
                    color = "white";
                    if (check_valid_move(piece.type, piece.position, square.id, color, piece.id)) {
                        if(empassant_square.includes("black")) {
                            empassant_square = "";
                        }
                        play_move_sound();
                        piece.position = square.id;
                        turn = (turn % 2) + 1;
                    }
                }

                if (collision && piece.id.includes("black") && turn == 2) {
                    color = "black";
                    let piece = black_pieces.find(p =>  p.type === identifier_type && p.id === Number(identifier_id));
                    if (check_valid_move(piece.type, piece.position, square.id, color, piece.id)) {
                        if(empassant_square.includes("white")) {
                            empassant_square = "";
                        }
                        play_move_sound();
                        piece.position = square.id;
                        turn = (turn % 2) + 1;
                    }
                }
                reload_pieces()
            }

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
    }
}

function check_collision(square, piece) {
    let piece_x = ((piece.getBoundingClientRect().right - piece.getBoundingClientRect().left) / 2) + piece.getBoundingClientRect().left;
    let piece_y = ((piece.getBoundingClientRect().top - piece.getBoundingClientRect().bottom) / 2) + piece.getBoundingClientRect().bottom;

    let square_x = square.getBoundingClientRect().left;
    let square_x2 = square.getBoundingClientRect().right;
    let square_y = square.getBoundingClientRect().top;
    let square_y2 = square.getBoundingClientRect().bottom;

    if (( piece_x >= square_x && piece_x < square_x2 && piece_y >= square_y && piece_y < square_y2)) {
        return true;
    }
    return false;
}

