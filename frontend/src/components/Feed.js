import FeedItem from './FeedItem.js'
export default class Feed {
    constructor(vRouter, globalStore, mode, filterByCreatorUid, parentDivName, myProfile) {
        this.vRouter = vRouter;
        this.store = globalStore;
        this.myProfile = myProfile;

        this.feedPosition = 0;
        this.maxFeedLength = 1;

        this.mode = mode;
        this.parentDivName = parentDivName
        this.filterByCreatorUid = filterByCreatorUid

        // Fills feed with some items on initial page load
        // if (this.feedPosition = 0){
        //     this.loadFeed(this.filterByCreatorUid, this.parentDivName);
        // }

        window.addEventListener("scroll", () => {
            if (document.documentElement.scrollTop + window.innerHeight == document.documentElement.scrollHeight && this.vRouter.getCurrView() === this.mode) {
                // user has scrolled to the bottom of the page
                if (this.filterByCreatorUid !== null){
                    this.checkNewItems();
                    this.loadFeed(this.filterByCreatorUid, this.parentDivName);
                }
            }
        });
    }

    loadFeed() {
        console.log("feed pos ", this.feedPosition)
        console.log("max len ", this.maxFeedLength)
        if (this.feedPosition < this.maxFeedLength){
            this.createFeedItem();
            this.feedPosition += 1; 
        }
        else{
            this.animateBounce(this.parentDivName);
        }
    }
    
    checkNewItems(){
        if (this.filterByCreatorUid !== "") {
            this.store.processFetch("GET", null, `user?userId=${this.filterByCreatorUid}`, (body)=>{this.maxFeedLength = body.jobs.length});
        }
        else {
            this.store.processFetch("GET", null, `job/feed?start=0`, (body)=>{this.maxFeedLength = body.length});
        }
    }

    createFeedItem() {
        console.log("trying ", this.feedPosition);
        const feedItem = new FeedItem(this.store, this.myProfile);

        if (this.filterByCreatorUid !== "") {
            console.log("USER MODE!!!!!!")
            this.store.processFetch("GET", null, `user?userId=${this.filterByCreatorUid}`, (body)=>{this.fetchCallback(body.jobs, feedItem)});
        }
        else {
            console.log("JOB MODE!!!!!!")
            this.store.processFetch("GET", null, `job/feed?start=0`, (body)=>{this.fetchCallback(body, feedItem)});
        }
        
    }
    
    fetchCallback(body, feedItem) {
        this.maxFeedLength = body.length
        let data = body[this.feedPosition];
    
        if (body.length > 0){
            const parentDiv = document.querySelector(this.parentDivName);
            feedItem.makeSkeleton(data.id, parentDiv);
            feedItem.updateValues(data);
            
        }
        else{
            feedItem.destroy();
            this.feedPosition -= 1;
        }
    }

    animateBounce(contentDiv) {
        let feedView = document.querySelector(contentDiv);
        feedView.style.animation = "bounce 0.5s, glow 0.5s";
        // reset the animation after it finishes playing
        setTimeout(function() {
          feedView.style.animation = "";
        }, 500);
    }
}