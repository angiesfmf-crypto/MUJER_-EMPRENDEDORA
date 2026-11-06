import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../android-code/androidProjectSources';

export async function exportAndroidProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Root folder
  const rootFolder = zip.folder('MujerEmprendedora-Android');
  if (!rootFolder) return;

  // Add all Android files
  for (const file of ANDROID_PROJECT_FILES) {
    rootFolder.file(file.path, file.content);
  }

  // Generate blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'MujerEmprendedora_Android_Kotlin_Palmira.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
