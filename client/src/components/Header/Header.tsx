import Logo from "../../assets/Logo.svg";
import { NavLink } from "react-router-dom";
import "./Header.css";

type Props = {
    onMenuOpen: () => void;
    onMenuClose: () => void;
    isMobileMenuOpen: boolean;
};

export default function Header({ onMenuOpen, onMenuClose, isMobileMenuOpen }: Props) {
    function getNavLinkClass({ isActive }: { isActive: boolean }) {
        return isActive ? "header__nav-link_active header__nav-link" : "header__nav-link";
    }

    return (
        <header className={isMobileMenuOpen ? 'header header_mobile' : 'header'}>
            <button
            type="button"
            className="header__menu-btn"
            aria-label="Open menu"
            onClick={onMenuOpen}
            ></button>
            <img src={Logo}></img>
            <nav className={isMobileMenuOpen ? 'header__nav header__nav_mobile' : 'header__nav'}>
                <NavLink
                to="/knowledge"
                className={getNavLinkClass}
                onClick={onMenuClose}
                >
                    Knowledge Base
                </NavLink>
                <NavLink
                to="/chat"
                className={getNavLinkClass}
                onClick={onMenuClose}
                >
                    Chat
                </NavLink>
            </nav>
        </header>
    );
}