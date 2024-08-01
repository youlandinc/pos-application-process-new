export const POSFindLabel = (
  options: Option[],
  val: number | string,
): string => {
  return options.find((item) => item.value === val)?.label || '';
};

export const POSSVGAnimation = (
  delay: number,
  duration: number,
  strokeWidth: number,
  timingFunction: string,
  strokeColor: string,
  repeat: boolean,
) => {
  const paths: NodeListOf<SVGPathElement> =
    document.querySelectorAll('.loading-svg');
  const mode = repeat ? 'infinite' : 'forwards';
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const length = path.getTotalLength();
    path.style.strokeDashoffset = `${length}px`;
    path.style.strokeDasharray = `${length}px`;
    path.style.strokeWidth = `${strokeWidth}px`;
    path.style.stroke = `${strokeColor}`;
    path.style.animation = `${duration}s svg-text-anim ${mode} ${timingFunction}`;
    path.style.animationDelay = `${i * delay}s`;
  }
};

export const POSGetImageSize = async (
  src: string,
): Promise<{ ratio: number; width: number; height: number } | void> => {
  if (!src) {
    return;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      resolve({ ratio, width, height });
    };
    img.onerror = reject;
  });
};

export const POSGetParamsFromUrl = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const urlObj = new URL(url);
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

export const POSGetRoundedCanvas = (
  sourceCanvas: HTMLCanvasElement,
  xWidth?: number,
  xHeight?: number,
) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const width = xWidth || sourceCanvas.width;
  const height = xHeight || sourceCanvas.height;

  if (!context) {
    return sourceCanvas;
  }

  canvas.width = width;
  canvas.height = height;
  context.imageSmoothingEnabled = true;
  context.drawImage(sourceCanvas, 0, 0, width, height);
  context.globalCompositeOperation = 'destination-in';
  context.beginPath();
  context.fill();
  return canvas;
};
