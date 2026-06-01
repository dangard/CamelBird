import { TitleCasePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-face-off-critique",
    standalone: true,
    imports: [TitleCasePipe],
    templateUrl: "./face-off-critique.component.html",
    styleUrls: ["./face-off-critique.component.scss"],
})
export class FaceOffCritiqueComponent implements OnInit {
    adjectives: string[] = [
        "arbitrary",
        "obtuse",
        "void",
        "remedial",
        "inadequate",
        "uninteresting",
        "subpar",
        "asymmetrical",
        "failing",
        "confusing",
        "horrifying",
        "a missed opportunity",
        "contrived",
        "boring",
        "substandard",
        "shockingly inaccurate",
        "mundane",
        "anonymous",
        "unresolved",
        "a vessel of your ineptitude",
    ];
    sentenceStart = "Your creation is ";
    displayString = "";

    ngOnInit(): void {
        this.displayString = this.getCritique(3);
    }

    /**
     * Generate a random number up to a max value.
     * @param {number} words - Count of adjectives.
     * @return {string} the critique sttament.
     */
    public getCritique(words: number) {
        const sentence: string[] = [];
        let i = 0;
        while (i < words) {
            const word = this.getWord();
            if (!sentence.includes(word)) {
                sentence[i] = word;
                i++;
            }
        }

        const critiques = this.formatCritique(sentence);

        return this.sentenceStart + critiques;
    }

    refreshCritique(): void {
        this.displayString = this.getCritique(3);
    }

    /**
     * Utility to format an arry using conjunctions.
     * @param {string array} critiques - An array of strings
     * @return {string} a formatted string. "a, b and c"
     */
    private formatCritique(critiques: string[]) {
        return (
            critiques.slice(0, -1).join(", ") + " and " + critiques.slice(-1)
        );
    }

    /**
     * Get a random word.
     * @return {string} a random word.
     */
    private getWord() {
        const randomNumber = this.getRandomInt(this.adjectives.length);
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
