const RESOLUTION = 40;
const CANVAS_DIMENSION = 400;
const TARGET = Math.pow((CANVAS_DIMENSION/RESOLUTION)-2,2);
const MUTATION_RATE = 0.005;
const POPULATION_SIZE = 4000;
const PERCENTAGE = 10;

const INPUT_LAYER = 25;
const HIDDEN_LAYER_1 = 16;
const HIDDEN_LAYER_2 = 8;
const OUTPUT_LAYER = 4;

const IS_DEAD = 0;
const IS_ALIVE = 1;
const FOOD_WAS_EATEN = 2;

const REWARD_CLOSE_TO_APPLE = .05;
const REWARD_FAR_FROM_APPLE = -.1;

const BASE_MAX_STEPS = 100;

var population;
var isPlaying;
var learningCompleted = false;
var game;

/* DRAWING FUNCTIONS*/
function setup() {
	canvas = createCanvas(CANVAS_DIMENSION,CANVAS_DIMENSION);
	canvas.parent("sketch-holder");
	population = new Population(TARGET, MUTATION_RATE, POPULATION_SIZE);
	isPlaying = true;
}
function draw() {
	if(isPlaying){
		population.update();
		best_snake = population.getBestSnakeIndex();
		population.drawGame(best_snake);
		population.drawStatistics();

		drawBestSnakeIndex(best_snake);
	}
	else{
		population.updateStatistics();
		if(population.learningCompleted()){
			winner = population.getWinner();
			storeParameters(winner);
			download_csv(population.getFitnessHistory(), "fitnessHistory");
			noLoop();
		}
		else{
			population.generate();
			population.mutate();
			isPlaying = true;
		}
	}
}
function drawBestSnakeIndex(best_snake){
	text("" + best_snake, width/2,width/2);
}
function download_csv(data, name) {
    var csv = '';
    if(data[0].length > 1){
	    data.forEach(function(row) {
	            csv += row.join(',');
	            csv += "\n";
	    });
	}
	else{
		csv = data.join(',');
		csv += '\n';
	}
 
    console.log(csv);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = name + '.csv';
    hiddenElement.click();
}
function storeParameters(snake){
	brain = snake.getBrain();
	weights = brain.getWeights();
	biases = brain.getBiases();
	for(let i = 0; i < weights.length; i++)
		download_csv(weights[i], "W" + (i+1));
	for(let i = 0; i < biases.length; i++)
		download_csv(biases[i], "bias" + (i+1));
}