var visualizeRays = false;

function Snake(start, brain){
    this.body = [
        [start[0],start[1]-2],
        [start[0],start[1]-1],
        [start[0],start[1]]
    ];
    this.currentDirection = RIGHT_ARROW;
    this.numRays = 8;
    this.food;
    this.rays = new Array(this.numRays);
    this.hitmap = new Array(this.numRays*3);
    this.brain = brain;
    this.dist = 0;

    this.getSize = function(){
        return this.body.length;
    }
    this.setFood = function(food){
        this.food = food;
    }
    this.getBrain = function(){
        return this.brain;
    }
    this.move = function(direction){
        this.body.push(direction);
        if(!this.hitsTheFood(direction[0],direction[1])){
            this.body.shift();
            return false;
        }
        return true;
    }
    this.getHead = function(){
        return [...this.body[this.body.length-1]];
    }
    this.drawSnake = function(){
        fill(50);
        stroke(0);
        for(var k = 0; k < this.body.length; k++){
            i = this.body[k][0];
            j = this.body[k][1];
            if(k == this.body.length-1)
                fill(0,150,150);
            rect(j*RESOLUTION, i*RESOLUTION, RESOLUTION, RESOLUTION);
        }
    }
    this.update = function(){
        this.updateRays();
        input = this.buildInput();
        this.currentDirection = this.brain.predict(input);
             
        head = this.getHead();
        switch(this.currentDirection){
            case UP_ARROW:
                head[0]--;
                break;
            case DOWN_ARROW:
                head[0]++;
                break;
            case LEFT_ARROW:
                head[1]--;
                break;
            case RIGHT_ARROW:
                head[1]++;
        }
        this.canMove = false;
        if(!this.isValid(head))
            return IS_DEAD;
        foodWasEaten = this.move(head);
        if(foodWasEaten)
            return FOOD_WAS_EATEN;
        return IS_ALIVE;
    }
    this.buildInput = function(){
        input = [];
        for(let i = 0; i < this.numRays; i++){
            input[i*3] = this.rayMagnitude(i*3);
            input[i*3+1] = this.hitmap[i*3+1] == 0 ? 0 : this.rayMagnitude(i*3+1);
            input[i*3+2] = this.hitmap[i*3+2] == 0 ? 0 : this.rayMagnitude(i*3+2);
        }
        input.push(this.body.length/pow(RESOLUTION-2,2));
        return input;
    }
    this.updateRays = function(){
        head = this.getHead();
        for(let i = 0; i < this.numRays; i++)
            this.rays[i] = [...head];
        for(let i = 0; i < this.numRays*3; i++)
            this.hitmap[i] = 0;
        noStroke();
        for(let i = 0; i < this.numRays; i++)
            this.rayCast(i);
        stroke(0);
    }
    this.rayCast = function(i){
        this.dist = 0;
        while(!this.hitsTheWall(this.rays[i][0],this.rays[i][1])){
            this.dist++;
            this.increaseRay(i);
            if(visualizeRays){
                this.chooseColor(i);
                ellipse(this.rays[i][1]*RESOLUTION, this.rays[i][0]*RESOLUTION, 5);
            }
        }
    }
    this.chooseColor = function(i){
        switch(this.hitmap[i][0]){
            case 0:
                fill(150);
                break;
            case 1:
                fill(200, 0, 0);
                break;
            case 2:
                fill(0, 200, 0);
                break;
            case 3:
                fill(0, 0, 200);
                break;
        }
    }
    this.rayMagnitude = function(i){
        return map(this.hitmap[i], 1, width/RESOLUTION-2, 1, 0);
    }
    this.increaseRay = function(i){
        switch(i){
            case 0:
                this.rays[i][1]++;
                break;
            case 1:
                this.rays[i][0]++;
                this.rays[i][1]++;
                break;
            case 2:
                this.rays[i][0]++;
                break;
            case 3:
                this.rays[i][0]++;
                this.rays[i][1]--;
                break;
            case 4:
                this.rays[i][1]--;
                break;
            case 5:
                this.rays[i][0]--;
                this.rays[i][1]--;
                break;
            case 6:
                this.rays[i][0]--;
                break;
            case 7:
                this.rays[i][0]--;
                this.rays[i][1]++;
        }
        this.updateHitmap(i);
    }
    this.updateHitmap = function(i){
        if(this.hitsTheWall(this.rays[i][0],this.rays[i][1]))
            this.hitmap[i*3] = this.dist;
        if(this.hitmap[i*3+1] == 0 && this.hitsTheBody(this.rays[i][0], this.rays[i][1]))
            this.hitmap[i*3+1] = this.dist;
        if(this.hitsTheFood(this.rays[i][0], this.rays[i][1]))
            this.hitmap[i*3+2] = this.dist;
    }
    this.hitsTheFood = function(i, j){
        return i == this.food[0] && j == this.food[1];
    }
    this.hitsTheWall = function(i, j){
        return i >= height/RESOLUTION-1 || i == 0 || j >= width/RESOLUTION-1 || j == 0;
    }
    this.hitsTheBody = function(i, j){
        for(let b = 0; b < this.body.length-1; b++){
            if(this.body[b][0] == i && this.body[b][1] == j)
                return true;
        }        
        return false;
    }
    this.isValid = function(coordinates){
        i = coordinates[0];
        j = coordinates[1];
        return !this.hitsTheWall(i,j) && !this.hitsTheBody(i,j);
    }
}