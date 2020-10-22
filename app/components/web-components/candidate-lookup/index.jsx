import React, { useState, useEffect } from 'react'
import injectSheet from 'react-jss'
import superagent from 'superagent'
import { LookupForm } from './lookupForm'

const Preinject = props => {
  const [isDiabled, setIsDisabled] = useState(true)
  const [formValues, setFormValues] = useState({
    email: '',
    name: '',
    message: '',
  })
  const [infoMessage, setInfoMessage] = useState(null)
  const { classes } = props
  const handleChange = e => setFormValues({ ...formValues, [e.target.name]: e.target.value })
  const handleSendLink = e => {
    e.preventDefault()
    setInfoMessage('Sending you your recording url')
    logger.info('on the browser', formValues)
    const { email, name } = formValues
    const userInfo = Object.assign({}, props.userInfo, { email, name })
    superagent
      .post('/send/recorder-link')
      .send(userInfo)
      .end((err, res) => {
        if (err) {
          logger.error('Send recorder link error', err)
        }
        setInfoMessage(null)
        switch (res.statusCode) {
          case 200:
            logger.info('successfully posted')
            setFormValues({ ...formValues, message: res.body.message })
            break
          case 401:
            logger.info('invalid email')
            setFormValues({ ...formValues, message: res.body.message })
            break
          case 429:
            setFormValues({
              ...formValues,
              message: 'Too many attempts logging in, try again in 24 hrs',
            })
            break
          default:
            setFormValues({
              ...formValues,
              message: 'Make sure the information you entered is correct.',
            })
            break
        }
      })
  }

  return (
    <div className={props.classes.Container}>
      <div className={props.classes.Form}>
        <h1>Email Recording Link</h1>
        <form onSubmit={handleSendLink} className={props.classes.LookupForm}>
          <LookupForm
            classes={classes}
            formValues={formValues}
            handleChange={handleChange}
            handleSendLink={handleSendLink}
          />
        </form>
      </div>
    </div>
  )
}
const styles = {
  Container: {
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Montserrat , sans-serif',
    fontSize: '13px',
    marginTop: '3rem',
  },
  Form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
  },
  LookupForm: {
    border: '0.5px solid black',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    width: '30rem',
    maxWidth: '30rem',
    minHeight: '42rem',
    fontSize: 'inherit',
    '& form': {},
    '& label': {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '3rem',
      fontSize: 'inherit',
    },
  },
  disable: {
    backgroundColor: '#D3D3D3',
    float: 'right',
    width: '9rem',
    height: '3rem',
    fontSize: '1rem',
    fontWeight: '600',
    fontSize: 'inherit',
  },
  activeBtn: {
    backgroundColor: '#E5A650',
    cursor: 'pointer',
    float: 'right',
    width: '9rem',
    height: '3rem',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
  },
}

export default injectSheet(styles)(Preinject)
