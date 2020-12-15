## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Design Explanation

Infinite Scroll:
- use following arithmetic to calculate the timing of loading when scrolling:
scrollHeight - (clientHeight + scrollTop) < startToScrollIn
basically it means that data will start to be loaded when user scroll the close to bottom
- use hook "isThrottle" to prevent duplicated API call

Search Click:
- To prevent reach Github rate limit, only call API while user stop typing words
how to implement? just use setTimeout and clearTimeout, more info please see "fireSearchIfNotKeepTyping()"

Error Handling:
- use library "react-notifications-component" to show failed API call like "rate limit exceed"

Others:
- typescript is must, especially when you call the API and you need to define the interface of Response
- material-ui help you simply create a beautiful UI btw
