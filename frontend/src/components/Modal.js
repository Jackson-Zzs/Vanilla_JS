export default class Modal {
    constructor(store, jobId, myProfile, openModalBtn, mode){
        this.store = store;
        this.jobId = jobId;
        this.myProfile = myProfile;
        this.mode = mode;
        // <div class="modal">
        //     <div class="modal-window">
        //         <h2 class="modal-title">Modal Title</h2>
        //         <div class="modal-content">
        //             <p>Content</p>
        //         </div>
        //         <button class="close-modal">Close Modal</button>
        //     </div>
        // </div>

        // Creating elements
        this.modal = document.createElement("div");
        this.modalWindow = document.createElement("div");
        this.modalTitle = document.createElement("h2");
        this.modalContent = document.createElement("div");
        this.modalCloseBtn = document.createElement("button");
        this.openModalBtn = openModalBtn;

        this.modalCloseBtn.textContent = "Close";
        // Adding event listeners
        this.modalCloseBtn.addEventListener("click", () => {this.close()});
        this.openModalBtn.addEventListener("click", () => {this.open()});
        
        // Assigning classes
        this.modal.classList = "modal";
        this.modalWindow.classList = "modal-window";
        this.modalTitle.classList = "modal-title";
        this.modalContent.classList = "modal-content";
        this.modalCloseBtn.classList = "close-modal";
        this.openModalBtn.classList = "open-modal";

        // Putting it together
        this.modal.appendChild(this.modalWindow);
        this.modalWindow.appendChild(this.modalTitle);
        this.modalWindow.appendChild(this.modalContent);
        this.modalWindow.appendChild(this.modalCloseBtn);
    }

    update(content){
        this.contentChild = this.createElementFromContent(content);
        this.modalContent.appendChild(this.contentChild);
    }

    open(){
        const modalSpace = document.getElementById("modal-space");

        modalSpace.appendChild(this.modal);

        this.modal.style.display = "block";
    }

    close(){
        this.modal.style.display = "none";
    }

    createElementFromContent(content){
        const container = document.createElement("div");

        if (this.mode === "likes"){
            this.modalTitle.textContent = "Likes";

            content.forEach(element => {
                const name = document.createElement("p");
                name.textContent = element.userName;
                name.id = element.userId;
                name.addEventListener("click", ()=>{
                    this.myProfile.goToProfile(name.id);
                    this.close();
                });

                container.appendChild(name);
            });
            return container;
        }
        else if (this.mode === "comments"){
            console.log("Itsd a commenettttt")
            this.modalTitle.textContent = "Comments";

            content.forEach(element => {
                const commentBlock = document.createElement("div");
                commentBlock.classList = "comment-block";

                const name = document.createElement("p");
                name.textContent = element.userName;
                name.id = element.userId;
                name.addEventListener("click", ()=>{
                    this.myProfile.goToProfile(name.id);
                    this.close();
                });

                const comment = document.createElement("p");
                comment.textContent = element.comment

                commentBlock.appendChild(name);
                commentBlock.appendChild(comment);

                container.appendChild(commentBlock);
            });

            const commentForm = document.createElement("form");
            commentForm.classList = "make-comment";

            this.commentField = document.createElement("input");
            this.commentField.classList = "comment-field";
            this.commentField.type = "text";
            this.commentField.name = "comment"
            this.commentField.value = "Type your comment here"

            const submitComment = document.createElement("input");
            submitComment.classList = "submit-comment";
            submitComment.type = "submit";
            submitComment.value = "Post Comment";
            submitComment.addEventListener("click", (event) => {
                event.preventDefault();

                let data = {"id": this.jobId, "comment": this.commentField.value};
                this.store.processFetch("POST", data, "job/comment", (body)=>{
                    if (Object.keys(body).length !== 0){
                        alert("Modal: Commenting failed. " + body.error)
                    }
                    else{
                        console.log("Comment posted successfully")
                    }
                })
            });

            commentForm.appendChild(this.commentField);
            commentForm.appendChild(submitComment);

            container.appendChild(commentForm);
            return container;
        }
        else{
            alert("Modal.js: Invalid mode")
            const text = document.createElement("h2");
            text.textContent = "Invalid Mode"
            return text;
        }
    }
}