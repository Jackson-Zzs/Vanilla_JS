export default class VirtualRouter {
    constructor(loadMyProfile) {
        this.globalStore = null;
        this.currView = null;
        this.loadMyProfile = loadMyProfile;
        this.views = {
            "auth" : [document.getElementById("auth-container"), () => {console.log("Auth container loaded")}],
            "home" : [document.getElementById("feed-view"), () => {console.log("Home view loaded")}],
            "profile" : [document.getElementById("my-profile-view"), this.loadMyProfile],
            "poster-profile" : [document.getElementById("poster-profile-view"), () => {console.log("testing")}],
            "post" : [document.getElementById("post-view"), () => {console.log("Post view loaded")}],
        };

        // FRAGMENT BASED URL M7
        // window.addEventListener("hashchange", () => {
        //     const viewName = window.location.hash.slice(1);
        //     console.log(viewName);
        //     this.showView(viewName);
        // })
    }
    showView(viewType) {
        if (!this.globalStore){
            if(!this.globalStore.getAuthToken)
            alert("Please Login First")
        }
        else if (this.views[viewType]){
            for (let key in this.views) {
                const element = this.views[key][0]
                const callbackFunc = this.views[key][1]
                if (key == viewType){
                    this.currView = viewType;
                    element.style.display = "block";
                    callbackFunc();      
                }
                else{
                    element.style.display = "none"; 
                }
            }        
        }
    
        else{
            alert("View you are trying to load doesn't exist")
        }
    }

    updateStore(store){
        this.globalStore = store;
    }
    
    getCurrView(){
        return this.currView;
    }
}