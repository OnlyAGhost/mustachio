import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

declare var window: any;
declare var $: any;
declare var tracking: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('canvas') canvas;

  // Setup the mouth tracker
  tracker = new tracking.ObjectTracker(['mouth']);

  // base64Image: string = '';
  constructor(
    private camera: Camera
  ) {}

  ngAfterViewInit() {
    // Get the context of the canvas
    var ctx = this.canvas.nativeElement.getContext('2d');

    // Set the stepsize
    this.tracker.setStepSize(2);

    // Create the callback we want to occur when we track and event
    this.tracker.on('track', function(event) {
      // We have received event data
      if (event.data) {
        // Cycle through each mouth detected
        event.data.forEach(d => {
          // Create a new image for the mustach
          var mus = new Image();
          mus.src = 'assets/mustache.svg'
          // When it's loaded
          mus.onload = function() { 
            // Draw it on the canvas 10 pixels above the mouth
            ctx.drawImage(mus, d.x, d.y-10, d.width, d.height);
          }
        })
      }
    }) 
  }

  // Options for the camera
  options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 400,
    targetHeight: 400,
    correctOrientation: true
  }

  takePicture() {
    // Call the native device to get the picture
    this.camera.getPicture(this.options).then((imageData) => {
      // Create a base64 string of the image
      var base64Image = 'data:image/jpeg;base64,' + imageData;
      // Get our canvas so we can draw on it
      var ctx = this.canvas.nativeElement.getContext('2d');
      // Clear out the existing picture
      //ctx.ClearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      // Create an image from the string
      var img = new Image();
      img.src = base64Image;

      // Once it has loaded
      img.onload = function() {
        // Draw it on the canvas
        ctx.drawImage(img, 0, 0);
        // Run the tracker
        tracking.track('#canvas', this.tracker);
      }.bind(this)

     }, (err) => {
      // Handle error
     });
  }
}


