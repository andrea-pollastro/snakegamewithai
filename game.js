function Game(NN){    
    this.generateFood = function(){
        let available = [];
        let k = 0;
        let grid = height/RESOLUTION;
        for(let i = 1; i < grid-1; i++){
            for(let j = 1; j < grid-1; j++){
                skip = false;
                for(let b = 0; b < this.snake.body.length; b++){
                    ii = this.snake.body[b][0];
                    jj = this.snake.body[b][1];
                    if(ii == i && jj == j){
                        skip = true;
                        break;
                    }
                }
                if(!skip)
                    available[k++] = [i,j];
            }
        }
        available = shuffle(available);
        return available[0];
    }
    this.getBrain = function(){
        return this.brain;
    }
    this.update = function(){
        if(!this.endGame){
            snake_state = this.snake.update()
            switch(snake_state){
                case IS_DEAD:
                    this.endGame = true;
                    break;
                case FOOD_WAS_EATEN:
                    this.apples++;
                    this.maxSteps += BASE_MAX_STEPS;
                    this.food = this.generateFood();
                    this.snake.setFood(this.food);
            }
            this.steps++;
            if(this.steps == this.maxSteps || this.food == undefined){
                this.endGame = true;
                return;
            }
            this.updateDistanceScore(this.euclideanDistance(this.snake.getHead(),this.food));
        }
    }
    this.updateDistanceScore = function(distance){
        if(distance < this.last_distance_from_apple)
            this.closeToApple++;
        else
            this.farFromApple++;
        this.last_distance_from_apple = distance;
    }
    this.fitness = function(){
        fitness = Math.exp(this.apples) + 
            this.closeToApple * REWARD_CLOSE_TO_APPLE + 
            this.farFromApple * REWARD_FAR_FROM_APPLE;
        return fitness;
    }
    this.euclideanDistance = function(head, apple){
        return Math.sqrt(pow(head[0]-apple[0],2) + pow(head[1]-apple[1],2));
    }
    this.drawFood = function(){
        fill(200,0,0);
        rect(this.food[1]*RESOLUTION, this.food[0]*RESOLUTION, RESOLUTION, RESOLUTION);
    }
    this.drawBorder = function(){
        fill(30);
        noStroke();
        let b = width/RESOLUTION;
        for(let i = 0; i < b; i++){
            rect(i*RESOLUTION, 0, RESOLUTION, RESOLUTION);
            rect(0, i*RESOLUTION, RESOLUTION, RESOLUTION);
            rect(i*RESOLUTION, (b-1)*RESOLUTION, RESOLUTION, RESOLUTION);
            rect((b-1)*RESOLUTION, i*RESOLUTION, RESOLUTION, RESOLUTION);
        }
    }
    this.drawGame = function(){
        /* drawing */
        background(211);
        this.drawBorder();
        this.snake.drawSnake();
        if(this.food != undefined)
            this.drawFood();
        this.printStatistics();
    }
    this.printStatistics = function(){
        noStroke();
        s = "steps: " + this.steps;
        text(s, RESOLUTION + 10, RESOLUTION + 15);
        s = "apples: " + this.apples;
        text(s, RESOLUTION + 10, RESOLUTION + 30);
    }
    this.getSnakeSize = function(){
        return this.snake.getSize();
    }
    this.getApples = function(){
        return this.apples;
    }
    this.getSnake = function(){
        return this.snake;
    }

    this.steps = 0;
    this.apples = 0;
    this.last_distance_from_apple = Number.MAX_VALUE;
    this.brain = NN;
    this.closeToApple = 0;
    this.farFromApple = 0;
    this.maxSteps = BASE_MAX_STEPS;
    this.snake = new Snake([(height/2)/RESOLUTION, (width/2)/RESOLUTION], this.brain);
    this.endGame = false;
    this.food = this.generateFood();
    this.snake.setFood(this.food);
    this.meanDistance = 0;
}