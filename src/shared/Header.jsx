import { NavLink } from 'react-router';
import styled from 'styled-components';
import logo from '../assets/checkmark.svg';
import styles from './Header.module.css';

const StyledLogo = styled.img`
  width: 50px;
  height: 50px;
`;


function Header({ title }) {
  return (
    <header className={styles.header}>
      <div className={styles.titleContainer}>
        <StyledLogo src={logo} alt="Todo List Logo" />
        <h1>{title}</h1>
      </div>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.active : styles.inactive
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? styles.active : styles.inactive
          }
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}
export default Header;
