import Logo from "../../assets/Logo.svg";
import DropdownExpand from "../../assets/DropdownExpand.svg";
import DropdownCollapse from "../../assets/DropdownCollapse.svg";
import LogoutBtn from "../../assets/LogoutBtn.svg";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

type Props = {
    onMenuOpen: () => void;
    onMenuClose: () => void;
    isMobileMenuOpen: boolean;
};

export default function Header({ onMenuOpen, onMenuClose, isMobileMenuOpen }: Props) {
    const { isAuthenticated, currentUser, logout } = useAuth();
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false); 
    const navigate = useNavigate();

    function getNavLinkClass({ isActive }: { isActive: boolean }) {
        return isActive ? "header__nav-link_active header__nav-link" : "header__nav-link";
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

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
                {isAuthenticated && (
                    <>
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
                        <ul className="header__menu" role="menu">
                            <li role="none">
                                <button
                                    type="button"
                                    className="header__dropdown-btn"
                                    aria-haspopup="menu"
                                    aria-expanded={isAccountMenuOpen}
                                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                                >
                                    {currentUser?.name}'s Account
                                    <img 
                                    className="header__dropdown-icon"
                                    src={isAccountMenuOpen ? DropdownCollapse : DropdownExpand }
                                    />
                                </button>
                            </li>
                        {isAccountMenuOpen && (
                            <li role="none">
                                <button
                                    type="button"
                                    className="header__dropdown-btn header__logout-btn"
                                    role="menuitem"
                                    onClick={handleLogout}
                                >
                                    Logout
                                    <img className="header__logout-btn-img" src={LogoutBtn} />
                                </button>     
                            </li>)}   
                        </ul>       
                    </>
                )}
                
            </nav>
        </header>
    );
}