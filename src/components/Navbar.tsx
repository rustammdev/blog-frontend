import { NavLink } from "react-router-dom";

export default function Navbar() {
  const navbarLinks = [
    { url: "login", name: "Login" },
    { url: "register", name: "Register" },
    { url: "/post/create", name: "Create Post" },
  ];

  return (
    <div>
      {navbarLinks.map((item) => (
        <NavLink key={item.url} to={item.url}>
          {item.name}
        </NavLink>
      ))}
    </div>
  );
}
