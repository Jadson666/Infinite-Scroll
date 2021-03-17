## Application goal
implement infinite scroll on searching git repository by keyword

![search repo](/public/screen1.png)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Design Explanation

##### Infinite Scroll:
1. use following arithmetic to calculate the timing of loading when scrolling:
(basically it means that data will start to be loaded when user scroll the close to bottom)
```js
scrollHeight - (clientHeight + scrollTop) < startToScrollIn
```
2. use hook *isThrottle* to prevent duplicated API call

##### Searching Functionality:
1. To prevent reach Github rate limit, only call API while user stop typing words
how to implement? just use `setTimeout` and `clearTimeout`, more info please see `fireSearchIfNotKeepTyping()`

##### Error Handling:
1. use library **react-notifications-component** to show failed API call like "rate limit exceed"

##### Modularized:
1. use **Render props component** design pattern to modularize **InfiniteScroll**, you can use it in most of general case
via following the interface below
```ts
interface InfiniteScrollProps {
  Cell: FunctionComponent<{data: Item}>
  fetchData: () => Promise<AxiosResponse<IGitApiResponse>>
  onLoadSuccess: () => void
  onLoadFailed: (error: AxiosError) => void
  preventLoading: boolean
  children: (
    renderDataCell: (pk: string) => React.ReactNode,
    setData: (data: Item[]) => void,
    isThrottle: boolean
  ) => React.ReactNode
  startToScrollIn: number
}
```
2. also modularize **SearchBar**, which can be reuse via following the interface below
```ts
interface SearchBarProps {
  onSearch: (e?: SyntheticEvent) => {}
  onContentChange: (content: string) => void
  waitForFire: number
}
```

##### Others:
1. `typescript` is must, especially when you call the API and you need to define the interface of Response
2. material-ui help you simply create a beautiful UI btw
