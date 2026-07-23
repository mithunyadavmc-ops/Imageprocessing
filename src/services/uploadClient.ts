export interface PreparedUploadPayload {
  image: string;
  filename: string;
  originalBytes: number;
  processedBytes: number;
  width: number;
  height: number;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to read the selected image.'));
    };

    image.src = objectUrl;
  });
}

function estimateBase64Bytes(dataUrl: string): number {
  const encoded = dataUrl.split(',')[1] || '';
  return Math.floor((encoded.length * 3) / 4);
}

export async function prepareImageForUpload(file: File): Promise<PreparedUploadPayload> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload a valid image file.');
  }

  const image = await loadImage(file);
  const maxDimension = 1280;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to initialize image compression.');
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight);
  const jpegQuality = file.size > 4 * 1024 * 1024 ? 0.68 : 0.76;
  const dataUrl = canvas.toDataURL('image/jpeg', jpegQuality);

  return {
    image: dataUrl,
    filename: file.name.replace(/\.[^.]+$/, '') + '.jpg',
    originalBytes: file.size,
    processedBytes: estimateBase64Bytes(dataUrl),
    width: targetWidth,
    height: targetHeight,
  };
}