1. When the end of the feed is reached, the feed bounces and background glows red to give users an elegant and unobtrusive visual confirmation.

2. Use of Singleton pattern for GlobalStore and the VirtualRouter

3. (Reusable Components) Use of classes for the feed, so multiple feeds can be created with minimal repeated code. For example the Home page requires a job feed, and user profiles should also show a feed of all the job posts they made. The Feed class can be instantiated differently to filter for job posts based on where the feed is located (Home or Profile page).

4. File uploading status indicator

5. File drag and drop. Area lights up when file is being dragged over it. Easier to use than selecting file from file browser.

Notes to self:
- Comments and Likes do not reflect immediately. Number count and the content in the list
- Updating own job post
- Date formating and post date (hours ago or date)