export async function getFonts() {
  const [regularRes, boldRes] = await Promise.all([
    fetch(
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/woff/Pretendard-Regular.woff'
    ),
    fetch(
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/woff/Pretendard-Bold.woff'
    ),
  ]);

  const [regular, bold] = await Promise.all([
    regularRes.arrayBuffer(),
    boldRes.arrayBuffer(),
  ]);

  return { regular, bold };
}
