import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-face-off-critique',
  templateUrl: './face-off-critique.component.html',
  styleUrls: ['./face-off-critique.component.scss']
})
export class FaceOffCritiqueComponent implements OnInit {

  adjectives :String[] = ['arbitrary','obtuse', 'void', 'remidial', 'inadequate',
    'uininteresting', 'subpar', 'assymetrical', 'failing', 'confusing',
    'horrifying', 'a missed opportunity', 'contrived', 'boring', 'substandard',
    'shockingly inaccurate', 'mundane', 'anonymouse', 'unresolved',
    'a vessel of your ineptitude'];
  sentenctStart: string = "Your creation is ";
  dispalyString: string = '';

  constructor() { }

  ngOnInit(): void {
    this.dispalyString = this.getCritique(3);
  }

  /**
  * Generate a random number up to a max value.
  * @param {number} words - Count of adjectives.
  * @return {string} the critique sttament.
  */
  public getCritique(words: number) {
    let sentence: String[] = [], i = 0;
    while (i < words) {
      let word = this.getWord();
      if (!sentence.includes(word)) {
        sentence[i] = word;
        i++;
      }
    }

    let critiques = this.formatCritique(sentence);

    return this.sentenctStart + critiques;
  }

  /**
  * Utility to format an arry using conjunctions.
  * @param {number} critiques - An array of strings
  * @return {string} a formatted string. "a, a and c"
  */
  private formatCritique(critiques: String[]) {
    return critiques.slice(0, -1).join(', ') + ' and ' + critiques.slice(-1);
  }

  /**
  * Get a random word.
  * @return {string} a random word.
  */
  private getWord() {
    let randomNumber = this.getRandomInt(this.adjectives.length);
    return this.adjectives[randomNumber];
  }

  /**
  * Generate a random number up to a max value.
  * @param {number} max - Highest number to return
  * @return {number} a random number.
  */
  private getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

}
