import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {useState, FormEvent} from "react";
import { useAuthStore } from "@/stores/auth_store";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const { logIn, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const isFormValid = loginId.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginId || !password) {
      return;
    }

    const result = await logIn({ loginId, password});

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md px-8 py-10 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            Ola
          </h1>
          <p className="text-slate-400 text-sm font-medium">관리자 로그인</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ID */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">아이디</label>
            <Input
              type="text"
              placeholder="admin"
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-sky-400 h-11"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">비밀번호</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-sky-400 h-11 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-lg text-rose-300 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full h-11 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <p className="text-center text-xs text-slate-500 mt-4">
            계정 분실 시 관리자에게 문의하세요.
          </p>
        </form>
      </div>
    </div>
  );
}
