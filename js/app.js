var myGamePiece, myScore, myBackground;
var myObstacles = [];

function startGame ()
{
    myBackground = new component( 656, 270, "./img/back.png", 0, 0, "background" );
    myGamePiece = new component( 40, 40, "./img/player.png", 10, 120, "image" );
    myGamePiece.gravity = 0.05;
    myScore = new component( "20px", "Consolas", "black", 20, 20, "text" );
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement( "canvas" ),
    start: function ()
    {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext( "2d" );
        document.body.insertBefore( this.canvas, document.body.childNodes[ 0 ] );
        this.frameNo = 0;
        this.interval = setInterval( updateGameArea, 20 );
    },
    clear: function ()
    {
        this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    }
}

// component
function component ( width, height, color, x, y, type )
{
    this.type = type;
    if ( type == "image" || type == "background" )
    {
        this.image = new Image();
        this.image.src = color;
    }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function ()
    {
        ctx = myGameArea.context;
        if ( type == "image" || type == "background" )
        {
            ctx.drawImage( this.image, this.x, this.y, this.width, this.height );
            if ( type == "background" )
            {
                ctx.drawImage( this.image, this.x + this.width, this.y, this.width, this.height );
            }
        } else
        {
            if ( this.type == "text" )
            {
                ctx.font = this.width + " " + this.height;
                ctx.fillStyle = color;
                ctx.fillText( this.text, this.x, this.y );
            } else
            {
                ctx.fillStyle = color;
                ctx.fillRect( this.x, this.y, this.width, this.height );
            }
        }
    }
    this.newPos = function ()
    {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        if ( this.type == "background" )
        {
            if ( this.x == -( this.width ) )
            {
                this.x = 0;
            }
        }
    }
    this.hitBottom = function ()
    {
        var rockbottom = myGameArea.canvas.height - this.height;
        if ( this.y > rockbottom )
        {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function ( otherobj )
    {
        var myleft = this.x;
        var myright = this.x + ( this.width );
        var mytop = this.y;
        var mybottom = this.y + ( this.height );
        var otherleft = otherobj.x;
        var otherright = otherobj.x + ( otherobj.width );
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + ( otherobj.height );
        var crash = true;
        if ( ( mybottom < othertop ) || ( mytop > otherbottom ) || ( myright < otherleft ) || ( myleft > otherright ) )
        {
            crash = false;
        }
        return crash;
    }
}

// update the game area
function updateGameArea ()
{
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for ( i = 0; i < myObstacles.length; i += 1 )
    {
        if ( myGamePiece.crashWith( myObstacles[ i ] ) )
        {
            var button = document.querySelector( "button" );
            button.addEventListener( "click", () =>
            {
                location.reload();
            } );
            button.innerHTML = "Reload the page";
            button.style.background = "red";
            button.style.color = "#fff";
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if ( myGameArea.frameNo == 1 || everyinterval( 150 ) )
    {
        x = myGameArea.canvas.width;

        minHeight = 20;
        maxHeight = 200;
        height = Math.floor( Math.random() * ( maxHeight - minHeight + 1 ) + minHeight );

        minGap = 50;
        maxGap = 200;
        gap = Math.floor( Math.random() * ( maxGap - minGap + 1 ) + minGap );

        myObstacles.push( new component( 50, height, "./img/wall-top.png", x, 0, "image" ) );
        myObstacles.push( new component( 50, x - height - gap, "./img/wall-bottom.png", x, height + gap, "image" ) );
    }
    myBackground.newPos();
    myBackground.update();
    myBackground.speedX = -1;
    for ( i = 0; i < myObstacles.length; i++ )
    {
        myObstacles[ i ].x += -1;
        myObstacles[ i ].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();

}

function everyinterval ( n )
{
    if ( ( myGameArea.frameNo / n ) % 1 == 0 ) { return true; }
    return false;
}

// controllers
// controller by button
function accelerate ( n )
{
    myGamePiece.gravity = n;
}

// controller by keyboard
document.querySelector( "body" ).addEventListener( "keydown", function ( event )
{
    if ( event.key == "ArrowUp" )
    {
        accelerate( -0.2 );
    }
} );
document.querySelector( "body" ).addEventListener( "keyup", function ( event )
{
    if ( event.key == "ArrowUp" )
    {
        accelerate( 0.05 );
    }
} );