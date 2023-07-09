import GlobalStore from './utils/GlobalStore.js';
import Feed from './components/Feed.js';
import MyProfile from './components/MyProfile.js';
import PostJob from './components/PostJob.js';
// #################################################################
// ############################# Setup #############################
// #################################################################
// PROFILE M4
const myProfile = new MyProfile();

// AUTHORISATION M1
const store = new GlobalStore(myProfile);

// FRAGMENT URL M7 [2.7.2] attempting...
const vRouter = store.vRouter; 
vRouter.updateStore(store);

// CREATE JOB M5
const postJob = new PostJob(store); 

//JOB FEED M2 & M3
// Feed.js contains Infinite Scroll M6 [2.6.1]
const homeFeed = new Feed(vRouter, store, "home", "", "#job-feed", myProfile);


// ##################################################################
// ############################# NavBar #############################
// ##################################################################
const navLinks = document.querySelectorAll(".nav-link");

// loop through the nav-links and add a click event listener to each one
for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function(event) {
    // get the element that was clicked on
    const clickedLink = event.target;
    const id = clickedLink.id
    // const content = clickedLink.textContent;
    vRouter.showView(id)
  });
}