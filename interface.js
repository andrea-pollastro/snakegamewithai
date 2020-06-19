var images = document.getElementsByClassName("mnistNumber");
for(i = 0; i < images.length; i++){
	images[i].addEventListener('click', function(){
		explain = false;
		mnist_value = [...eval(this.id)];
		loop();
	});
}

var predictButton = document.getElementById("predict");
var explainButton = document.getElementById("explain");
predictButton.addEventListener('click', function(){
	explain = false;
	prediction = forwardPropagation(mnist_value);
	myChart.data.datasets[0].data[0] = prediction[9];
	for(i = 1; i < 10; i++){
		myChart.data.datasets[0].data[i] = prediction[i-1];
	}
	myChart.update();
	loop();
});
explainButton.addEventListener('click', function(){
	LRP();
	explain = true;
	loop();
});