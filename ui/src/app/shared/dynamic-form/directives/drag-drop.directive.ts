import {
  Directive,
  Output,
  EventEmitter,
  HostBinding,
  HostListener
} from "@angular/core";

@Directive({
  selector: "[appDragDrop]"
})
export class DragDropDirective {
  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding("style.background-color") private background = "transparent";
  @HostBinding("style.border-color") private borderColor = "#ff2b87";
  @HostBinding("style.opacity") private opacity = "1";

  //Dragover listener
  @HostListener("dragover", ["$event"]) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#40ad791f";
    this.borderColor = "#40ad79";
    this.opacity = "1";
  }

  //Dragleave listener
  @HostListener("dragleave", ["$event"]) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "transparent";
    this.borderColor = "#727272";
    this.opacity = "1";
  }

  //Drop listener
  @HostListener("drop", ["$event"]) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "transparent";
    this.borderColor = "#727272";
    this.opacity = "1";
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }
}
