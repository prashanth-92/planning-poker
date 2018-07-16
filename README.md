# Planning Poker
Agile planning poker for story estimation. 

# Getting started
To run the project, please do the following steps:
1. Clone the repository.
2. Make sure you have node installed.
3. Run "npm install".
4. Run "node index.js".
5. Open your browser and go to "http://localhost:8081".
6. Do checkout the section for Atlassian JIRA and stash integration


# JIRA and Stash integration
You can get Attlassian JIRA and stash integration to facilitate easy retrieval of story from JIRA. Stash can be integrated to ensure only valid users login to the application.
Follow the below steps to do that:
1. Under index.js, replace your company jira URL instead of <$jira-url$>. 
2. Under index.js, replace your company stash URL instead of <$stash-url$>.
3. Under public/js/socket-helper.js, replace <$image-src-url$> with your company's image url by provind the user id for individual users and also uncomment lines 23 and 37 for replacing the user id with the appropriate id.
