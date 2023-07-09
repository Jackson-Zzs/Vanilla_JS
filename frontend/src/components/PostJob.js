import DragAndDrop from './DragAndDrop.js';
export default class PostJob {
    constructor(GlobalStore){
        this.store = GlobalStore;
        this.addJobForm = document.getElementById("add-job-form");
        this.dataUrl = null;

        this.uploadSpace = document.getElementById("post-file-upload");
        this.dragAndDrop = new DragAndDrop(this.uploadSpace);

        this.addJobForm.addEventListener("submit", (event) => {
            event.preventDefault(); // prevent the default form submission
          
            const formData = new FormData(this.addJobForm); // create a FormData object from the form
            
            let data = {};    
            // iterate over the form data and log each key-value pair to the console
            for (const [key, value] of formData.entries()) {
                if(key === "image"){
                    this.dataUrl = this.dragAndDrop.getDataUrl();
                    data[key] = this.dataUrl;
                }
                else{
                    data[key] = value;
                }
            }
        
            this.store.processFetch("POST", data, "job", (body)=>{
                const postId = body.id
                this.completedStatus.style.display = "none";
                console.log("Job post id:", postId)
            })
        })
    }
  
}