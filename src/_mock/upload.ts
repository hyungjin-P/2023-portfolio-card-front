// 업로드 응답용 data URL. back 은 S3 URL 을 돌려주지만 목업은 브라우저 안에서 끝낸다.
// blob: URL 은 Angular sanitizer 가 막고, data: 는 허용한다(@angular/core 14.3 SAFE_URL_PATTERN).
export function toImageDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
