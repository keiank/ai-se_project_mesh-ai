import "./Login.css";
import { NavLink } from "react-router-dom";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";

export default function Login() {
    const { values, errors, isValid, handleChange } = useFormWithValidation();

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        if (!isValid) return;
        console.log(values);
    }

    function getNavLinkClass({ isActive }: { isActive: boolean }) {
        return isActive ?
            "active page-switchers__btn page-switchers__register-btn" :
            "page-switchers__btn page-switchers__login-btn";
    }
    
    return (
        <div className="auth-page">
            <div className="auth-page__header">
                <h1 className="auth-page__title">
                    Sign in
                </h1>
                <p className="auth-page__description">
                    Access your organization's secure workplace
                </p>
            </div>
            <div className="auth-page__main">
                <div className="page-switchers">
                    <NavLink
                        to="/login"
                        className={getNavLinkClass}
                    >
                        Login
                    </NavLink>
                    <NavLink
                        to="/register"
                        className={getNavLinkClass}
                    >
                        Register
                    </NavLink>
                </div>
                <form
                    className="form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-input__container">
                        <label className="form__label">
                        Email
                            <input
                            name="email"
                            type="email"
                            required
                            value={values.email}
                            className="form__input"
                            onChange={handleChange}
                            >
                            </input>
                        </label>
                        {errors.email && (
                            <span className="form__error-msg">{errors.email}</span>
                        )}
                    </div>
                    <div className="form-input__container">
                        <label className="form__label">
                        Password
                            <input
                            name="password"
                            type="password"
                            required
                            minLength={8}
                            value={values.password}
                            className="form__input"
                            onChange={handleChange}
                            >
                            </input>
                        </label>
                        {errors.password && (
                            <span className="form__error-msg">{errors.password}</span>
                        )}
                    </div>
                    <button
                    className="form__submit-btn"
                    type="submit"
                    disabled={!isValid}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}