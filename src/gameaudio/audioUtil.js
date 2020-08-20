import {Howl, Howler} from 'howler';

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