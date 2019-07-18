$(document).ready(initializeApp);
var player1;
var player2;
var player3;
var player4;

function initializeApp() {
  new KingOfTokyo();
  new Monsters();

}

class KingOfTokyo {
  constructor() {
    //debugger;
    this.player1 = new Monsters("DRAKONIS");
    this.player2 = new Monsters("GIGAZAUR");
    this.player3 = new Monsters("CYBERKITTY");
    this.player4 = new Monsters("ALIENOID");
    this.playerArray=[this.player1,this.player2,this.player3,this.player4];
    this.monstersArray = [".monster1", ".monster2", ".monster3", ".monster4"];
    this.rollDice1 = [1, 2, 3, "Heart","Attack"];
    //this.heart = null;
    //this.stars = null;
    //this.attack = null;
    this.diceValue = null;
    this.addMonstersCounter =0;
    this.currentMonsterCounter=0;
    // this.currentPlayer1 = true;

    this.rollDice = this.rollDice.bind(this);
    this.addMonsters = this.addMonsters.bind(this);
    this.moveMonstersToTokyo = this.moveMonstersToTokyo.bind(this);
    this.monstersStatRender = this.monstersStatRender.bind(this);
    $(".start").on("click",this.addMonsters);
    $(".roll").on("click",this.rollDice);
    $(".roll").on("click", this.moveMonstersToTokyo);
    $(".roll").on("click", this.monstersStatRender);

  }

  rollDice() {
    var randomNum = Math.floor(Math.random()*this.rollDice1.length);
    $(".dicevalue").text(this.rollDice1[randomNum]);
  }
  addMonsters() {
    $(".start").css("visibility","hidden");
    $(".tokyo").text(this.monstersArray[0]);

  }
  moveMonstersToTokyo() {
    this.addMonstersCounter++
    if (this.addMonstersCounter > 3) { this.addMonstersCounter = 0 };
    $(".tokyo").text(this.monstersArray[this.addMonstersCounter])
    //debugger;
}

monstersStatRender(){
  if (this.currentMonsterCounter > 3) { this.currentMonsterCounter = 0 };
  var currentMonster = this.playerArray[this.currentMonsterCounter]
  $(this.monstersArray[this.addMonstersCounter]).append(currentMonster.render(`${this.monstersArray[this.currentMonsterCounter]} div:nth-child(2)`));
  this.currentMonsterCounter++;
  return;
}
}
class Monsters {

  constructor(name) {
    this.monstersName = name;
    this.stars = 0;
    this.heart = 1;
    this.deathCount=0;
    this.monsterPicture = null;
    this.addHeart=this.addHeart.bind(this);
    this.addStars = this.addStars.bind(this);
    this.removeHeart=this.removeHeart.bind(this);
    this.render = this.render.bind(this);
    this.monsterDies=this.monsterDies.bind(this);
    $(".roll").on("click",this.addHeart);
    $(".roll").on("click", this.removeHeart);
    $(".roll").on("click", this.addStars);
    // $(".roll").on("click", this.monsterDies);
  }

  addHeart() {
   //debugger;
    var heart1 = event.target.firstElementChild.innerText;
    if(heart1 === "Heart"){
      this.heart++;
    }
    //this.render();
  }

  removeHeart() {
    //debugger;
  var attack= event.target.firstElementChild.innerText;
    if (attack === "Attack" ){
      this.heart-=1;
      console.log(this.heart);
    }
    //this.render();
  }

  addStars() {
    //debugger;
    var star = event.target.firstElementChild.innerText;
    this.stars=0;
    switch(star){
        case "1":
          this.stars+=1;
          break;
      case "2":
        this.stars+=2;
        break;
      case "3":
        this.stars+=3;
        break;
    }

  }
  monsterDies() {
    if(this.heart<1){
      console.log("die")


    }
  }

  render(string) {
    //debugger;
    var monster = string.slice(0,9)
    console.log(monster)
    //debugger;

    $(`${monster} .heart`).text(this.heart);
    $(`${monster} .stars`).text(this.stars);

    if (this.heart < 0 || this.heart === 0) {
      $(`${monster}`).text("death");
      $(`${monster}`).removeClass(".roll");
    }

    if(this.stars > 5){
      alert("win")
    }
  }



}
