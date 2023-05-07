# instagram-pipeline
A pipeline to automatically translate text within psd files to different languages.  

# Installation
1. Install [nvm](https://github.com/nvm-sh/nvm).  
2. Install latest node version:  
```
nvm install node
```
3. Install dependencies:  
```
npm install
```

# Usage
1. Start the server with.  
```
node server.js
```
2. Open [localhost:3000](http://localhost:3000) in your browser.  
3. Select the language you want to translate to.  
4. Choose the psd file to translate.  
5. Click on "Translate".  
6. Wait for the translation to finish. The translated file will be downloaded automatically.  
7. Open the translated file in Photoshop.  
8. A warning will pop up. Click on "Update" to update the text layers.  

The warning will be something like this:  
```
Some text layers might need to be updated before they can be used for vector based output.  Do you want to update these layers now?
```
This is due to the fact that the text layers are not updated automatically.  

# Configuration
You can add more languages by adding them as an option in the select element in index.html at:  
```
<!-- Add more language options here -->
```  
