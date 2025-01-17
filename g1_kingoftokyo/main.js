$(document).ready(initializeApp);
var game = null;
function initializeApp() {
  game = new KingOfTokyo();
}

class KingOfTokyo {
  constructor() {
    this.volumeLevel = .7;
    this.handleMonsterDeath = this.handleMonsterDeath.bind(this);
    this.playerArray=[
      new Monsters("DRAKONIS", 'images/drakonis.jpg', this.handleMonsterDeath),
      new Monsters("GIGAZAUR", 'images/gigazaur.jpg', this.handleMonsterDeath),
      new Monsters("CYBERKITTY", 'images/cyberkitty.jpg', this.handleMonsterDeath),
      new Monsters("ALIENOID", 'images/alienoid.jpg', this.handleMonsterDeath)
    ]
    this.monstersArray = ["m1", "m2", "m3", "m4"];
    this.rollDiceArray = [1, 2, 3, "Heart", "Attack"];
    $(".close").on("click",this.resetGame);
    this.addMonstersCounter =0;
    this.currentMonsterCounter=0;
    this.rollDice = this.rollDice.bind(this);
    this.startGame = this.startGame.bind(this);
    this.moveMonstersToTokyo = this.moveMonstersToTokyo.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.currentMonsterModal =this.currentMonsterModal.bind(this);
    $(".start").on("click",this.startGame);
    $(".roll").on("click",this.rollDice);
  }

  currentMonsterModal(resultOfDiceRoll,currentMonster){
    debugger;
    var textToAppendToModal =null;
    switch (resultOfDiceRoll) {
      case 1:
      case 2:
      case 3:
       textToAppendToModal = currentMonster.monstersName+" stars up by "+resultOfDiceRoll;
        break;
      case 'Heart':
        textToAppendToModal = currentMonster.monstersName + " added 1 " + resultOfDiceRoll;
        break;
      case 'Attack':
        textToAppendToModal = currentMonster.monstersName + " " + resultOfDiceRoll+ "s all monsters outside tokyo";
    }
    $(".overlay").css("display","block")
    $(".modal2 > p").append(textToAppendToModal);
    setTimeout(function(){
      $(".overlay").hide();
      $(".modal2 > p").empty();
      this.moveMonstersToTokyo();
    }.bind(this),1500)
  }

  resetGame(){
    $("#playerContainer").empty();
    $(".start").css("visibility", "visible");
    $(".modal-content").css("visibility", "hidden");
    $(".modal").css("display", "none");
    $(".roll").css("visibility", "hidden");
    $("#tokyo").css("visibility", "hidden");
    $(".dicevalue").text("");
  }

  handleMonsterDeath( monster ){
    var monsterIndex = this.playerArray.indexOf(monster);
    if(monsterIndex===-1){
      console.error('could not find monster');
    }
    this.playerArray.splice(monsterIndex, 1);
  }

  rollDice() {
    var randomNum = Math.floor(Math.random()*this.rollDiceArray.length);
    var diceValue = this.rollDiceArray[randomNum];
    $(".dicevalue").text( diceValue );
    this.handleDiceResult( diceValue );
    $(".dicevalue").append(this.diceValue);
    this.gotoNextMonster();
    //this.moveMonstersToTokyo();
  }

  handleDiceResult(result){
    this.currentMonsterToPassToCurrentMonsterModal = this.playerArray[this.currentMonsterCounter];
    switch(result){
      case 1:
      case 2:
      case 3:
        this.playerArray[ this.currentMonsterCounter ].addStars( result );
        this.playSound('sounds/point.wav');
        break;
      case 'Heart':
        this.playerArray[ this.currentMonsterCounter ].addHeart( 1 );
        this.playSound('sounds/heart.wav');
        break;
      case 'Attack':
        this.damageMonsters(1, this.playerArray[this.currentMonsterCounter]);
        this.playSound('sounds/hit.wav');
        setTimeout( function(){
          $('.takingDamage').removeClass('takingDamage');
        }, 500)
    }
    this.currentMonsterModal(result,this.currentMonsterToPassToCurrentMonsterModal);
  }

