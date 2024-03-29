import React, { useRef, useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { FaEnvelope, FaExternalLinkAlt, FaLinkedinIn, FaLock, FaRegEnvelope, FaUser, FaWhatsapp } from 'react-icons/fa';
import { ReactComponent as Signinlogo } from '../styles/img/sign-in-logo.svg';
import { ReactComponent as Signuplogo } from '../styles/img/sign-up-logo.svg';
import '../styles/Auth.css';
import axios from 'axios';
import { userInfo } from '../Redux/User/actionUser';
import { customerAdd } from '../Redux/Customer/actionCustomer';
import { transactionAdd } from '../Redux/Transaction/actionTransaction';
import UserContext from '../context/UserContext';

const Auth = () => {

    const userContext = useContext(UserContext)
    let history = useHistory();
    const dispatch = useDispatch();

    const [userLogin, setUserLogin] = useState({
        usernameLogin: 'demo',
        passwordLogin: 'demo'
    });

    const [userRegistration, setUserRegistration] = useState({
        usernameRegistration: '',
        emailRegistration: '',
        passwordRegistration: '',
        confirmPassword: ''
    });

    const handleChangeLogin = e => {
        setUserLogin({ ...userLogin, [e.target.id]: e.target.value });
    }

    const handleChangeRegistration = e => {
        setUserRegistration({ ...userRegistration, [e.target.id]: e.target.value });
    }

    const authContainer = useRef(null);

    const [signUpMode, setSignUpMode] = useState('');
    const [themeColor, setThemeColor] = useState('#2271FF');

    const showSignup = () => {
        setSignUpMode('sign-up-mode');
    };

    const showLogin = () => {
        setSignUpMode('');
    }

    const login = () => {
        axios.post(process.env.REACT_APP_API_URL + '/login', userLogin)
            .then(response => {
                if (response.data.message) {
                    alert(response.data.message);
                } else {
                    dispatch(userInfo(response.data));
                    userContext.setUser(response.data);
                    userContext.setAuth(true);
                    getData(response.data.id);
                    history.push('/');
                }
            })
    }

    const register = () => {
        axios.post(process.env.REACT_APP_API_URL + '/register', userRegistration)
            .then(() => {
                setUserLogin({
                    usernameLogin: userRegistration.usernameRegistration,
                    passwordLogin: userRegistration.passwordRegistration
                })
                login();
            })
            .catch((error) => alert('Une erreur est survenue. ' + error));
    }

    const getData = (id_user) => {
        axios.get(process.env.REACT_APP_API_URL + '/customers/' + id_user)
            .then(res => res.data.forEach(cust => dispatch(customerAdd(cust))))
            .catch(err => alert(err));

        axios.get(process.env.REACT_APP_API_URL + '/transactions/' + id_user)
            .then(res => res.data.forEach(trans => dispatch(transactionAdd(trans))))
            .catch(err => alert(err));
    }


    const { usernameLogin, passwordLogin } = userLogin;
    const { usernameRegistration, emailRegistration, passwordRegistration, confirmPassword } = userRegistration;

    const disableRegistration = usernameRegistration === '' || emailRegistration === '' || passwordRegistration === '' || passwordRegistration !== confirmPassword ? true : false;
    const disableLogin = usernameLogin === '' || passwordLogin === '' ? true : false;

    return (
        <div className={'auth-container ' + signUpMode} ref={authContainer}>


            <div className="form-container">

                <div className="signin-signup">

                    <form className="sign-in-form">
                        <h2 className="title">Se connecter</h2>
                        <div className="input-field">
                            <i> <FaUser /> </i>
                            <input type="text" placeholder="Nom d'utilisateur" id="usernameLogin" value={usernameLogin} onChange={handleChangeLogin} />
                        </div>
                        <div className="input-field">
                            <i> <FaLock /> </i>
                            <input type="password" placeholder="Mot de passe" id="passwordLogin" value={passwordLogin} onChange={handleChangeLogin} />
                        </div>
                        <input type="button" value="Login" onClick={login} className="sign-btn solid" disabled={disableLogin} />

                        <p className="social-text">Contactez-moi sur mes réseaux</p>
                        <div className="social-media">
                            <a href="/" className="social-icon"> <FaRegEnvelope /> </a>
                            <a href="/" className="social-icon"> <FaWhatsapp /> </a>
                            <a href="/" className="social-icon"> <FaLinkedinIn /> </a>
                            <a href="/" className="social-icon"> <FaExternalLinkAlt /> </a>
                        </div>
                    </form>


                    <form className="sign-up-form">
                        <h2 className="title">S'inscrire</h2>
                        <div className="input-field">
                            <i> <FaUser /> </i>
                            <input type="text" placeholder="Nom d'utilisateur" id="usernameRegistration" value={usernameRegistration} onChange={handleChangeRegistration} />
                        </div>
                        <div className="input-field">
                            <i> <FaEnvelope /> </i>
                            <input type="text" placeholder="Email" id="emailRegistration" value={emailRegistration} onChange={handleChangeRegistration} />
                        </div>
                        <div className="input-field">
                            <i> <FaLock /> </i>
                            <input type="password" placeholder="Mot de passe" id="passwordRegistration" value={passwordRegistration} onChange={handleChangeRegistration} />
                        </div>
                        <div className="input-field">
                            <i> <FaLock /> </i>
                            <input type="password" placeholder="Confirmer mot de passe" id="confirmPassword" value={confirmPassword} onChange={handleChangeRegistration} />
                        </div>
                        <input type="button" value="S'inscrire" onClick={register} className="sign-btn solid" disabled={disableRegistration} />

                        <p className="social-text">Contactez-moi sur mes réseaux.</p>
                        <div className="social-media">
                            <a href="/" className="social-icon"> <FaRegEnvelope /> </a>
                            <a href="/" className="social-icon"> <FaWhatsapp /> </a>
                            <a href="/" className="social-icon"> <FaLinkedinIn /> </a>
                            <a href="/" className="social-icon"> <FaExternalLinkAlt /> </a>
                        </div>
                    </form>

                </div>
            </div>



            <div className="panels-container">

                <div className="panel left-panel">
                    <div className="content">
                        <h3>Nouveau ici ?</h3>
                        <p>N'hesitez pas, créer votre compte GRATUITEMENT maintenant.</p>
                        <button className="sign-btn transparent" onClick={showSignup}>S'inscrire</button>
                    </div>
                    <Signuplogo className="image" fill={themeColor} />
                </div>

                <div className="panel right-panel">
                    <div className="content">
                        <h3>Déja client(e) ?</h3>
                        <p>Connectez-vous maintenant.</p>
                        <button className="sign-btn transparent" onClick={showLogin}>Se connecter</button>
                    </div>
                    <Signinlogo className="image" fill={themeColor} />
                </div>
            </div>




        </div>
    );
};


export default Auth;