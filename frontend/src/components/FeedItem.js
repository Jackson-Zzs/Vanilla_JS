import Modal from './Modal.js';
export default class FeedItem {
    constructor(GlobalStore, myProfile){
        this.id = null;
        this.store = GlobalStore;
        this.myProfile = myProfile;

        this.infoDiv = document.createElement("div");

        this.jobPoster = document.createElement("p");
        this.postDate = document.createElement("p");
        this.newContent = document.createElement("p");
        this.insertPic = document.createElement("img");
        this.title = document.createElement("p");
        this.startingDate = document.createElement("p");
        this.jobDescription = document.createElement("p");
        this.likesCount = document.createElement("button");
        this.like = document.createElement("button");
        this.commentCount = document.createElement("button");

        this.like.addEventListener("click", () => {
            let data = {"id": this.id, "turnon": true};
            this.store.processFetch("PUT", data, "job/like", (body)=>{
                // !!! ATTENTION working but like is not reflected immediately. Need to address this later.
            })
        });

        this.likesModal = null;
        this.commentsModal = null;

        this.jobPoster.addEventListener("click", () => {
            let posterUid = this.jobPoster.textContent;
            this.myProfile.goToProfile(posterUid);
        });
    }

    makeSkeleton(jobId, parentDiv) {
        this.id = jobId;
        this.likesModal = new Modal(this.store, this.id, this.myProfile, this.likesCount, "likes");
        this.commentsModal = new Modal(this.store, this.id, this.myProfile, this.commentCount, "comments");

        this.infoDiv.className = "feed-item";
        // Setting IDs
        this.title.id = `n${this.id}-title`
        this.jobPoster.id = `n${this.id}-jobPoster`
        this.postDate.id = `n${this.id}-postDate`
        this.startingDate.id = `n${this.id}-startingDate`
        this.insertPic.id = `n${this.id}-insertPic`
        this.jobDescription.id = `n${this.id}-jobDescription`
        this.likesCount.id = `n${this.id}-likesCount`
        this.like.id = `n${this.id}-like`
        this.commentCount.id = `n${this.id}-commentCount`

        // Setting classes
        this.title.classList = `feed-item-title`
        this.jobPoster.classList = `feed-item-jobPoster`
        this.postDate.classList = `feed-item-postDate`
        this.insertPic.classList = `feed-item-insertPic`
        this.startingDate.classList = `feed-item-startingDate`
        this.jobDescription.classList = `feed-item-jobDescription`
        this.likesCount.classList = `feed-item-likesCount`
        this.like.classList = `feed-item-like`
        this.commentCount.classList = `feed-item-commentCount`
        
        this.like.textContent = "Like"
        // add the new heading and content to the new div
        this.infoDiv.appendChild(this.title);
        this.infoDiv.appendChild(this.jobPoster);
        this.infoDiv.appendChild(this.postDate);
        this.infoDiv.appendChild(this.startingDate);
        this.infoDiv.appendChild(this.insertPic);
        this.infoDiv.appendChild(this.jobDescription);
        this.infoDiv.appendChild(this.likesCount);
        this.infoDiv.appendChild(this.like);
        this.infoDiv.appendChild(this.commentCount);
    
        // add the new div to the parent div
        parentDiv.appendChild(this.infoDiv);
    }

    updateValues(data){
        this.infoDiv.querySelector(`#n${this.id}-title`).textContent = data.title;
        this.infoDiv.querySelector(`#n${this.id}-jobPoster`).textContent = data.creatorId;
        this.infoDiv.querySelector(`#n${this.id}-postDate`).textContent = `Posted: ${this.formatDateTime(data.createdAt)}`;
        this.infoDiv.querySelector(`#n${this.id}-startingDate`).textContent = `Start Date: ${data.start}`;
        this.infoDiv.querySelector(`#n${this.id}-insertPic`).src = data.image;
        this.infoDiv.querySelector(`#n${this.id}-jobDescription`).textContent = `Description: ${data.description}`;
        this.infoDiv.querySelector(`#n${this.id}-likesCount`).textContent = `View Likes ${data.likes.length}`;
        this.infoDiv.querySelector(`#n${this.id}-commentCount`).textContent = `Comment ${data.comments.length}`;

        this.likesModal.update(data.likes);
        console.log(data)
        this.commentsModal.update(data.comments);
    }

    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        if (diffInHours < 24) {
            return `${diffInHours} hours and ${diffInMinutes} minutes ago`;
        } else {
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            return formattedDate;
        }
    }

    destroy(){
        this.infoDiv.remove();
    }
}