import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  SyntheticEvent,
  useRef
} from 'react'

const delayWhenUserNotTyping = 1500

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
  setKeyword: React.Dispatch<React.SetStateAction<string>>
}

export const SearchBar: FunctionComponent<SearchBarProps> = ({ onClick, setKeyword }) => {
  const classes = useStyles()
  const timeoutRef = useRef<any>(null)

  const fireSearchIfNotKeepTyping = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      onClick()
      timeoutRef.current = null
    }, delayWhenUserNotTyping)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value)
    fireSearchIfNotKeepTyping()
  }

  const onSubmit = (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
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

