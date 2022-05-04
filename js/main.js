    function start(){
        Swal.fire({
            title: 'Welcome to Gold Digger',
            text: "Your objective is to collect all the gold. When you collect a gold piece you get a powerup for a few seconds which breaks every block in 1 hit.",
            showConfirmButton: true,
            confirmButtonText: 'Start',
            confirmButtonCollor: '#d1db16',
        }).then(()=>{
            drawIt();
        })
    }
    function drawIt(){
        //input keys
        var rightDown = false;
        var leftDown = false;
        function onKeyDown(evt){
            if(evt.keyCode==39)
                rightDown=true;
            else if(evt.keyCode==37)
                leftDown=true;
        }
        function onKeyUp(evt){
            if (evt.keyCode==39)
                rightDown=false;
            else if(evt.keyCode==37)
                leftDown=false;
        }
        $(document).keydown(onKeyDown);
        $(document).keyup(onKeyUp);

        //input mouse
        function init_mouse(){
            canvasMinX=$("#canvas").offset().left;
            canvasMinX=$("canvas").offset().left;
            canvasMaxX=canvasMinX+WIDTH;
        }
        function onMouseMove(evt){
            if(evt.pageX>canvasMinX+paddlew/2 && evt.pageX<canvasMaxX-paddlew/2){
                paddlex=evt.pageX-canvasMinX-paddlew/2;
            }
        }
        $(document).mousemove(onMouseMove);

        

        //bricks
        var bricks;
        var grass=new Image();
        grass.src="img/grass.png";
        var grassHit=new Audio('sound/grass_break.mp3');
        var dirt=new Image();
        dirt.src="img/dirt.png";
        var dirtHit=new Audio('sound/dirt_break.mp3');
        var stone=new Image();
        stone.src="img/stone.png";
        var stoneHit=new Audio('sound/stone_hit.mp3');
        var stoneBreak=new Audio('sound/stone_break.mp3');
        var goldblock=new Image();
        goldblock.src="img/gold.png";
        var goldBreak=new Audio('sound/gold_break.mp3');
        var goldStg1=new Image();
        goldStg1.src="img/goldStage1.png";
        var goldStg2=new Image();
        goldStg2.src="img/goldStage2.png";
        var crack=new Image();
        crack.src="img/crack.png";
        var goldpick=new Image();
        goldpick.src="img/goldpick.png";
        var stick=new Image();
        stick.src="img/image.png";
        var beforerow;
        var row;
        var golden;
        var NROWS;
        var NCOLS;
        var BRICKWIDTH;
        var BRICKHEIGHT;
        var PADDING;
        var gen=0;
        function initbricks(){
            NROWS=5;
            NCOLS=10;
            BRICKWIDTH=WIDTH/NCOLS;
            BRICKHEIGHT=64;
            PADDING=0;

            bricks=new Array(NROWS);
            for(i=0; i<NROWS; i++){
                bricks[i]=new Array(NCOLS);
                for(j=0; j<NCOLS; j++){
                    if(i==NROWS-1)
                        bricks[i][j]=1;
                    else if(i==NROWS-2)
                        bricks[i][j]=2;
                    else if(i<NROWS-2)
                        if(Math.round(Math.random()*4)==1 && gen<5){
                            bricks[i][j]=7;
                            gen++;
                        }
                        else
                            bricks[i][j]=4;
                }
            }
        }

        //paddle
        var paddlex;
        var paddleh;
        var paddlew;

        //circle
        var x=300;
        var y=50;
        var dx=2;
        var dy=10;
        var r=12;

        //canvas
        var tocke;
        var canvasMinX;
        var canvasMaxX;
        var WIDTH=640;
        var HEIGHT;
        var ctx;
        var canvas;

        function init(){
            tocke=0;
            $("#tocke").html('Points: '+tocke);
            canvas=document.getElementById('canvas');
            ctx=canvas.getContext("2d");
            WIDTH=$("#canvas").width();
            HEIGHT=$("#canvas").height();
            interval=setInterval(draw, 20)
            return interval;
        }
        function rusi(){
            if(bricks[row][col]>0 && golden>0 && bricks[row][col]<5){
                bricks[row][col]=0;
                stoneBreak.play();
            }
            else if(bricks[row][col]==1){
                bricks[row][col]=0;
                grassHit.play();
            }
            else if (bricks[row][col]==2){
                bricks[row][col]=0;
                dirtHit.play();
            }
            else if(bricks[row][col]==3){
                bricks[row][col]=0;
                stoneBreak.play();
            }
            else if(bricks[row][col]==4){
                bricks[row][col]=3;
                stoneHit.play();
            }
            else if(bricks[row][col]>=5 && bricks[row][col]<=7 && golden>0){
                bricks[row][col]=0;
                tocke+=1;
                $("#tocke").html(tocke);
                golden=300;
                goldBreak.play();
            }
            else if(bricks[row][col]==5){
                bricks[row][col]=0;
                tocke+=1;
                $("#tocke").html(tocke);
                golden=300;
                goldBreak.play();
            }
            else if(bricks[row][col]>5 && bricks[row][col]<=7){
                bricks[row][col]-=1;
                stoneHit.play();
            }
            if(tocke==5){
                Swal.fire({
                    title: 'You won',
                    text: "You're rich!",
                    imageUrl: 'img/gold_pile.png',
                    imageWidth: 254,
                    imageHeight: 170,
                    imageAlt: 'Custom image',
                    showConfirmButton: true,
                    confirmButtonText: 'Try again?',
                    confirmButtonCollor: '#d1db16',
                }).then(()=>{
                    draw();
                })
                clearInterval(interval);
            }
        }
    
        function draw(){
            if(golden>0){
                golden--;
                console.log(golden);
            }
            ctx.clearRect(0,0,WIDTH,HEIGHT);
            //draw circle
            if(golden>0)
                ctx.fillStyle="#d1db16";
            else
                ctx.fillStyle="#000";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
            //move paddle
            if(rightDown)
                if((paddlex+paddlew)<WIDTH)
                    paddlex+=5;
                else
                    paddlex=WIDTH-paddlew;
            if(leftDown)
                if(paddlex>0)
                    paddlex-=5;
                else
                    paddlex=0;
            //draw paddle
            ctx.fillStyle="#000";
            ctx.beginPath();
            ctx.rect(paddlex, 0, paddlew, paddleh);
            ctx.closePath();
            ctx.fill();
            //draw bricks
            for (i=0; i<NROWS; i++){
                for (j=0; j<NCOLS; j++){
                        ctx.fillStyle="#f00";
                        ctx.beginPath();
                        if(bricks[i][j]==1)
                            ctx.drawImage(grass,(j*(BRICKWIDTH+PADDING))+PADDING, (HEIGHT-(i+1)*(BRICKHEIGHT+PADDING))+PADDING, BRICKWIDTH, BRICKHEIGHT);
                        else if(bricks[i][j]==2)
                            ctx.drawImage(dirt,(j*(BRICKWIDTH+PADDING))+PADDING, (HEIGHT-(i+1)*(BRICKHEIGHT+PADDING))+PADDING, BRICKWIDTH, BRICKHEIGHT);
                        else if(bricks[i][j]==3)
                            ctx.drawImage(crack,(j*(BRICKWIDTH+PADDING))+PADDING, (HEIGHT-(i+1)*(BRICKHEIGHT+PADDING))+PADDING, BRICKWIDTH, BRICKHEIGHT);
                        else if(bricks[i][j]==7)
                            ctx.drawImage(goldblock,(j*(BRICKWIDTH+PADDING))+PADDING, (HEIGHT-(i+1)*(BRICKHEIGHT+PADDING))+PADDING, BRICKWIDTH, BRICKHEIGHT);
                        else if(bricks[i][j]==6)
                            ctx.drawImage(goldStg1,(j*(BRICKWIDTH+PADDING))+PADDING, (HEIGHT-(i+1)*(BRICKHEIGHT+PADDING))+PADDING, BRICKWIDTH, BRICKHEIGHT);
                        else if(bricks[i][j]==5)
                            ctx.drawImage(goldStg2,(j*(BRICKWIDTH+PADDING))+PADDING, (HEIGHT-(i+1)*(BRICKHEIGHT+PADDING))+PADDING, BRICKWIDTH, BRICKHEIGHT);
                        else if(bricks[i][j]>0)
                            ctx.drawImage(stone,(j*(BRICKWIDTH+PADDING))+PADDING, (HEIGHT-(i+1)*(BRICKHEIGHT+PADDING))+PADDING, BRICKWIDTH, BRICKHEIGHT);
                        ctx.closePath();
                        ctx.fill();
                }
            }
            //check bricks
            beforerow=row;
            rowheight=BRICKHEIGHT+PADDING;
            colwidth=BRICKWIDTH+PADDING;
            row=Math.floor(((HEIGHT-y-dy*2.5)/rowheight));
            col=Math.floor((x+dx*6)/colwidth);

            if (row < 0) row = 0;

            if (row<NROWS && bricks[row][col] > 0) {
                    if (beforerow < row || beforerow > row) {
                        dy = -dy;
                    } else {
                        dx = -dx;
                    }
                rusi();
            }
            
            //move ball
            if (x+dx>WIDTH-r || x+dx<0+r){
                dx=-dx;
            }
            if (y+dy>HEIGHT-r){
                dy=-dy;
            }
            else if (y+dy<0+r+paddleh){
                /*if (x>paddlex && x<paddlex+paddlew) {
                    dx=-dx;
                    dy=-dy;
                }*/
                if(x>paddlex && x<paddlex+paddlew) {
                   dx=4*((x-(paddlex+paddlew/2))/paddlew);
                   dy=-dy;
                }
                else if(y+dy<0+r){
                    Swal.fire({
                        title: 'You lost',
                        text: "You didn't collect all the gold",
                        imageUrl: 'img/wallet.jpg',
                        imageWidth: 254,
                        imageHeight: 170,
                        imageAlt: 'Custom image',
                        showConfirmButton: true,
                        confirmButtonText: 'Try again?',
                        confirmButtonCollor: "#d1db16"
                    }).then((result)=>{
                        if (result.isConfirmed) {
                          document.location.reload();
                        }
                    }).then(()=>{
                        draw();
                    })
                  clearInterval(interval);
                }
            }
            x=x+dx;
            y=y+dy;
        }
        function init_paddle(){
            paddlex=WIDTH/2;
            paddleh=10;
            paddlew=100;
        }
    initbricks();
    init_mouse();
    init_paddle();
    init();
    }