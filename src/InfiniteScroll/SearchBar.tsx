import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import Paper from '@material-ui/core/Paper'
import SearchIcon from '@material-ui/icons/Search'
import React, {
  FunctionComponent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState
} from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: '2px 4px',
    width: '80%',
    minWidth: 400,
    margin: '10px 10%'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  }
}))

interface SearchBarProps {
  onClick: (e?: SyntheticEvent) => {}
  keyword: {
    keyword: string
    setKeyword: React.Dispatch<React.SetStateAction<string>>
  }
}

export const SearchBar: FunctionComponent<SearchBarProps> = ({
  onClick,
  keyword
}) => {
  const classes = useStyles()
  const [throttle, setThrottle] = useState(false)

  useEffect(() => {
    if (!throttle) {
      // onClick()
      // console.log('click in effect')
      setThrottle(true)
    }
    setTimeout(() => setThrottle(false), 2000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword.keyword])
  
  const timeoutRef = useRef<any>(null)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    keyword.setKeyword(event.target.value)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      console.log('click')
      onClick()
      timeoutRef.current = null
    }, 1500)
  }

  const onSubmit = e => { 
    e.preventDefault()
    onClick()
  }

  return (
    <Paper component='form' className={classes.root} onSubmit={onSubmit}>
      <InputBase
        type='input'
        className={classes.input}
        placeholder='Search Github Repo'
        onChange={handleChange}
      />
      <IconButton
        type='button'
        className={classes.iconButton}
        onClick={onClick}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}
