# Four Week Plan
This plan will be updated regularly. It is our current plan for how we will progress and a list of goals.

This project is a sharing web application by [Tian Song](https://github.com/songty), [Ariel Spear](https://github.com/arielspear), and [Grant Stampfli](https://github.com/grantstampfli). Students at [Portland Code School](http://www.portlandcodeschool.com/).

## Week 1

### Tuesday
We will get the project's framework setup, and set up some basics we plan on needing.

* #### Project set up
We will need...

    * Caribou
    * Admit-one
    * Admit-one-ember
    * Migrations
    * Database
    * HEROKU
    * Travis
    * Coveralls
    * Code climate
    * David DM

* ##### Work on User Accounts. Making sure they can be created and logged into. 

  * Account creation
  * User Log-in 


### Wednesday
Set up test database, get posts to POST.

  * Setup tests for posting
  * Write up some posts back-end
  * User Authentication
  * Discuss if this is our minimal viable product yet
  * Reevaluate this week's plan


### Thursday
Work on anything not completed on time by this point, if we're all caught up reevaluate and keep going.

  * Play Catch-Up
  * Reevaluate this week's plan
  * Finishing back-end POST GET posts


### Friday
Continue Catch-Up and create plan for Week 2. Discuss TODO features.

  * Play Catch-Up
  * Work solo
    * Tian GET
    * Grant POST
    * Ariel Front-end/templates/CSS
  * Start front-end for POST GET posts
  * Setting up ember data, router, templates, POST/GET
  * Finalize Week 2's plan


## Week 2
By the end of this week we plan on having users and posts work on a very basic level. This is our minimal viable product. 

  * TEST THE FRONT END BETTER!
  * Put content up
    * Homepage
    * Create
  * Orginize posts by time
  * Have posts link to other user's profile pages
    * Change profile pages to display only content from that user
    * Create new Posts page to display all posts that exist
    * Logo/Favicon

### Monday
  * Move posts from profile to home
  * Add timestamps to posts
  * Sanatize user input via posts
  * Disscuss expectations of server/client APIs
  * Improve current tests

### Tuesday

  * server expectations for GET /api/posts
    * authorization token optional

  * client expectations for GET /api/posts
    * must have posts
    * posts must be an array
    * each post object must have:
      * id
      * user
      * content
      * createdAt
    * must have users
    * any referenced user from the list of posts will be included in users
    * each user object must have:
      * id
      * username


## Week 3

  * TBD

## Week 4

  * TBD

## What is the minimul viable product?

  * TBD

## TODO features:

  + Deleting account 
  + Edit profile / Gravatar setup
  + Change password
  + Upload pictures with post / AWS?
  + User ratings
  + Geolocation - using google mapping
  + User messaging
  + Editable Front End
  + Motion Captcha
  + Google authentification
  
