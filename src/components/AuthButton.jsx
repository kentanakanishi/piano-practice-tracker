import { useAuth } from '../contexts/AuthContext';
import './AuthButton.css';

export default function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) return null;

  if (user) {
    return (
      <div className="auth-area">
        <span className="auth-user">
          {user.user_metadata?.full_name || user.email}
        </span>
        <button className="auth-btn" onClick={signOut}>
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <button className="auth-btn" onClick={signInWithGoogle}>
      Googleでログイン
    </button>
  );
}
