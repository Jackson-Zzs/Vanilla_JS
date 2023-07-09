import Feed from './Feed.js';
export default class MyProfile {
    constructor(){
        this.store = null;
        this.vRouter = null;

        const updateProfileButton = document.getElementById("update-btn-profile-page");
        updateProfileButton.addEventListener("click", (event) => {
            event.preventDefault(); // Prevents the form from submitting normally
        
            // Get the values of the fields
            const email = document.getElementById("email-profile-page").value;
            const password = document.getElementById("password-profile-page").value;
            const name = document.getElementById("name-profile-page").value;
            const image = document.getElementById("image-profile-page").value;
        
            let data = {"email": email, "password": password, "name": name, "image": image};
            this.store.processFetch("PUT", data, "user", (body)=>{
                if (Object.keys(body).length === 0){
                    alert("Sucessfully updated your details");
                }
            })
        });

        const followButtonFeed = document.getElementById("follow-btn-feed");
        followButtonFeed.addEventListener("click", (event) => {
            event.preventDefault(); // Prevents the form from submitting normally
        
            const followEmail = document.getElementById("follow-email").value;
        
            let data = {"email": followEmail, "turnon": true};
            this.store.processFetch("PUT", data, "user/watch", (body)=>{
                if (Object.keys(body).length === 0){
                    alert(`Successfully followed ${followEmail}`);
                }
                else {
                    alert("MyProfile: " + body.error)
                }
            });
        });
    }

    update(store, vRouter){
        this.store = store;
        this.vRouter = vRouter;
        this.myPosts = new Feed(this.vRouter, this.store, "profile", this.store.getUid(), "#my-posts", this);
    }

    loadMyProfile() {
        const emailInput = document.getElementById("email-profile-page");
        emailInput.value = "Loading...";
    
        const passwordInput = document.getElementById("password-profile-page");
        passwordInput.value = this.store.getUsedPassword();
    
        const nameInput = document.getElementById("name-profile-page");
        nameInput.value = "Loading...";
    
        const imageInput = document.getElementById("image-profile-page");
        imageInput.value = "Loading...";
    
        this.store.processFetch("GET", null, `user?userId=${this.store.getUid()}`, (body)=>{
            emailInput.value = body.email
            nameInput.value = body.name
            imageInput.value = body.image
        })
    }
    
    // !!! ATTENTION still need to display all jobs created by this profile
    goToProfile(uid) {
        this.vRouter.showView("poster-profile");
        this.store.processFetch("GET", null, `user?userId=${uid}`, (body)=>{
            let profileDiv = document.createElement("div");
            let emailElement = document.createElement("p");
            let nameElement = document.createElement("p");
            let watchedBy = document.createElement("p");
            let watchButton = document.createElement("button")
    
            emailElement.textContent = "Email: " + body.email;
            nameElement.textContent = "Name: " + body.name;
            watchedBy.textContent = `Watched by ${body.watcheeUserIds.length} others`;
            
            const setWatchButton = (checkId, email, watchButton, callback) => {
                this.store.processFetch("GET", null, `user?userId=${this.store.getUid()}`, (body)=>{
                    const watching = body.watcheeUserIds.includes(checkId)
                    callback(watching, email, watchButton);
                })
            }

            setWatchButton(body.id, body.email, watchButton, (watching, email, watchButton) => {
                if (watching){
                    watchButton.textContent = "unwatch"
                }
                else{
                    watchButton.textContent = "watch"
                }
    
                watchButton.addEventListener("click", () => {
                    let data = {"email": email, "turnon": !watching};
                    this.store.processFetch("PUT", data, "user/watch", (body)=>{
                        if (Object.keys(body).length === 0){
                            if (!watching){
                                alert(`Successfully followed ${email}`);
                            }
                            else{
                                alert(`Successfully unfollowed ${email}`);
                            }
                            
                        }
                        else {
                            alert("MyProfile: " + body.error)
                        }
                    });
                });
            });
    
            // let imageElement = document.createElement("img");
            // imageElement.setAttribute("src", body.image);
    
            while (profileDiv.firstChild) {
                myDiv.removeChild(myDiv.firstChild);
            }
    
            // append the new HTML elements to the profileDiv
            profileDiv.appendChild(emailElement);
            profileDiv.appendChild(nameElement);
            profileDiv.appendChild(watchedBy);
            profileDiv.appendChild(watchButton);
            // profileDiv.appendChild(imageElement);
    
            // select the "poster-profile-view" div and replace its contents with the new profileDiv
            let posterProfileView = document.getElementById("poster-profile-view");
            // Remove all the old content
            while (posterProfileView.firstChild) {
                posterProfileView.removeChild(posterProfileView.firstChild);
            }
            posterProfileView.appendChild(profileDiv);
    
            let postsDiv = document.createElement("div");
            postsDiv.id  = "my-profile-view-jobs-feed";
            posterProfileView.appendChild(postsDiv);
     
            const creatorPosts = new Feed(this.vRouter, this.store, "poster-profile", body.id, "#my-profile-view-jobs-feed", this);
        })
    }
}