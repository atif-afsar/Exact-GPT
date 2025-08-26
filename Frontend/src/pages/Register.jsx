import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!firstname) e.firstname = 'First name required'
    if (!lastname) e.lastname = 'Last name required'
    if (!email) e.email = 'Email required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    axios.post('http://localhost:3000/api/auth/register', {  email, password, fullName: { firstName: firstname, lastName: lastname } }, { withCredentials: true })
    navigate('/')
  }

  return (
    <div className="container">
      <div className="card" role="region" aria-label="Register form">
        <div className="brand">
          <div>
            <h1>Create account</h1>
            <div className="lead">Start your journey with Exact GPT</div>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-row inline">
            <div className="field">
              <label className="label" htmlFor="firstname">First name</label>
              <input className={`input ${errors.firstname ? 'error' : ''}`} id="firstname" name="firstname" type="text" placeholder="First name" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
              {errors.firstname && <div className="error-text">{errors.firstname}</div>}
            </div>
            <div className="field">
              <label className="label" htmlFor="lastname">Last name</label>
              <input className={`input ${errors.lastname ? 'error' : ''}`} id="lastname" name="lastname" type="text" placeholder="Last name" value={lastname} onChange={(e) => setLastname(e.target.value)} />
              {errors.lastname && <div className="error-text">{errors.lastname}</div>}
            </div>
          </div>

          <div className="form-row">
            <label className="label" htmlFor="email">Email</label>
            <input className={`input ${errors.email ? 'error' : ''}`} id="email" name="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-row">
            <label className="label" htmlFor="password">Password</label>
            <input className={`input ${errors.password ? 'error' : ''}`} id="password" name="password" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="helper">Use at least 8 characters. Mix letters and numbers.</div>
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          <div className="actions" style={{marginTop:10}}>
            <button className="btn" type="button" onClick={handleSubmit} disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
            <Link to="/login" className="btn ghost" aria-label="Sign in">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
