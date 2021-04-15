import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <>
      {/* Navigation */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/positions">Positions</Link>
          </li>
          <li>
            <Link to="/deductions">Deductions</Link>
          </li>
        </ul>
      </nav>

      {/* Content */}
      <div>{children}</div>
    </>
  );
}
