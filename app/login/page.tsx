"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "./action";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    startTransition(async () => {
      const result = await loginAdmin(email, password);

      if (result?.success) {
        router.push("/admin/user");
      } else {
        setErrorMessage(result?.message || "로그인 실패");
      }
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">로그인</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[1024px] flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="아이디"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "로그인 중..." : "로그인"}
        </button>

        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
