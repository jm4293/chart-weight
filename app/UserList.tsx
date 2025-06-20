"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { fetchUsers } from "./action";
import { formatBirthDate } from "@/util/birth-format";
import { IUserModel } from "@/type/model/user";

const consonants = [
  "ㄱ",
  "ㄴ",
  "ㄷ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅅ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

// 한글 초성 추출 함수
function getInitialConsonant(str: string) {
  const cho = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];

  if (!str || str.length === 0) {
    return "";
  }

  const code = str.charCodeAt(0) - 0xac00;

  if (code < 0 || code > 11171) {
    return str[0];
  }

  return cho[Math.floor(code / 588)];
}

export default function UserList() {
  const router = useRouter();

  const [users, setUsers] = useState<IUserModel[]>([]);
  const [selectedConsonant, setSelectedConsonant] = useState<string | null>(
    null,
  );

  const [isPending, startTransition] = useTransition();

  const handleClick = (userId: number) => {
    router.push(`/${userId}`);
  };

  const filteredUsers = selectedConsonant
    ? users.filter(
        (user) => getInitialConsonant(user.name) === selectedConsonant,
      )
    : users;

  useEffect(() => {
    startTransition(() => {
      fetchUsers()
        .then((data) => setUsers(data))
        .catch((error) => {
          console.error("사용자 불러오기 실패:", error);
        });
    });
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <strong className="text-4xl">환자 명단</strong>

        <div className="flex gap-2 flex-wrap justify-center">
          <button
            className={`text-2xl p-3 rounded border ${
              selectedConsonant === null
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => setSelectedConsonant(null)}
          >
            전체
          </button>
          {consonants.map((c) => (
            <button
              key={c}
              className={`text-2xl p-4 rounded border ${
                selectedConsonant === c
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setSelectedConsonant(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {isPending ? (
        <p className="text-gray-400 p-4">불러오는 중...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>생년월일</th>
              <th>등록번호</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleClick(user.id)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td>{user.name}</td>
                  <td>{formatBirthDate(user?.birth)}</td>
                  <td>{user?.register || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>사용자가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
