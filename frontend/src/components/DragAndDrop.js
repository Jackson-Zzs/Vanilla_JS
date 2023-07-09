import { fileToDataUrl } from '../utils/helpers.js';
export default class DragAndDrop {
    constructor(parentDiv){
        this.dropzone = document.createElement("div");
        this.dropzone.classList = "dropzone";
        this.dropzone.innerText = "Drop image here";
      
        this.uploadingIndicator = document.createElement("p");
        this.uploadingIndicator.classlist = "file-uploading-indicator";
        this.uploadingIndicator.style.display = "none";
        this.uploadingIndicator.innerText = "Uploading...";
      
        this.successIndicator = document.createElement("p");
        this.successIndicator.classlist = "upload-success-indicator";
        this.successIndicator.style.display = "none";
        this.successIndicator.innerText = "Uploaded!";
      
        this.fileInput = document.createElement("input");
        this.fileInput.type = "file";
        this.fileInput.classlist = "image";
        this.fileInput.name = "image";
        this.fileInput.multiple = true;
        this.fileInput.accept = ".jpg,.jpeg,.png,.gif";
      
        const label = document.createElement("label");
        label.appendChild(this.fileInput);
      
        const container = document.createElement("div");
        container.appendChild(this.dropzone);
        container.appendChild(this.uploadingIndicator);
        container.appendChild(this.successIndicator);
        container.appendChild(label);

        this.parentDiv = parentDiv;
        this.dataUrl = null;
        
        this.parentDiv.appendChild(container);

        document.addEventListener("DOMContentLoaded", () => {
            this.fileInput.addEventListener("change", (event) => {
                const files = event.target.files;
                this.handleFiles(files);
            });
        
            this.dropzone.addEventListener("dragover", (event) => {
                this.dropzone.classList.add("active");
                this.handleDragOver(event);
            });

            this.dropzone.addEventListener("dragleave", () => {
                this.dropzone.classList.remove("active");
            });

            this.dropzone.addEventListener("drop", (event) => {
                this.dropzone.classList.remove("active");
                this.handleDrop(event, this.uploadingIndicator, this.handleFiles.bind(this))
            });
        });
    }

    getDataUrl(){
        return this.dataUrl;
    }

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    }
    
    handleDrop(event, uploadingStatus, callback) {
        event.preventDefault();
        uploadingStatus.style.display = "block";
        const files = event.dataTransfer.files;
        callback(files);
    }

    handleFiles(files) {
        const file = files[0];
        console.log(file)
        // Handle selected files here
        fileToDataUrl(file)
        .then(dataUrl => {
            this.dataUrl = dataUrl;
            this.uploadingIndicator.style.display = "none";
            this.successIndicator.style.display = "block";
        })
        .catch(error => {
            alert("Something went wrong with the file upload. " + error);
        });
    }
}