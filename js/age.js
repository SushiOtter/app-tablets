import { getAgeRange } from "./products.js";

const FACE_API_URL = new URL("../vendor/face-api/face-api.js", import.meta.url).href;
const MODEL_URL = new URL("../models/face-api/", import.meta.url).href;
const DETECTOR_OPTIONS = { inputSize: 224, scoreThreshold: 0.25 };

let libraryPromise = null;
let detectorPromise = null;
let modelsPromise = null;

function loadFaceApi() {
  if (window.faceapi) return Promise.resolve(window.faceapi);
  if (!libraryPromise) {
    libraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      let settled = false;
      const finish = error => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        script.onload = null;
        script.onerror = null;
        if (error) {
          script.remove();
          libraryPromise = null;
          reject(error);
        } else resolve(window.faceapi);
      };
      const timeout = setTimeout(() => finish(new Error("Tiempo agotado al cargar el modelo facial local.")), 10000);
      script.src = FACE_API_URL;
      script.async = true;
      script.onload = () => finish(window.faceapi ? null : new Error("El modelo facial local se cargó, pero no se inicializó."));
      script.onerror = () => finish(new Error("No se pudo cargar el modelo facial local."));
      document.head.appendChild(script);
    });
  }
  return libraryPromise;
}

async function loadDetector(faceapi) {
  if (!detectorPromise) {
    detectorPromise = faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL).catch(error => {
      detectorPromise = null;
      throw error;
    });
  }
  await detectorPromise;
  return faceapi;
}

export async function loadFaceDetector() {
  const faceapi = await loadFaceApi();
  return loadDetector(faceapi);
}

export async function detectFace(video) {
  const faceapi = await loadFaceDetector();
  const result = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions(DETECTOR_OPTIONS));
  if (!result) return null;
  const detection = result.detection || result;
  const { x, y, width, height } = detection.box;
  return {
    bbox: [x, y, width, height],
    score: detection.score,
    kind: "face"
  };
}

async function ensureAgeModels() {
  const faceapi = await loadFaceApi();
  await loadDetector(faceapi);
  if (!modelsPromise) {
    modelsPromise = faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL).catch(error => {
      modelsPromise = null;
      throw error;
    });
  }
  await modelsPromise;
  return faceapi;
}

export async function estimateAgeRange(video) {
  const faceapi = await ensureAgeModels();
  const result = await faceapi.detectSingleFace(
    video,
    new faceapi.TinyFaceDetectorOptions(DETECTOR_OPTIONS)
  ).withAgeAndGender();
  return result && Number.isFinite(result.age) ? getAgeRange(result.age) : null;
}
