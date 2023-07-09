import { BACKEND_PORT } from "../config.js";
import VirtualRouter from './VirtualRouter.js';
export default class GlobalStore {
    constructor(myProfile) {
        this.myProfile = myProfile;
        this.vRouter = new VirtualRouter(myProfile.loadMyProfile.bind(myProfile));
        this.homeFeed = null;
        this.myPosts = null;

        this.authToken = null;
        this.uid = null;
        this.password_used = null;

        const loginBtn = document.getElementById("login-btn");
        const registerBtn = document.getElementById("register-btn");
        const name = document.getElementById("name-auth-page");
        
        
        // Send POST request for Login
        loginBtn.addEventListener("click", (event) => {
            event.preventDefault(); // Prevents the form from submitting normally
        
            // Get the values of the email and password fields
            let email = document.getElementById("email-auth-page").value;
            this.password_used = document.getElementById("password-auth-page").value;
        
            let data = {"email": email, "password": this.password_used};
            this.processFetch("POST", data, "auth/login", (body)=>{
                this.authToken = body.token
                this.uid = String(body.userId)
                console.log(this.authToken)
                console.log(this.uid)
                this.myProfile.update(this, this.vRouter);
                this.vRouter.showView("home");
            })
        })
        
        // Send POST request for Register
        registerBtn.addEventListener("click", (event) => {
            event.preventDefault(); // Prevents the form from submitting normally
        
            // Get the values of the email and password fields
            let email = document.getElementById("email-auth-page").value;
            this.password_used = document.getElementById("password-auth-page").value;
        
            let data = {"email": email, "password": this.password_used, "name": name,};
            this.processFetch("POST", data, "auth/register", (body)=>{
                this.authToken = body.token;
                this.uid = String(body.userId)
                console.log(this.uid)
                alert("registration successful")
            })
        })
    }

    processFetch(method, body, url, callback) {
        console.log("Fetching", url);
        let options;
    
        if (body){
            options = {
                method: method,
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.authToken
                },
            }        
        }
        else {
            options = {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.authToken
                },
            }        
        }
    
        fetch(`http://localhost:${BACKEND_PORT}/${url}`, options)
            .then( response=>{
                return response.json()
            })
            .then(body=>{
                if(body.error){
                    alert("GlobalStore1: " + body.error)
                }else {               
                    callback(body)
                } 
            })
            .catch(error => {
                //alert("GlobalStore2: " + error)
                alert(`GlobalStore2: ${error}`)
                console.log(url)
            });
    }

    getAuthToken() {
        return this.authToken;
    }

    getUid(){
        return this.uid;
    }

    getUsedPassword(){
        return this.password_used;
    }
}