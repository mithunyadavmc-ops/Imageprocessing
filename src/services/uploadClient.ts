export interface PreparedUploadPayload {
  image: string;
  filename: string;
  originalBytes: number;
  processedBytes: number;
  width: number;
  height: number;
}

const MAX_SERVERLESS_UPLOAD_BYTES = 3_500_000;

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
  let scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  let targetWidth = Math.max(1, Math.round(image.width * scale));
  let targetHeight = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to initialize image compression.');
  }

  const renderAndEncode = (quality: number) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
  };

  let jpegQuality = file.size > 4 * 1024 * 1024 ? 0.66 : 0.74;
  let dataUrl = renderAndEncode(jpegQuality);
  let estimatedBytes = estimateBase64Bytes(dataUrl);

  // Keep payload under common serverless limits by degrading quality and resolution.
  let attempts = 0;
  while (estimatedBytes > MAX_SERVERLESS_UPLOAD_BYTES && attempts < 5) {
    attempts += 1;
    jpegQuality = Math.max(0.4, jpegQuality - 0.08);
    scale *= 0.9;
    targetWidth = Math.max(1, Math.round(image.width * scale));
    targetHeight = Math.max(1, Math.round(image.height * scale));
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    dataUrl = renderAndEncode(jpegQuality);
    estimatedBytes = estimateBase64Bytes(dataUrl);
  }

  if (estimatedBytes > MAX_SERVERLESS_UPLOAD_BYTES) {
    throw new Error('Image is too large for deployment upload limits. Please use a smaller image.');
  }

  return {
    image: dataUrl,
    filename: file.name.replace(/\.[^.]+$/, '') + '.jpg',
    originalBytes: file.size,
    processedBytes: estimatedBytes,
    width: targetWidth,
    height: targetHeight,
  };
}