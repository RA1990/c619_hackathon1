$(document).ready(initializeApp);
var player1;
var player2;
var player3;
var player4;
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
      //this.player1,this.player2,this.player3,this.player4];
    this.monstersArray = [".monster1", ".monster2", ".monster3", ".monster4"];
    this.rollDice1 = [1, 2, 3, "Heart", "Attack"];
    //this.heart = null;
    //this.stars = null;
    //this.attack = null;
    this.addMonstersCounter =0;
    this.currentMonsterCounter=0;
    // this.currentPlayer1 = true;

    this.rollDice = this.rollDice.bind(this);
    this.startGame = this.startGame.bind(this);
    this.moveMonstersToTokyo = this.moveMonstersToTokyo.bind(this);
    this.monstersStatRender = this.monstersStatRender.bind(this);
    $(".start").on("click",this.startGame);
    $(".roll").on("click",this.rollDice);

  }
  handleMonsterDeath( monster ){

    // for( var monsterIndex = 0; = 0; monsterIndex <= this.playerArray.length; monsterIndex++){
    //   if( this.playerArray[currentIndex] === monster){
    //     break;
    //   }
    // }
    var monsterIndex = this.playerArray.indexOf(monster);
    if(monsterIndex===-1){
      console.error('could not find monster');
    }
    this.playerArray.splice(monsterIndex, 1);
  }

  rollDice() {
    var randomNum = Math.floor(Math.random()*this.rollDice1.length);
    var diceValue = this.rollDice1[randomNum];
    $(".dicevalue").text( diceValue );
    this.handleDiceResult( diceValue );
    $(".dicevalue").append(this.diceValue);
    this.gotoNextMonster();
    this.moveMonstersToTokyo();
  }
  handleDiceResult(result){
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
        debugger;
        this.damageMonsters(1, this.playerArray[this.currentMonsterCounter]);
        this.playSound('sounds/hit.wav');
        setTimeout( function(){
          $('.takingDamage').removeClass('takingDamage');
        }, 500)
    }
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
    $(".start").css("visibility","hidden");
    for( var monsterIndex = 0; monsterIndex < this.playerArray.length; monsterIndex++){
      var domElement= this.playerArray[ monsterIndex ].render();
      $("#playerContainer").append(domElement);
      this.playerArray[monsterIndex].update()
    }
    $(".tokyo").text(this.monstersArray[0]);

  }
  moveMonstersToTokyo() {
    this.addMonstersCounter++
    if (this.addMonstersCounter === this.playerArray.length) { this.addMonstersCounter = 0 };
    $(".tokyo").text(this.monstersArray[this.addMonstersCounter]);
    //debugger;
  }
  gotoNextMonster(){
    this.currentMonsterCounter++;
    if(this.currentMonsterCounter===this.playerArray.length){
      this.currentMonsterCounter = 0;
    }
    if(this.playerArray.length===1){
      alert('last monster standing');
    }
  }
  monstersStatRender(){
    if (this.currentMonsterCounter === this.players.length) { this.currentMonsterCounter = 0 };
    var currentMonster = this.playerArray[this.currentMonsterCounter]
    $(this.monstersArray[this.addMonstersCounter]).append(currentMonster.render(`${this.monstersArray[this.currentMonsterCounter]} div:nth-child(2)`));
    this.currentMonsterCounter++;
    return;
  }
}
class Monsters {

  constructor(name, image, deathCallback) {
    this.callThisFunctionWhenIDie = deathCallback;
    this.monstersName = name;
    this.image = image;
    this.stars = 0;
    this.heart = 5;
    this.maxHearts = 5;
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
    // $(".roll").on("click", this.monsterDies);
  }


  addHeart(amount) {
  //  debugger;
    //console.log(event.target.firstElementChild.innerHTML);
    this.heart += amount;
    if(this.heart > this.maxHearts){
      this.heart = this.maxHearts;
    }
    this.update();
    //this.render();
  }

  removeHeart(amount) {
    //debugger;
    this.heart-=amount;
    this.domElements.container.addClass('takingDamage');
    this.checkForDeath();
    this.update();
    //this.render();
  }

  addStars( amount ) {
    // debugger;
    console.log('addStars ran');
    this.stars += amount
    this.update();

  }
  checkForDeath() {
    if (this.heart <= 0 ) {
      console.log("die")
      this.domElements.name.text(this.monstersName + " (DEAD )");

      this.callThisFunctionWhenIDie(this);

    }
  }

  update() {
    //debugger;
    //debugger;
    this.domElements.hearts.text(this.heart);
    this.domElements.stars.text(this.stars);

    if(this.stars > 5){
      alert("win")
    }
  }
/*
    <div class="monster1"><span class="name">DRAKONIS</span>
      <div class="stats">
        <div class="heart"></div>
        <div class="stars"></div>
      </div>
    </div>
    */
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
