var canStartGame = false;
var canAttack = false;
var currentWord = "";
var gameStarted = false;

var pHealth = 0; //player health "hearts"
var pScore = 0; //player score
var eHealth = 0; //eneamy health "hearts"
var level = 0; //gives game difficulty, enemies appear with more health as you progress

var pressedKeys = [];

var words_countries = [
"Afghanistan", "Albania", "Algeria", "Andorra", 
"Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", 
"Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", 
"Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", 
"Botswana", "Brazil", "Brunei", "Bulgariav", "Burkina Faso", "Burma", "Burundi", 
"Cambodia", "Cameroon", "Canada", "Cabo Verde", "Central African Republic", "Chad", 
"Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Cote d'Ivoire", 
"Croatia", "Cuba", "Curacao", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", 
"Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", 
"Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", 
"Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", 
"Guyana", "Haiti", "Holy See", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", 
"Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", 
"Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", 
"Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
"Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", 
"Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", 
"Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Namibia", "Nauru", "Nepal", 
"Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", 
"Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", 
"Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", 
"Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent", "Samoa", "San Marino", 
"Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", 
"Singapore", "Sint Maarten", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", 
"South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", 
"Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", 
"Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", 
"Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
"United Kingdom", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

var words_foods = [
"asparagus", "apples", "avacado", "alfalfa", 
"almond", "arugala", "artichoke", "applesauce", 
"antelope", "albacore tuna", "Apple juice", "Avocado", 
"Bruscetta", "bacon", "black beans", "bagels", "baked beans", 
"BBQ", "bison", "barley", "beer", "bisque", "bluefish", 
"bread", "broccoli", "buritto", "babaganoosh", "Cabbage", 
"cake", "carrots", "carne asada", "celery", "cheese", 
"chicken", "catfish", "chips", "chocolate", "chowder", 
"clams", "coffee", "cookies", "corn", "cupcakes", "crab", 
"curry", "cereal", "chimichanga", "dates", "dips", "duck", 
"dumplings", "donuts", "eggs", "enchilada", "eggrolls", 
"English muffins", "edimame", "eel sushi", "fajita", "falafel", 
"fish", "franks", "fondu", "French toast", "French dip", 
"Garlic", "ginger", "gnocchi", "goose", "granola", "grapes", 
"green beans", "Guancamole", "gumbov", "grits", 
"Graham crackers", "ham", "halibut", "hamburger", 
"honey", "huenos rancheros", "hash browns", "hot dogs", 
"hummus", "ice cream", "Irish stew", 
"Indian food", "Italian bread", "jambalaya", "jelly", 
"jerky", "jalapeño", "kale", "kabobs", "ketchup", "kiwi", 
"kidney beans", "kingfish", "lobster", "Lamb", "Linguinev", 
"Lasagna", "Meatballs", "Moose", "Milk", "Milkshake", "Noodles", 
"Ostrich", "Pizza", "Pepperoni", "Porter", "Pancakes", 
"Quesadilla", "Quiche", "Reuben", "Spinach", "Spaghetti", 
"Tater tots", "Toast", "Venison", "Waffles", "Wine", "Walnuts", 
"Yogurt", "Ziti", "Zucchini"
];





$(document).ready (function(){

	//////////////
	// INPUT /////---START
	//////////////

	$("button").click(function() {
 		if(canStartGame && !gameStarted){
			gameFunctions("start");
		}

		if(canAttack && gameStarted){
			var keyClicked = $(this).html();
			if(!pressedKeys.includes(keyClicked)){
				pressedKeys.push(keyClicked);
				keyAI(keyClicked);
			}
		}
	});

	$(document).keypress(function(e) {
		if(canStartGame && !gameStarted){
			gameFunctions("start");
		}

		if(canAttack && gameStarted && isKeyALetter(e.which)){
			var keyClicked = String.fromCharCode(e.which).toUpperCase();
			if(!pressedKeys.includes(keyClicked)){
				pressedKeys.push(keyClicked);
				keyAI(keyClicked);
			}
		}
	});

	function isKeyALetter(k) {
		var key_OR_not = String.fromCharCode(k);
		if(key_OR_not.match("[a-zA-Z]+")){
			return key_OR_not;
		}
	}

	function keyAI(k) {

		canAttack = false; //STOP further "attacks"... during this function

		//LOOP through the letter buttons and do important things
		var letter_buttons = document.getElementsByTagName("button");
		for (var lb = 0; lb < letter_buttons.length; lb++) {

    		var currentButton = document.getElementsByTagName("button")[lb];

			//FIND the button "lb" corresponding to your pressed key "k"
			if(k == currentButton.innerHTML){

    			//CHECK if pressed key is in the current hidden word				
    			k = k.toUpperCase();
    			var word = currentWord.toUpperCase();
    			if (word.includes(k)) {

    				//YOU GUESSED AN ENTIRE WORD CORRECTLY!

    				adjustStats("pScore", "raise");

    				currentButton.setAttribute("id", "key-picked_PASS");

    				//UPDATE the hidden text to display 
    				//by looping through the letters of the current word
    				for (var c=0; c < word.length; c++) { 

    					//if the letter mattches k
    					if(word.charAt(c) == k){
 							
 							//split the hidden text letters into an array
							var hiddenText = $( "#spellText" ).text().split(" ");
							hiddenText.pop(); //remove some garbage
							hiddenText[c] = k; //update correctly guessed letter

    						$( "#spellText" ).empty(); //CLEAR hidden word display before updating

    						//replace the corresponding _ (hidden letter) with guessed letter
    						for (var t = 0; t < hiddenText.length; t++) {
    							$( "#spellText" ).append(hiddenText[t]+" ");
    						}

    						// IF hidden text CONTAINS no more  _(hidden letters)
    						if(!hiddenText.includes("_")){
    							console.log("Player Completed a word!");

    							adjustStats("pScore", "raise");
    							adjustStats("pHealth", "raise");
    							enemyAI("hit");
    						}
    					} 
    				}
    			}else{
    				//IF the prssed key ISNT within the current hidden word...
    				//player loses health AND or Game Over
    				if(pHealth >0){
    					adjustStats("pHealth", "lower");
    					currentButton.setAttribute("id", "key-picked_FAIL");
    				}else{
    					gameFunctions("gameOver");
    				}
    			}
    		}
    	}
    }

	//////////////
	// INPUT /////---END
	//////////////



	//////////////
	// GAME *THANGS* /////---START
	//////////////

    function gameFunctions(which) {

    	if(which === "reset"){
    		canStartGame = false;

    		adjustStats("pHealth", "reset");
    		adjustStats("pScore", "reset");

    		adjustStats("infoText", "Welcome To");
    		adjustStats("spellText", "Brian's Hangman!");
    		adjustStats("alertText", "");

    		$( "#enemy_H" ).attr("class", "hideEnemy");
    		$( "#enemyHearts" ).html("");

    		pressedKeys = [];
    		pressedKeys.length = 0;

			canStartGame = true;
			canAttack = false;
			currentWord = "";
			gameStarted = false;

			pHealth = 0;
			pScore = 0;
			eHealth = 0;
			level = 0;
    	}

    	if(which === "start"){

    		//FADE the start Button
    		$( "#startButton_H" ).children(":first").attr("class", "startB_fade");
    		
    		//FADE the start button holder
    		$( "#startButton_H" ).attr("class", "startB_H_fade");
    		//HIDE the Start Button Holder after a time
    		setTimeout(function(){
    			$( "#startButton_H" ).attr("class", "startB_H_hide");
    		}, 500);

    		canStartGame = false;
    		gameStarted = true;

    		adjustStats("infoText", "");
    		adjustStats("spellText", "");
    		adjustStats("alertText", "");
    		adjustStats("pHealth", "start");

    		gameFunctions("newLevel");
    	}

    	if(which === "newLevel"){
    		level += 1;
    		enemyAI("newEnemy");
    		gameFunctions("newWord");
    	}

    	if(which === "newWord"){
    		gameFunctions("resetKeys");
    		$( "#spellText" ).empty();

    		var rand_Word_TYPE = Math.floor((Math.random() * 2) + 1);

    		if(rand_Word_TYPE == 1){
    			currentWord = words_countries[Math.floor((Math.random() * words_countries.length))];
    			animateLetters(currentWord, "Country");
    		}else{
    			currentWord = words_foods[Math.floor((Math.random() * words_foods.length))];
    			animateLetters(currentWord, "Food!");
    		}

		    console.log(currentWord); //CHEATERS UNCOMMENT THIS
		}

		if(which === "resetKeys"){
			
			pressedKeys = [];
			pressedKeys.length = 0;
			
			var allKeys = document.getElementsByTagName("button");
			for (var i = 0; i < allKeys.length; i++) {
				allKeys[i].setAttribute("id", "");
			}
		}

		if(which === "gameOver"){
			canAttack = false;

			adjustStats("infoText", "");
			adjustStats("spellText", "GAME OVER");
			adjustStats("alertText", "");
		}
	}

	function animateLetters(word, type){
		//LOOP through the given word, and type it out on screen over time
		for (var i = 0; i < word.length; i++) {
			setTimeout(function(w){

				//IF the current character is an empty space, hard code the space
				if(currentWord.charAt(w) != " " && currentWord.charAt(w) != ""){
					$( "#spellText" ).append("_ ");
				}else{
					$( "#spellText" ).append("&nbsp; ");
				}

				//ALLOW the player to "attack" when the hidden word is typed out
				if($( "#spellText" ).text().length == (word.length *2) ){
					canAttack = true;
					adjustStats("infoText", "Hint: Type of " + type);
				}
			}, (i * 100) , i);
		}
	}


	function adjustStats(which, how) {

		//PLAYER HEALTH
		if (which == "pHealth") {

			if(how == "reset"){ pHealth = 0;}
			if(how == "start"){ pHealth = 10;}
			if(how == "lower"){	pHealth -= 1; 
								alertPOP("Lost 1 Health!");
							    shakeThings("hero");
								tintThings("hero");}
			if(how == "raise"){ pHealth += 1; 
								alertPOP("Gained 1 Health!");}

			$( "#health" ).html(pHealth);
		}

		//PLAYER SCORE
		if (which == "pScore") {
			if(how == "reset"){	pScore = 0;}
			if(how == "raise"){	pScore += 1; alertPOP("+1 Score!");}
			if(how == "word"){ 	pScore += 2; alertPOP("Guessed the word! Score +2");}

			$( "#score" ).html(pScore);
		}

		//INFO & ALERT TEXT
		if(which == "infoText" || which == "spellText"  || which == "alertText"){
			$( "#"+which ).html(how);
		}
	}

    function alertPOP(t){
    	$( "#alertText" ).html(t);
    	setTimeout(function(){
    		$( "#alertText" ).html("");
    		canAttack = true;
    	}, 500);
    }

    function shakeThings(el) {
    	var thingToShake = document.getElementById(el);
    	var elClasses = thingToShake.classList;
    	if (elClasses.contains("shake")) { 
    		elClasses.remove("shake"); 
    	}
		thingToShake.classList.add("shake");

		setTimeout(function(){ elClasses.remove("shake"); }, 500);
    }

    function tintThings(el) {
    	// var thingToTint = document.getElementById(el);

    	//get its current background image src




	 //   	var bg_SRC = $( "#"+ el ).css( "background-image" );

		// var tint_str = "linear-gradient( rgba(255, 0, 0, 0.45), rgba(255, 0, 0, 0.45) ),";
	    
	 //    $( "#"+ el ).css( "background-image", tint_str + bg_SRC + "!important");



  //   	var elClasses = thingToTint.classList;
  //   	if (elClasses.contains("shake")) { 
  //   		elClasses.remove("shake"); 
  //   	}
		// thingToTint.classList.add("shake");

		// setTimeout(function(){ elClasses.remove("shake"); }, 500);
    }

	//////////////
	// GAME *THANGS* /////---END
	//////////////



	//////////////
	// ENEMY SPECIFIC /////---START
	//////////////

	function enemyAI(which){

		if(which == "newEnemy"){

			//pick enemy # and grab image
    		var rand_Slime = Math.floor((Math.random() * 26) + 1);
    		$("#enemy").css("background-image", "url(./assets/images/ghosts/"+rand_Slime+".png)");


    		//generate, clear current and append new .... enemy hearts
    		var rand_enemyHearts = Math.floor((Math.random() * level) + 1);
    		$( "#enemyHearts" ).html(""); 
    		eHealth = rand_enemyHearts;

    		for (var i = 0; i < rand_enemyHearts; i++) {
    			$( "#enemyHearts" ).append( $("<div>"));
    		}

    		$( "#enemy_H" ).attr("class", ""); //show new enemy
		}


		if(which == "hit"){

			console.log("Player hit the Enemy!");

			setTimeout(function(){ 
	    		$( "#enemyHearts" ).empty(); //pre-emptive emptying of this container

				//IS ENEMY STILL ALIVE
	    		if(eHealth>1){
	    			eHealth -=1;

	    			//APPEND updated hearts back
	    			for (var i = 0; i < eHealth; i++) {
	    				$( "#enemyHearts" ).append( $("<div>"));
	    			}
	    			gameFunctions("newWord");

	    		}else{
	    			console.log("Player defeated the Enemy!");

	    			adjustStats(pHealth, "raise"); 

	    			$( "#spellText" ).empty();
	    			$( "#enemy_H" ).attr("class", "hideEnemy");

		    		gameFunctions("resetKeys");

		    		setTimeout(function(){ gameFunctions("newLevel"); }, 500);
		    	}
	    	}, 500);

    		shakeThings("enemy");
    	}
    }

	//////////////
	// ENEMY SPECIFIC /////---STOP
	//////////////

    gameFunctions("reset");

});
