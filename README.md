# Actions Analytics Dashboard
This application is the frontend for the Actions Analytics Dashboard built using React. This application serves to provide analytics for **Watson Assistant** instances with the new  **Actions** skill. For this front-end to work, you will need to have setup the corresponding logging server (https://github.com/watson-developer-cloud/actions-logging-server) and have a webhook setup correctly in your Watson Assistant instance.

For the tutorial for the complete dashboard setup, visit https://zanderb98.medium.com/actions-analytics-for-watson-assistant-dee3df47ad41

## Setup
In this tutorial we will be using the *yarn package manager*. If you do not have yarn installed, please install yarn first (https://yarnpkg.com/getting-started/install)

Next, you will have to fork this repository and clone your version locally. Once you have the app locally on your machine, cd to the root directory of the app and run the following command to install the yarn dependencies:
> yarn

After all your yarn packages are installed, you will have to paste your logging server base url in *src/config.js* where it shows <PASTE_BASE_URL_HERE>. Here the url should look like **https://<my_url>/logging**

Once you setup you're url in the config, your app is ready to run. To start the app, just run the following command in command line from the root directory of your app:
> yarn start
