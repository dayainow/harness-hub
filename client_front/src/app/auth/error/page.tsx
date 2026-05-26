'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AuthErrorContent() {
  const params = useSearchParams();
  const reason = params.get('reason');

  return (
    <div
      style={{ background: '#0A0E14', minHeight: '100vh' }}
      className="flex items-center justify-center px-6"
    >
      <div className="max-w-md w-full text-center">
        <div className="text-6xl font-black mb-4 select-none">⚠️</div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: '#E2E8F0' }}>
          Authentication failed
        </h1>
        <p className="mb-4 leading-relaxed" style={{ color: '#64748B' }}>
          GitHub 로그인 중 오류가 발생했습니다. 다시 시도해주세요.
        </p>
        {reason && (
          <p className="mb-8 text-xs font-mono px-4 py-2 rounded-lg" style={{ background: '#1E2530', color: '#F87171' }}>
            {reason}
          </p>
        )}
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-lg font-bold"
          style={{
            background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
            color: '#0A0E14',
          }}
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  );
}
