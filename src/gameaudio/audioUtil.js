import {Howl, Howler} from 'howler';
import audioPath from './intro.m4a';
let audio;

export class backgroundAudio {
   constructor(audioPath) {
      this.audio = new Howl({
         src: [audioPath],
         autoplay: true,
         loop: true,
         volume: 1.0,
       });
   }
   play() {
      this.audio.play();
   }
   stop() {
      this.audio.stop();
   }
}

 export function introAudioStart() {
   audio = new Howl({
      src: [audioPath],
      autoplay: true,
      loop: true,
      volume: 1.0,
    });
    audio.play();
 }


 export function introAudioEnd() {
    audio.stop();
 }
