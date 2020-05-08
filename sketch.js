/*

Game Project Part 7
Extensions are:
1. Sound - I really enjoyed searching and choosing a sound to use in my code and I choose some background music. At first the sound file was too large and I had to crop it - I wish it could be longer. Also I had to put the code in the correct place - at first I had it under the start game function which meant that the sound kept playing on top of itself each time the game restarted. I have not figured out how to make the sound start as soon as you load the game. Currently it start only when the character jumps.

3. Platform - I enjoyed figuring out this challenging extension. I had to iron out a few bugs to make it work and I found it difficult to select the appropriate color for the platform so that it stands out from the rest of the game and its clear that it is a platform.


*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var collectables;

var game_score;
var flagPole;
var lives;

var platforms;

var jumpSound;
var backgroundMusic;

function preload()
{
    soundFormats('mp3','wav');
    
    //load sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    backgroundMusic = loadSound('assets/backmusic.wav');
    backgroundMusic.setVolume(0.1);
    
}


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    startGame();
    game_score = 0;
    backgroundMusic.loop();
    

}


function draw()
{
	// fill the sky blue
    
    //background(100, 155, 255); 
    background(0, 105, 180); 

	
    // draw some green ground
    
    noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); 
    
    push();
    translate(scrollPos,0);

	// Draw clouds.
    drawClouds();

	// Draw mountains.
    drawMountains();

	// Draw trees.
    drawTrees();
    
    //draw platforms
    for(var i =0; i < platforms.length; i++)
        {
            platforms[i].draw();
        }

	// Draw canyons.
    for(var i = 0; i<canyons.length; i++)
        {
            drawCanyon(canyons[i]);
            checkCanyon(canyons[i]);
        }
    

	// Draw collectable items.
    for(var i = 0; i< collectables.length; i++)
        {
            
            if(collectables[i].isFound == false)
                {
                    drawCollectable(collectables[i]);
                    checkCollectable(collectables[i]);
                    
                }
            
        }


    renderFlagpole();
    
    pop();
    
    // Draw game character.
	drawGameChar();
    
    
    noStroke();
    fill(255);
    textSize(14);
    text("game score: " + game_score, 110,50);
    
    //Draw lives remaining
    text("Lives: ", 110,22  );  
    for(var i = 0; i< lives; i++)
    {
        fill(255,0,0);
        triangle(150 + i *40, 15, 170 + i * 40, 15, 160 + i * 40, 25);
        ellipse(155 + i * 40, 15, 10);
        ellipse(165 + i *40 ,15,10);
    }
    
    if(lives < 1)
    {
        textSize(32);
        fill(255);
        text("Game Over. Press Space to Continue", 200, height/2,);
        return;
    }
    
    if(flagPole.isReached==true)
    {
        textSize(32);
        fill(255);
        text("Level Complete. Press Space to Continue", 200, height/2,);
        return;
    }


	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
            {
                if(platforms[i].checkContact(gameChar_world_x, gameChar_y)==true)
                    {
                        isContact = true;
                        break;
                    }
            }
        if (isContact == false)
            {
                isFalling = true; 
                gameChar_y +=3; 
            }
                        
    }
    else 
    {
        isFalling = false;        
    }
    
    //plummeting down the canyon
    if(isPlummeting == true)
    {
        gameChar_y +=10;
        
    }
    
    checkPlayerDie();

    if(flagPole.isReached == false)
    {
        checkFlagpole();
    }
    
   
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}




// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

	
    if(keyCode == 37)
    {
        isLeft = true;
    }
    else if(keyCode == 39)
    {
        isRight = true;
    }
    else if(keyCode == 32 && gameChar_y >= floorPos_y)
    {
        
        gameChar_y -=100;
        jumpSound.play();
    }

}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
    if(keyCode == 37)
    {
        
        isLeft = false;
    }
    else if(keyCode == 39)
    {
        
        isRight = false;
    }
    
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	//the game character
	if(isLeft && isFalling)
	{
		// jumping-left code
        fill (255,182,193);
        ellipse (gameChar_x,gameChar_y-50,35);
        fill (0);
        ellipse (gameChar_x-17,gameChar_y-50,5);

        fill (255,0,0);
        rect(gameChar_x-8, gameChar_y-35, 16,30);

        fill(0);
        rect(gameChar_x-12, gameChar_y-8,10,10);
        rect(gameChar_x-6, gameChar_y-5,10,10);


	}
	else if(isRight && isFalling)
	{
		// jumping-right code
        fill (255,182,193);
        ellipse (gameChar_x,gameChar_y-50,35);
        fill (0);
        ellipse (gameChar_x+17,gameChar_y-50,5);

        fill (255,0,0);
        rect(gameChar_x-8, gameChar_y-35, 16,30);

        fill(0);
        rect(gameChar_x+2, gameChar_y-8,10,10);
        rect(gameChar_x-6, gameChar_y -5,10,10);

	}
	else if(isLeft)
	{
		// walking left code
        fill (255,182,193);
        ellipse (gameChar_x,gameChar_y-50,35);
        fill (0);
        ellipse (gameChar_x-17,gameChar_y-50,5);

        fill (255,0,0);
        rect(gameChar_x-8, gameChar_y-35, 16,30);

        fill(0);
        rect(gameChar_x-12, gameChar_y-8,10,10);
        rect(gameChar_x-6, gameChar_y-5,10,10);

	}
	else if(isRight)
	{
		// walking right code
        fill (255,182,193);
        ellipse (gameChar_x,gameChar_y-50,35);
        fill (0);
        ellipse (gameChar_x+17,gameChar_y-50,5);

        fill (255,0,0);
        rect(gameChar_x-8, gameChar_y-35, 16,30);

        fill(0);
        rect(gameChar_x-6, gameChar_y-5,10,10);
        rect(gameChar_x+2, gameChar_y-8,10,10);

	}
	else if(isFalling || isPlummeting)
	{
		// jumping facing forwards code
        fill (255,182,193);
        ellipse (gameChar_x,gameChar_y-50,35);
        fill (0)
        ellipse (gameChar_x-5,gameChar_y-50,5);
        ellipse (gameChar_x+5,gameChar_y-50,5);

        fill (255,0,0);
        rect(gameChar_x-8, gameChar_y-35, 16,25);

        //arms
        fill(0);
        rotate()
        rect(gameChar_x-23, gameChar_y-28,15,8);
        rect(gameChar_x+8, gameChar_y-28,15,8);
        rotate()

        fill(0);
        rect(gameChar_x-12, gameChar_y,10,10);
        rect(gameChar_x+2, gameChar_y,10,10);
    
	}
	else
	{
		// standing front facing code
        fill (255,182,193);
        ellipse (gameChar_x,gameChar_y-50,35);
        fill (0)
        ellipse (gameChar_x-5,gameChar_y-50,5);
        ellipse (gameChar_x+5,gameChar_y-50,5);

        fill (255,0,0);
        rect(gameChar_x-13, gameChar_y-35, 26,30);

        fill(0);
        rect(gameChar_x-15, gameChar_y-5,10,10);
        rect(gameChar_x+ 5, gameChar_y-5,10,10);


	}

}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawClouds()
{
    for(var i = 0; i<clouds.length; i++)
    {
        fill(211,211,211);
        ellipse(clouds[i].pos_x,clouds[i].pos_y,80,80);
        ellipse(clouds[i].pos_x-40,clouds[i].pos_y,50,50);
        ellipse(clouds[i].pox_x+40, clouds[i].pos_y,50,50);
        fill(220,220,220);
        ellipse(clouds[i].pos_x,clouds[i].pos_y,60,60);
        ellipse(clouds[i].pos_x-40,clouds[i].pos_y,35,35);
        ellipse(clouds[i].pos_x+40,clouds[i].pos_y,35,35);
    }

}

// Function to draw mountains objects.

function drawMountains()
{
    for (var i = 0; i < mountains.length; i++)
    {
        fill(169,169,169)
        triangle(mountains[i].x_pos,mountains[i].y_pos,mountains[i].x_pos-mountains[i].width/2,floorPos_y,mountains[i].x_pos+mountains[i].width/2,floorPos_y)

        fill(150,75,0,100)
        triangle(mountains[i].x_pos,mountains[i].y_pos,mountains[i].x_pos+mountains[i].width/2,floorPos_y,mountains[i].x_pos+mountains[i].width/1.5, floorPos_y)

        beginShape()
        noStroke()
        fill(255)
        vertex(mountains[i].x_pos,mountains[i].y_pos)
        vertex(mountains[i].x_pos-25,mountains[i].y_pos+60)
        vertex(mountains[i].x_pos,mountains[i].y_pos+40)
        vertex(mountains[i].x_pos+25,mountains[i].y_pos+60)
        endShape() 
    }
}

// Function to draw trees objects.

function drawTrees()
{
    for(var i =0; i < trees_x.length; i++)
    {
       
        // tree trunk color
        fill(150,75,0);
        // tree trunk
        
    
        // tree triangles
        rect(trees_x[i],-160/2+floorPos_y,40,80);
        fill(0,90,0);    
        triangle(trees_x[i]+20,
                 -160/2+floorPos_y -180,
                 trees_x[i]+ 80,
                 -160/2+floorPos_y-80,
                 trees_x[i]-40,
                 -160/2+floorPos_y-80);

        triangle(trees_x[i] +20, 
                 -160/2+floorPos_y -110, 
                 trees_x[i]+120,
                 -160/2+floorPos_y,
                 trees_x[i]-80,
                 -160/2+floorPos_y);

    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(0, 105, 180);
        noStroke();

        beginShape();    
        vertex(t_canyon.x_pos,floorPos_y);
        vertex(t_canyon.x_pos+t_canyon.width,floorPos_y);   
        vertex(t_canyon.x_pos+t_canyon.width,576);
        vertex(t_canyon.x_pos,576);
    
        endShape();
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if (gameChar_world_x>t_canyon.x_pos && gameChar_world_x<(t_canyon.x_pos+t_canyon.width)&& gameChar_y>=floorPos_y)
    {
        isPlummeting = true;
    }
    

}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    noFill();
    strokeWeight(6);
    stroke(220,185,0);
    ellipse(t_collectable.x_pos,
            t_collectable.y_pos - t_collectable.size * 0.4,
            t_collectable.size * 0.8, 
            t_collectable.size * 0.8);
    
    fill(138,43,226);
    stroke(255);
    strokeWeight(1);
    quad(t_collectable.x_pos - t_collectable.size * 0.1, t_collectable.y_pos - t_collectable.size * 0.8,
         t_collectable.x_pos - t_collectable.size * 0.2, t_collectable.y_pos - t_collectable.size * 1.1,
         t_collectable.x_pos + t_collectable.size * 0.2, t_collectable.y_pos - t_collectable.size * 1.1,
         t_collectable.x_pos + t_collectable.size * 0.1, t_collectable.y_pos - t_collectable.size * 0.8
        );
    noStroke();
    
    
}

// Function to check if the character has collected an item.

function checkCollectable(t_collectable)
{
     if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 20)
    {
        t_collectable.isFound = true;
        game_score += 1;
    }

}

function renderFlagpole()
{
    push();
    stroke(100);
    strokeWeight(5);
    line(flagPole.x_pos,floorPos_y,flagPole.x_pos,floorPos_y-250);
    fill(255,0,255);
    noStroke();
    
    if(flagPole.isReached)
    {
        rect(flagPole.x_pos,floorPos_y-250, 50, 50);
    }
    else
    {
        rect(flagPole.x_pos,floorPos_y-50, 50, 50);
    }
    pop();
}

function checkFlagpole()
{
    var d =  abs(gameChar_world_x - flagPole.x_pos);
    console.log(d);
    if(d<15)
    {
        flagPole.isReached = true;
    }
}

function createPlatforms(x,y,length)
{
    var p = {
        x:x,
        y: y,
        length: length,
        draw: function(){
        fill(192,192,79);
        rect(this.x, this.y, this.length, 20);
        
    },
        checkContact: function(gc_x, gc_y)
        {
            if (gc_x > this.x && gc_x < this.x + this.length)
                {
                    var d = this.y - gc_y;
                    if (d >=0 && d <5)
                        {
                            return true;
                        }
                }
            return false;
        }
        
    }

return p;
}


function checkPlayerDie()
{
    if(gameChar_y> 576)
    {
        lives -= 1;
            if(lives>=1)
            {
                startGame();
            }
            else
            {
                return;
            }
    }
    
}

function startGame()
{
    
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    trees_x = [-2000, -1000, -300, 100, 300, 500, 1000, 1400, 2400];
    clouds = [
        {pos_x:-2100, pos_y: 180},
        {pos_x:-1100, pos_y: 150},
        {pos_x:100, pos_y: 200},
        {pos_x:600, pos_y: 100},
        {pos_x:800, pos_y: 200}
    ];
    mountains = [
        {x_pos:-3000, y_pos:50, width: 300},
        {x_pos:-2000, y_pos:50, width: 300},
        {x_pos:-300, y_pos:50, width: 300},
        {x_pos:330, y_pos:50, width: 350},
        {x_pos:500, y_pos:50, width: 250}
        
        ];
    collectables = [
        {x_pos: -1000,y_pos: floorPos_y,size: 50, isFound: false},
        {x_pos: -500,y_pos: floorPos_y,size: 50, isFound: false},
        {x_pos: 200,y_pos: 340, size: 50, isFound: false},
        {x_pos: 1600,y_pos: 330, size: 50, isFound: false},
        {x_pos: -1500,y_pos: floorPos_y,size: 50, isFound: false},
        {x_pos: 1000,y_pos: floorPos_y,size: 50, isFound: false},
        {x_pos: 2000,y_pos: floorPos_y,size: 50, isFound: false},
        {x_pos: 2500,y_pos: floorPos_y,size: 50, isFound: false}
        
    ];
    canyons = [
        {x_pos:800, width:100},
        {x_pos:-800, width:100}
        ];
    
    platforms = [];
    platforms.push(createPlatforms(150,floorPos_y-90,100));
    platforms.push(createPlatforms(1500,floorPos_y-100,200));
    
    flagPole = {isReached: false, x_pos: 3000};
    
}