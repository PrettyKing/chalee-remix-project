import { useNavigate } from "@remix-run/react";

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <button type="button" onClick={() => navigate(-1)}>
        返回
      </button>
    </div>
  );
}