  playSound( file ){
    var player = new Audio(file);
    player.volume = this.volumeLevel;
    player.play();
  }

  damageMonsters( damageAmount, exemptMonster ){
    var monstersToDamage = this.playerArray.slice();
    monstersToDamage.splice( monstersToDamage.indexOf( exemptMonster), 1);
    for( var monsterIndex = 0; monsterIndex < monstersToDamage.length; monsterIndex++){
      var currentMonster = monstersToDamage[ monsterIndex ];
      currentMonster.removeHeart( damageAmount );
    }
  }

  startGame() {
    debugger;
    this.addMonstersCounter = 0;
    $(".roll").css("visibility", "visible");
    $("#tokyo").css("visibility", "visible");
    $(".start").css("visibility", "hidden");
    for( var monsterIndex = 0; monsterIndex < this.playerArray.length; monsterIndex++){
      var domElement= this.playerArray[ monsterIndex ].render();
      $("#playerContainer").append(domElement);
      this.playerArray[monsterIndex].update()
    }
    $("#tokyo").addClass(this.monstersArray[0]);
  }

  moveMonstersToTokyo() {
    debugger;
    var prevIndex = this.addMonstersCounter;
    this.addMonstersCounter++
    if (this.addMonstersCounter === this.playerArray.length) { this.addMonstersCounter = 0 };
      $("#tokyo").addClass(this.monstersArray[this.addMonstersCounter]);
      $("#tokyo").removeClass(this.monstersArray[prevIndex]);

  }

  gotoNextMonster(){
    this.currentMonsterCounter++;
    if(this.currentMonsterCounter===this.playerArray.length){
      this.currentMonsterCounter = 0;
    }
  }

}

class Monsters {

  constructor(name, image, deathCallback) {
    this.callThisFunctionWhenIDie = deathCallback;
    this.monstersName = name;
    this.image = image;
    this.stars = 0;
    this.heart = 10;
    this.maxHearts = 10;
    this.deathCount=0;
    this.monsterPicture = null;
    this.addHeart=this.addHeart.bind(this);
    this.addStars = this.addStars.bind(this);
    this.removeHeart=this.removeHeart.bind(this);
    this.update = this.update.bind(this);
    this.checkForDeath=this.checkForDeath.bind(this);
    this.domElements = {
      container: null,
      hearts: null,
      stars: null,
      name: null
    }
  }


  addHeart(amount) {
    this.heart += amount;
    if(this.heart > this.maxHearts){
      this.heart = this.maxHearts;
    }
    this.update();
  }

  removeHeart(amount) {
    this.heart-=amount;
    this.domElements.container.addClass('takingDamage');
    this.checkForDeath();
    this.update();
  }

  addStars( amount ) {
    this.stars += amount
    this.update();
  }

  checkForDeath() {
    if (this.heart <= 0 ) {
      this.domElements.name.text(this.monstersName + " (DEAD )");
      this.callThisFunctionWhenIDie(this);
    }
  }

  update() {
    this.domElements.hearts.text(this.heart);
    this.domElements.stars.text(this.stars);

    if(this.stars > 5){
      debugger;
      $(".modal-content").css("visibility", "visible");
      $(".modal").css("display", "block");
      $(".close").css('background-image', 'url(' + this.image + ')')
      $(".close").text(this.monstersName+" WINS!! Play Again");
      for(var i =0; i<=3; i++){
        game.playerArray[i].stars = 0;
      }
      for (var j = 0; j <= 3; j++) {
        game.playerArray[j].heart = 10;
      }
      $("#tokyo").removeClass();

    }
  }

  render(){
    var container = $("<div>").addClass('monster').css('background-image', 'url(' + this.image + ')');
    var nameContainer= $("<span>").addClass('name').text(this.monstersName);
    var statsContainer = $("<div>").addClass('stats');
    var heartContainer = $("<div>").addClass('heart');
    var starsContainer = $("<div>").addClass('stars');
    statsContainer.append(heartContainer, starsContainer);
    container.append(nameContainer, statsContainer);
    this.domElements = {
      container: container,
      hearts: heartContainer,
      stars: starsContainer,
      name: nameContainer
    }
    return this.domElements.container;
  }

}
