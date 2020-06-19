function NeuralNetwork(inputLayer, hiddenLayer1, hiddenLayer2, outputLayer){
    this.createWeights = function(rows, cols){
        W = [];
        for(let i = 0; i < rows; i++){
            W[i] = [];
            for(let j = 0; j < cols; j++)
                W[i][j] = random()*2 - 1;
        }
        return W;
    }
    this.createBias = function(nodes){
        b = [];
        for(let i = 0; i < nodes; i++)
            b[i] = random()*2 - 1;
        return b;
    }
    this.relu = function(x){
        return max(0,x);
    }

    this.W1 = this.createWeights(inputLayer, hiddenLayer1);
    this.W2 = this.createWeights(hiddenLayer1, hiddenLayer2);
    this.W3 = this.createWeights(hiddenLayer2, outputLayer);
    this.bias1 = this.createBias(hiddenLayer1);
    this.bias2 = this.createBias(hiddenLayer2);
    this.bias3 = this.createBias(outputLayer);
    this.W = [this.W1, this.W2, this.W3];
    this.bias = [this.bias1, this.bias2, this.bias3];
    this.output = new Array(outputLayer);

    this.getWeights = function(){
        return this.W;
    }
    this.getBiases = function(){
        return this.bias;
    }
    this.forwardPropagation = function(input){
        x = [...input];
        for(let l = 0; l < this.W.length; l++){
            a = [];
            for(let j = 0; j < this.W[l][0].length; j++){
                a[j] = 0;
                for(let i = 0; i < this.W[l].length; i++)
                    a[j] += this.W[l][i][j] * x[i];
                if(l != this.W.length-1)
                    a[j] = this.relu(a[j] + this.bias[l][j]);
                else
                    a[j] = a[j] + this.bias[l][j];
            }
            x = [...a];
            a = [];
        }
        return x;
    }
    this.predict = function(input){
        this.y = this.forwardPropagation(input);
        switch(this.y.indexOf(max(this.y))){
            case 0:
                res = LEFT_ARROW;
                break;
            case 1:
                res = DOWN_ARROW;
                break;
            case 2:
                res = RIGHT_ARROW;
                break;
            case 3:
                res = UP_ARROW;
                break;
        }
        return res;
    }
}