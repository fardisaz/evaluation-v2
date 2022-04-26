# Visualisation-based approach for automatic idea evaluation
## Overview
Crowd ideation platforms contribute to many companies in discovering new solutions for various social problems. In this case, crowd ideation platforms announce their challenges and want people to propose their solutions. This leads to having a substantial number of ideas and selecting the winning ideas from this list can be challenging for these companies.

There are different criteria in selecting the winning ideas and one of them is creativity. The technology that is proposed in this project focuses on one of the creativity criteria, which is called novelty. 

In this project, the visualization concept was proposed in order to facilitate the rating process of ideas. Different visualization features were employed in this application. Defining all the ideas in a movable circle on a whiteboard, using the idea topic and extracted image of the idea description on the circle, and specifying a position range on the whiteboard for filtering can be an example of the employed visualization features in this application. Moreover, this application took advantage of semantic web technology as another part of its functionalities. 

This platform included two main steps. In the first stage, the expert needed to import and filter ideas as novel, not novel, or none by the help of visualization. Furthermore, it was required that the experts answer some questions during the ranking process. In the second step, the expert only imported the group of new ideas and the system would categorize them according to the rankings and give answers in the first stage collected from all other experts. In this phase, the keywords of old and new ideas were extracted and structured information about those keywords was retrieved from DBpedia. All of the information from the first and second stages were given to the text similarity calculator and the classification of the new ideas were visualized on the whiteboard. 
 
Taking advantage of visualization and knowledge facilitated the evaluation process for the users extensively. Last but not least, except the unclassified ideas, the automatic result was accurate by 90\%. 

## Technologies
* Vue.js 
* MongoDB
* Node. js & express
* POSTMAN
## Setup
```javascript
$ npm install
$ npm start
```


