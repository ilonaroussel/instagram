import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/feed">Feed</Link>
        <Link to="/profile">Profil</Link>
        <Link to="/PostForm">Créer un post</Link>
      </div>

      <div>
        {token ? (
          <button onClick={handleLogout}>Déconnexion</button>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: "1rem" }}>
              Connexion
            </Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
