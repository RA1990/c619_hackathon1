$(document).ready(initializeApp);
function initializeApp() {
  new KingOfTokyo();
  new Monsters();
}
class KingOfTokyo {
  constructor() {
    this.monstersArray = [".monster1", ".monster2", ".monster3", ".monster4"];
    this.rollDice1 = [1, 2, 3, "Heart", "Stars", "Attack"];
    this.heart = null;
    this.stars = null;
    this.attack = null;
    this.diceValue = null;
    this.addMonstersCounter =0;
    this.rollDice = this.rollDice.bind(this);
    this.addMonsters = this.addMonsters.bind(this);
    this.moveMonstersToTokyo = this.moveMonstersToTokyo.bind(this);
    $(".start").on("click",this.addMonsters);
    $(".roll").on("click",this.rollDice);
    $(".roll").on("click", this.moveMonstersToTokyo);

  }
  rollDice() {
    debugger;
    var randomNum = Math.floor(Math.random()*this.rollDice1.length-1);
    $(".dicevalue").text(this.rollDice1[randomNum]);
    //this.moveMonstersToTokyo();
  }
  addMonsters() {
    debugger;
    $(".start").css("visibility","hidden");
    var currentText = $(".tokyo").text();
    this.addMonstersCounter ;
    if(this.addMonstersCounter>3){this.addMonstersCounter=0};
    $(".tokyo").text(this.monstersArray[this.addMonstersCounter])
    this.addMonstersCounter++
  }
  moveMonstersToTokyo() {
    debugger;
    this.addMonstersCounter;
    if (this.addMonstersCounter > 3) { this.addMonstersCounter = 0 };
    $(".tokyo").text(this.monstersArray[this.addMonstersCounter])
    this.addMonstersCounter++
  }

}
class Monsters {
  constructor() {
    this.monstersName = null;
    this.stars = null;
    this.heart = null;
    this.monsterPicture = null;
  }
  addHeart() {
  }
  removeHeart() {
  }
  addStars() {
  }
  monsterDies() {
  }
  render() {
  }
}
