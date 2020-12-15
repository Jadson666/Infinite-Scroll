import moment from 'moment'
import { store } from 'react-notifications-component'

export const showNotification = () => {
  store.addNotification({
    title: 'Error!',
    message: 'rate limit exceed for Github API',
    type: 'danger',
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 3000,
      onScreen: true
    }
  })
}

export const getFromNow = (date) => {
  const m = moment(date)
  return m.fromNow()
}
