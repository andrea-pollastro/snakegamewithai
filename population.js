function Population(target, mutation_rate, size){
    this.target = target;
    this.mutation_rate = mutation_rate;
    this.size = size;
    this.population = [];
    for(let i = 0; i < this.size; i++){
        NN = new NeuralNetwork(INPUT_LAYER, HIDDEN_LAYER_1, HIDDEN_LAYER_2, OUTPUT_LAYER);
        this.population[i] = new Game(NN);
    }
    this.best_fitness;
    this.fitness_values = [];
    this.fitness_history = [];
    this.generation = 0;
    this.highest_fitness = Number.MIN_SAFE_INTEGER;
    this.maxApplesEaten = 0;
    this.winner = 0;

    this.update = function(){
        for(let i = 0; i < this.size; i++){
            this.population[i].update();
            this.fitness_values[i] = this.population[i].fitness();
        }
        isPlaying = false;
        for(let i = 0; i < this.size; i++){
            if(!this.population[i].endGame){
                isPlaying = true;
                break;
            }
        }
        if(isPlaying == false)
            this.fitness_history.push([...this.fitness_values]);
    }
    this.getFitnessHistory = function(){
        return this.fitness_history;
    }
    this.getBestSnakeIndex = function(){
        return this.fitness_values.indexOf(max(population.fitness_values));
    }
    this.drawGame = function(){
        population.population[best_snake].drawGame();
    }
    this.drawStatistics = function(){
        noStroke();
        s = "max apples: " + this.maxApplesEaten;
        text(s, RESOLUTION + 10, height - RESOLUTION - 10);
        s = "highest fitness: " + this.highest_fitness;
        text(s, RESOLUTION + 10, height - RESOLUTION - 25);
        s = "generation: " + this.generation;
        text(s, RESOLUTION + 10, height - RESOLUTION - 40);
    }
    this.updateStatistics = function(){
        this.best_fitness = max(this.fitness_values);
        if(this.best_fitness > this.highest_fitness){
            this.highest_fitness = this.best_fitness;
        }
        for(let i = 0; i < this.size; i++){
            apples = this.population[i].getApples();
            if(apples > this.maxApplesEaten)
                this.maxApplesEaten = apples;
        }
    }
    this.learningCompleted = function(){
        let count = 0;
        for(let i = 0; i < this.size; i++)
            if(this.population[i].getSnakeSize() == this.target){
                count++;
                this.winner = i;
            }
        if(count >= (this.size*PERCENTAGE)/100)
            return true;
        this.winner = 0;
        return false;
    }
    this.getWinner = function(){
        return this.population[this.winner].getSnake();
    }
    this.generate = function(){
        best_snakes = this.getBestSnakes(PERCENTAGE);
        probabilities = [];
        newPopulation = [];
        sum = 0;
        for(let i = 0; i < best_snakes.length; i++)
            sum += best_snakes[i][0];
        for(let i = 0; i < best_snakes.length; i++)
            probabilities[i] = best_snakes[i][0]/sum;
        for(let i = 0; i < this.size; i++){
            parent1 = this.rouletteWheelSelection(probabilities);
            parent2 = this.rouletteWheelSelection(probabilities);
            idx1 = best_snakes[parent1][1];
            idx2 = best_snakes[parent2][1];
            child = this.crossover(this.population[idx1],this.population[idx2]);
            newPopulation[i] = new Game(child);
        }
        newPopulation[this.size-1] = new Game(this.population[best_snakes[0][1]].getBrain());
        newPopulation[this.size-2] = new Game(this.population[best_snakes[0][1]].getBrain());
        newPopulation[this.size-3] = new Game(this.population[best_snakes[0][1]].getBrain());
        this.population = newPopulation;
        this.generation++;
    }
    this.getBestSnakes = function(percentage){
        best_snakes = [];
        for(let i = 0; i < this.fitness_values.length; i++)
            best_snakes[i] = [this.fitness_values[i],i];
        best_snakes = best_snakes.sort(this.sortingFunction);
        best_snakes = best_snakes.slice(0,floor((this.fitness_values.length*percentage)/100));
        return best_snakes;
    }
    this.sortingFunction = function(a, b){
        if(a[0] == b[0])
            return 0;
        return a[0] > b[0] ? -1 : 1;
    }
    this.rouletteWheelSelection = function(probabilities){
        i = -1;
        p = random(1);
        while(p > 0){
            i++;
            p -= probabilities[i];
        }
        return i;
    }
    this.crossover = function(parent1, parent2){
        parentBrain1 = parent1.getBrain();
        parentBrain2 = parent1.getBrain();
        childBrain = new NeuralNetwork(INPUT_LAYER, HIDDEN_LAYER_1, HIDDEN_LAYER_2, OUTPUT_LAYER);
        for(let l = 0; l < childBrain.W.length; l++){
            for(let i = 0; i < childBrain.W[l].length; i++){
                for(let j = 0; j < childBrain.W[l][0].length; j++){
                    if(random() < 0.02)
                        childBrain.W[l][i][j] = parentBrain1.W[l][i][j];
                    else
                        childBrain.W[l][i][j] = parentBrain2.W[l][i][j];
                }
            }
        }
        for(let b = 0; b < childBrain.bias.length; b++){
            for(let i = 0; i < childBrain.bias[b].length; i++){
                if(random() < 0.02)
                    childBrain.bias[b][i] = parentBrain1.bias[b][i];
                else
                    childBrain.bias[b][i] = parentBrain2.bias[b][i];
            }
        }
        return childBrain;
    }
    this.mutate = function(){
        for(let i = 0; i < this.size; i++){
            brain = this.population[i].getBrain();
            for(let l = 0; l < brain.W.length; l++){
                for(let i = 0; i < brain.W[l].length; i++){
                    for(let j = 0; j < brain.W[l][0].length; j++){
                        if(random(1) < this.mutation_rate)
                            brain.W[l][i][j] = random()*2-1;
                    }
                }
            }
            for(let b = 0; b < brain.bias.length; b++){
                for(let i = 0; i < brain.bias[b].length; i++){
                    if(random(1) < this.mutation_rate)
                        brain.bias[b][i] = random()*2-1;
                }
            }
        }
    }
}